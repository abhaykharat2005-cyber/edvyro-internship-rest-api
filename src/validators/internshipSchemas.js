import { z } from 'zod';
const fields = {
  title: z.string().trim().min(3).max(100), domain: z.string().trim().min(2).max(80),
  mode: z.enum(['Remote','On-site','Hybrid']), location: z.string().trim().min(2).max(100),
  skills: z.array(z.string().trim().min(1).max(40)).min(1).max(20),
  openings: z.number().int().min(1).max(1000)
};
export const createInternshipSchema = z.object(fields).strict();
export const updateInternshipSchema = z.object(fields).partial().refine(v => Object.keys(v).length > 0, 'At least one field is required').strict();
