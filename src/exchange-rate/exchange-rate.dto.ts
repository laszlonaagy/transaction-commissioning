export enum URL {
  exchangeRateConvertUrl = 'https://api.exchangerate.host/convert',
}

export type ExchangeRateInput = {
  from: string;
  to: string;
  date: string;
  amount: number;
};

export type ExchangeRateResponse = {
  motd: {
    msg: string;
    url: string;
  };
  success: true;
  query: {
    from: string;
    to: string;
    amount: number;
  };
  info: {
    rate: number;
  };
  historical: boolean;
  date: string;
  result: number;
};
