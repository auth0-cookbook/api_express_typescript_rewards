export interface BaseAccount {
  id: number;
  createdAt: number;
  balance: number;
  perks: string[];
}

export interface Account extends BaseAccount {
  customerId: number;
}
