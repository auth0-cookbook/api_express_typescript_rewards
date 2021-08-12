import { Perk } from "src/models/perk";

export interface Profile {
  customer: {
    customerId: string;
    name: string;
    email: string;
    emailVerified: boolean;
    phoneNumber: string;
    phoneNumberVerified: boolean;
  };
  rewards?: {
    accountId: string;
    createdAt: number;
    balance: number;
    perks: Perk[];
  };
}
