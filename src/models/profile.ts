import { Perk } from "src/models/perk";

export interface Profile {
  customer: {
    customerId: string;
    name: string;
    email: string;
    phoneNumber: string | null;
  };
  rewards?: {
    accountId: string;
    createdAt: number;
    balance: number;
    perks: Perk[];
  };
}
