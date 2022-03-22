export class TransactionInput {
  date: string;
  amount: number;
  currency: string;
  client_id: number;
}

export class TransactionInsertData extends TransactionInput {
  commission: number;
  base_currency?: string;
  base_amount: number;
}

export enum Currency {
  EUR = 'EUR',
}

export enum DiscountRuleForClientById {
  client_42 = 0.05,
}

export enum DefaultCommissionPercentage {
  percentage = 0.05,
}

export enum DefaultCommissionAmount {
  amount = 0.05,
}

export enum HighTurnoverDiscount {
  amount = 0.03,
}
