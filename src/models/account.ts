import { Perk } from "src/models/perk";

export interface Account {
  id: string;
  customerId: string;
  createdAt: number;
  balance: number;
  perks: Perk[];
}
