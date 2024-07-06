import { z } from 'zod';

export const updateEmailSchema = z.object({
  email: z.string()
});