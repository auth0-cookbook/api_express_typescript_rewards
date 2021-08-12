export interface CustomerDataValue {
  value: string;
  verified: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: CustomerDataValue;
  phoneNumber: CustomerDataValue;
  accountId?: string;
}
