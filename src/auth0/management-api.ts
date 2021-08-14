import * as dotenv from "dotenv";
import { Enrollment, ManagementClient } from "auth0";

dotenv.config();

const authConfig = {
  domain: process.env.A0_DOMAIN,
  audience: process.env.A0_MAN_API_AUDIENCE,
  clientId: process.env.A0_MAN_API_CLIENT_ID,
  clientSecret: process.env.A0_MAN_API_CLIENT_SECRET,
};

if (
  !(
    authConfig.domain &&
    authConfig.audience &&
    authConfig.clientId &&
    authConfig.clientSecret
  )
) {
  process.exit(1);
}

const managementAPI = new ManagementClient({
  domain: authConfig.domain,
  clientId: authConfig.clientId,
  clientSecret: authConfig.clientSecret,
});

interface EnrollmentPlus extends Enrollment {
  phone_number: string;
}

export const getPhoneNumber = async (
  customerId: string
): Promise<string | null> => {
  const enrollments = (await managementAPI.getGuardianEnrollments({
    id: customerId,
  })) as EnrollmentPlus[];

  if (!enrollments) {
    return null;
  }

  for (const enrollment of enrollments) {
    const { type, phone_number: phoneNumber } = enrollment;
    if (type === "sms" && phoneNumber) {
      return phoneNumber;
    }
  }

  return null;
};
