import { z } from 'zod';
export const createTeamSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1)
});