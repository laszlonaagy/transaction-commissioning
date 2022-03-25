import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { ExchangeRateService } from './../exchange-rate/exchange-rate.service';
import { TransactionService } from './transaction.service';
import { TransactionInput } from './transaction.dto';

describe('TransactionController Unit Test', () => {
  let transactionController: TransactionController;

  beforeAll(async () => {
    const TransactionServiceProvider = {
      provide: TransactionService,
      useFactory: () => ({
        insertOne: jest.fn(() => Object),
        findByClientIdWithinActualMonth: jest.fn(() => []),
      }),
    };

    const ExchangeRateServiceProvider = {
      provide: ExchangeRateService,
      useFactory: () => ({
        convertCurrency: jest.fn(() => Object),
      }),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        TransactionService,
        TransactionServiceProvider,
        ExchangeRateServiceProvider,
      ],
    }).compile();

    transactionController = app.get<TransactionController>(
      TransactionController,
    );
  });

  it('calling commission method', () => {
    const dto = new TransactionInput();
    expect(transactionController.commission(dto)).not.toEqual(null);
  });

  it('calling commission method', async () => {
    const mockTransactionInput1: TransactionInput = {
      date: '2021-01-05',
      amount: '2000.00',
      currency: 'EUR',
      client_id: 42,
    };

    const mockTransactionInput2: TransactionInput = {
      date: '2021-01-04',
      amount: '100.00',
      currency: 'EUR',
      client_id: 1,
    };

    const mockTransactionInput3: TransactionInput = {
      date: '2021-01-03',
      amount: '1999.00',
      currency: 'EUR',
      client_id: 1,
    };

    expect(await transactionController.commission(mockTransactionInput1)).toBe(
      JSON.stringify({
        amount: 0.05,
        currency: 'EUR',
      }),
    );

    expect(await transactionController.commission(mockTransactionInput2)).toBe(
      JSON.stringify({
        amount: 0.5,
        currency: 'EUR',
      }),
    );

    expect(await transactionController.commission(mockTransactionInput3)).toBe(
      JSON.stringify({
        amount: 9.99,
        currency: 'EUR',
      }),
    );
  });
});
