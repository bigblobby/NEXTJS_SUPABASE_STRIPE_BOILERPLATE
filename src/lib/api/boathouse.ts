'use server';

import axios, { AxiosError } from 'axios';

async function getBoathousePortal(
  email?: string | null,
  customerID?: string | null,
  returnUrl?: string | null
): Promise<any | null> {
  try {
    const response = await axios.post(process.env.BOATHOUSE_API!, {
      portalId: process.env.BOATHOUSE_PORTAL_ID!,
      secret: process.env.BOATHOUSE_SECRET!,
      email: email,
      paddleCustomerId: customerID,
      returnUrl: returnUrl,
    });

    return response.data;
  } catch (error) {
    if ((error as AxiosError) && (error as AxiosError).response) {
      console.debug((error as AxiosError).response?.data);
    } else if (error instanceof AxiosError) {
      console.debug((error as AxiosError).message);
    } else {
      console.error("An unexpected error occurred");
    }
    return null;
  }
}

export { getBoathousePortal };