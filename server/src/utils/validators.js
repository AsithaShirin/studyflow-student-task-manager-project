import { z } from 'zod';
export const registerSchema = z.object({
  name: z.string().trim().min(2).max(60), email: z.email().transform((v) => v.toLowerCase()),
  password: z.string().min(8).max(72),
});
export const loginSchema = z.object({
  email: z.email().transform((v) => v.toLowerCase()), password: z.string().min(1).max(72),
});
export const taskSchema = z.object({
  title: z.string().trim().min(2).max(100),
  description: z.string().trim().max(1000).optional().default(''),
  dueDate: z.union([z.iso.datetime(), z.literal(''), z.null()]).optional().transform((v) => v || null),
  status: z.enum(['pending', 'completed']).optional().default('pending'),
}).strict();
