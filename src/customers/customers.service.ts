import { getPhoneNumber } from "../auth0/management-api";
import { customersCollection } from "../database/database.service";
import { Customer } from "../models/customer";
import { NewCustomerPayload } from "../models/payloads/new-customer-payload";

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
  const { id, name, email } = data;

  const phoneNumber = await getPhoneNumber(id);

  const newCustomer: Customer = {
    id,
    name,
    email,
    phoneNumber: phoneNumber || null,
  };

  customersCollection.push(newCustomer).write();

  return newCustomer;
};
