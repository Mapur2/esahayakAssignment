import { z } from 'zod';

export const cityEnum = z.enum(['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other']);
export const propertyTypeEnum = z.enum(['Apartment', 'Villa', 'Plot', 'Office', 'Retail']);
export const bhkEnum = z.enum(['1', '2', '3', '4', 'Studio']);
export const purposeEnum = z.enum(['Buy', 'Rent']);
export const timelineEnum = z.enum(['0-3m', '3-6m', '>6m', 'Exploring']);
export const sourceEnum = z.enum(['Website', 'Referral', 'Walk-in', 'Call', 'Other']);
export const statusEnum = z.enum(['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped']);

export const createBuyerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(80, 'Full name must be at most 80 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().regex(/^\d{10,15}$/, 'Phone must be 10-15 digits'),
  city: cityEnum,
  propertyType: propertyTypeEnum,
  bhk: bhkEnum.optional(),
  purpose: purposeEnum,
  budgetMin: z.number().int().positive('Budget must be positive').optional(),
  budgetMax: z.number().int().positive('Budget must be positive').optional(),
  timeline: timelineEnum,
  source: sourceEnum,
  notes: z.string().max(1000, 'Notes must be at most 1000 characters').optional(),
  tags: z.array(z.string()).optional(),
}).refine((data) => {
  // bhk is required for Apartment and Villa
  if (['Apartment', 'Villa'].includes(data.propertyType) && !data.bhk) {
    return false;
  }
  return true;
}, {
  message: 'BHK is required for Apartment and Villa properties',
  path: ['bhk'],
}).refine((data) => {
  // budgetMax must be >= budgetMin if both are present
  if (data.budgetMin && data.budgetMax && data.budgetMax < data.budgetMin) {
    return false;
  }
  return true;
}, {
  message: 'Maximum budget must be greater than or equal to minimum budget',
  path: ['budgetMax'],
});

export const updateBuyerSchema = createBuyerSchema.partial().extend({
  id: z.string().uuid(),
  updatedAt: z.number(),
});

export const csvImportSchema = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().regex(/^\d{10,15}$/),
  city: cityEnum,
  propertyType: propertyTypeEnum,
  bhk: bhkEnum.optional(),
  purpose: purposeEnum,
  budgetMin: z.number().int().positive().optional(),
  budgetMax: z.number().int().positive().optional(),
  timeline: timelineEnum,
  source: sourceEnum,
  notes: z.string().max(1000).optional(),
  tags: z.string().optional(), // Will be parsed as JSON array
  status: statusEnum.optional(),
}).refine((data) => {
  if (['Apartment', 'Villa'].includes(data.propertyType) && !data.bhk) {
    return false;
  }
  return true;
}, {
  message: 'BHK is required for Apartment and Villa properties',
  path: ['bhk'],
}).refine((data) => {
  if (data.budgetMin && data.budgetMax && data.budgetMax < data.budgetMin) {
    return false;
  }
  return true;
}, {
  message: 'Maximum budget must be greater than or equal to minimum budget',
  path: ['budgetMax'],
});

export type CreateBuyerInput = z.infer<typeof createBuyerSchema>;
export type UpdateBuyerInput = z.infer<typeof updateBuyerSchema>;
export type CsvImportInput = z.infer<typeof csvImportSchema>;
