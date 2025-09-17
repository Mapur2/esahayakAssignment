import { createBuyerSchema, csvImportSchema } from '../validations';

describe('Validation Schemas', () => {
  describe('createBuyerSchema', () => {
    it('should validate a valid buyer', () => {
      const validBuyer = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        city: 'Chandigarh',
        propertyType: 'Apartment',
        bhk: '2',
        purpose: 'Buy',
        budgetMin: 1000000,
        budgetMax: 2000000,
        timeline: '3-6m',
        source: 'Website',
        notes: 'Looking for a 2BHK apartment',
        tags: ['urgent', 'premium'],
      };

      const result = createBuyerSchema.safeParse(validBuyer);
      expect(result.success).toBe(true);
    });

    it('should require BHK for Apartment and Villa', () => {
      const buyerWithoutBhk = {
        fullName: 'John Doe',
        phone: '1234567890',
        city: 'Chandigarh',
        propertyType: 'Apartment',
        purpose: 'Buy',
        timeline: '3-6m',
        source: 'Website',
      };

      const result = createBuyerSchema.safeParse(buyerWithoutBhk);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['bhk']);
      }
    });

    it('should validate budget constraints', () => {
      const buyerWithInvalidBudget = {
        fullName: 'John Doe',
        phone: '1234567890',
        city: 'Chandigarh',
        propertyType: 'Plot',
        purpose: 'Buy',
        budgetMin: 2000000,
        budgetMax: 1000000, // Less than min
        timeline: '3-6m',
        source: 'Website',
      };

      const result = createBuyerSchema.safeParse(buyerWithInvalidBudget);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['budgetMax']);
      }
    });

    it('should validate phone number format', () => {
      const buyerWithInvalidPhone = {
        fullName: 'John Doe',
        phone: '123', // Too short
        city: 'Chandigarh',
        propertyType: 'Plot',
        purpose: 'Buy',
        timeline: '3-6m',
        source: 'Website',
      };

      const result = createBuyerSchema.safeParse(buyerWithInvalidPhone);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['phone']);
      }
    });
  });

  describe('csvImportSchema', () => {
    it('should validate CSV import data', () => {
      const csvRow = {
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        phone: '9876543210',
        city: 'Mohali',
        propertyType: 'Villa',
        bhk: '3',
        purpose: 'Rent',
        budgetMin: 50000,
        budgetMax: 80000,
        timeline: '0-3m',
        source: 'Referral',
        notes: 'Looking for a villa',
        tags: 'luxury,pool',
        status: 'New',
      };

      const result = csvImportSchema.safeParse(csvRow);
      expect(result.success).toBe(true);
    });
  });
});

