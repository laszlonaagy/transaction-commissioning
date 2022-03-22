import { Controller, Post, UsePipes, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { transactionBodySchema } from './transaction.validation';
import { BodyValidationPipe } from '../pipes/body.validation.pipe';
import {
  Currency,
  TransactionInput,
  DiscountRuleForClientById,
  DefaultCommissionPercentage,
  DefaultCommissionAmount,
  HighTurnoverDiscount,
} from './transaction.dto';
import { ExchangeRateService } from 'src/exchange-rate/exchange-rate.service';

@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly exchangeRateService: ExchangeRateService,
  ) {}

  @Post()
  @UsePipes(new BodyValidationPipe(transactionBodySchema))
  async commission(
    @Body() transactionInput: TransactionInput,
  ): Promise<string> {
    return JSON.stringify({
      amount:
        transactionInput.currency !== Currency.EUR
          ? await this.getAmountWithExchange(transactionInput)
          : await this.getAmountWithoutExchange(transactionInput),
      currency: Currency.EUR,
    });
  }

  getClientDeposit = async (transactionInput: TransactionInput) => {
    const deposit = this.transactionService.findByClientIdWithinActualMonth(
      transactionInput.client_id,
    );
    if (deposit) {
      const initialDeposit = 0;
      const totalDeposit = (await deposit).reduce(
        (prevAmmount, transactionAmmount) =>
          prevAmmount + transactionAmmount.base_amount,
        initialDeposit,
      );
      return totalDeposit;
    }
    return 0;
  };

  turnoverRule = async (transactionInput: TransactionInput) => {
    const clientDeposit = await this.getClientDeposit(transactionInput);
    if (clientDeposit) {
      return clientDeposit > 1000 ? HighTurnoverDiscount.amount : false;
    }
  };

  discountRule(transactionInput: TransactionInput) {
    return transactionInput.client_id === 42
      ? DiscountRuleForClientById.client_42
      : false;
  }

  defaultRule(transactionInput: TransactionInput) {
    const commissionAmount =
      (transactionInput.amount / 100) * DefaultCommissionPercentage.percentage;
    return commissionAmount < DefaultCommissionAmount.amount
      ? DefaultCommissionAmount.amount
      : commissionAmount;
  }

  applyRules(
    rules: ((transactionInput: TransactionInput) => any)[],
    transactionInput: TransactionInput,
  ) {
    let commissionAmount;
    rules.forEach(async (rule) => {
      if ((await rule(transactionInput)) !== false) {
        commissionAmount = await rule(transactionInput);
      }
    });
    return commissionAmount
      ? commissionAmount
      : this.defaultRule(transactionInput);
  }

  async getAmountWithExchange(transactionInput: TransactionInput) {
    const commissionAmount = await this.applyRules(
      [this.turnoverRule, this.discountRule],
      transactionInput,
    );

    const exhangeRateInput = {
      from: transactionInput.currency,
      to: Currency.EUR,
      date: transactionInput.date,
      amount: transactionInput.amount,
    };

    this.exchangeRateService.convertCurrency(exhangeRateInput).subscribe({
      next: async (exchangeRateResponse) => {
        this.transactionService.insertOne({
          ...transactionInput,
          commission: commissionAmount,
          base_currency: Currency.EUR,
          base_amount: exchangeRateResponse.result,
        });
      },
    });
    return commissionAmount;
  }

  async getAmountWithoutExchange(transactionInput: TransactionInput) {
    const commissionAmount = await this.applyRules(
      [this.turnoverRule, this.discountRule],
      transactionInput,
    );

    this.transactionService.insertOne({
      ...transactionInput,
      commission: commissionAmount,
      base_currency: Currency.EUR,
      base_amount: transactionInput.amount,
    });
    return commissionAmount;
  }
}
