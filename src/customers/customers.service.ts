import { customersCollection } from "../database/database.service";
import { Customer } from "../models/customer";
import { NewCustomerPayload } from "src/models/payloads/new-customer-payload";

export const findAllCustomers = async (): Promise<Customer[] | null> => {
  return customersCollection.value() || null;
};

export const findCustomerById = async (
  id: string
): Promise<Customer | null> => {
  return customersCollection.find({ id }).value() || null;
};

export const createCustomer = async (
  data: NewCustomerPayload
): Promise<Customer> => {
  const {
    id,
    name,
    email,
    emailVerified,
    phoneNumber,
    phoneNumberVerified,
  } = data;

  const newCustomer: Customer = {
    id,
    name,
    email: {
      value: email,
      verified: emailVerified,
    },
    phoneNumber: {
      value: phoneNumber,
      verified: phoneNumberVerified,
    },
  };

  customersCollection.push(newCustomer).write();

  return newCustomer;
};
