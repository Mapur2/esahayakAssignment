import { db } from './db';
import { buyers, buyerHistory } from './schema';
import { eq, and, desc, asc, like, or, sql } from 'drizzle-orm';
import type { Buyer, NewBuyer, BuyerHistory, NewBuyerHistory } from './schema';

export interface BuyerFilters {
  city?: string;
  propertyType?: string;
  status?: string;
  timeline?: string;
  search?: string;
}

export interface BuyerSort {
  field: 'updatedAt' | 'fullName' | 'createdAt';
  direction: 'asc' | 'desc';
}

export async function createBuyer(data: NewBuyer, changedBy: string): Promise<Buyer> {
  const [buyer] = await db.insert(buyers).values(data).returning();
  
  // Create history entry
  const historyEntry: NewBuyerHistory = {
    buyerId: buyer.id,
    changedBy,
    diff: JSON.stringify({ action: 'created', fields: data }),
  };
  
  await db.insert(buyerHistory).values(historyEntry);
  
  return buyer;
}

export async function updateBuyer(
  id: string, 
  data: Partial<NewBuyer>, 
  changedBy: string,
  currentUpdatedAt: number
): Promise<Buyer> {
  // Check if record was modified
  const [existing] = await db.select().from(buyers).where(eq(buyers.id, id));
  
  if (!existing) {
    throw new Error('Buyer not found');
  }
  
  if (existing.updatedAt.getTime() !== currentUpdatedAt) {
    throw new Error('Record has been modified by another user. Please refresh and try again.');
  }
  
  const [updated] = await db
    .update(buyers)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(buyers.id, id))
    .returning();
  
  // Create history entry with diff
  const diff: Record<string, { old: any; new: any }> = {};
  for (const [key, value] of Object.entries(data)) {
    if (existing[key as keyof Buyer] !== value) {
      diff[key] = { old: existing[key as keyof Buyer], new: value };
    }
  }
  
  if (Object.keys(diff).length > 0) {
    const historyEntry: NewBuyerHistory = {
      buyerId: id,
      changedBy,
      diff: JSON.stringify(diff),
    };
    
    await db.insert(buyerHistory).values(historyEntry);
  }
  
  return updated;
}

export async function getBuyer(id: string): Promise<Buyer | null> {
  const [buyer] = await db.select().from(buyers).where(eq(buyers.id, id));
  return buyer || null;
}

export async function getBuyers(
  page: number = 1,
  pageSize: number = 10,
  filters: BuyerFilters = {},
  sort: BuyerSort = { field: 'updatedAt', direction: 'desc' }
): Promise<{ buyers: Buyer[]; total: number }> {
  const offset = (page - 1) * pageSize;
  
  // Build where conditions
  const conditions = [];
  
  if (filters.city) {
    conditions.push(eq(buyers.city, filters.city));
  }
  
  if (filters.propertyType) {
    conditions.push(eq(buyers.propertyType, filters.propertyType));
  }
  
  if (filters.status) {
    conditions.push(eq(buyers.status, filters.status));
  }
  
  if (filters.timeline) {
    conditions.push(eq(buyers.timeline, filters.timeline));
  }
  
  if (filters.search) {
    conditions.push(
      or(
        like(buyers.fullName, `%${filters.search}%`),
        like(buyers.phone, `%${filters.search}%`),
        like(buyers.email, `%${filters.search}%`)
      )!
    );
  }
  
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  
  // Build order by
  const orderBy = sort.direction === 'asc' 
    ? asc(buyers[sort.field]) 
    : desc(buyers[sort.field]);
  
  // Get total count
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(buyers)
    .where(whereClause);
  
  // Get paginated results
  const results = await db
    .select()
    .from(buyers)
    .where(whereClause)
    .orderBy(orderBy)
    .limit(pageSize)
    .offset(offset);
  
  return {
    buyers: results,
    total: count,
  };
}

export async function getBuyerHistory(buyerId: string, limit: number = 5): Promise<BuyerHistory[]> {
  return await db
    .select()
    .from(buyerHistory)
    .where(eq(buyerHistory.buyerId, buyerId))
    .orderBy(desc(buyerHistory.changedAt))
    .limit(limit);
}

export async function deleteBuyer(id: string, userId: string): Promise<void> {
  // Check ownership
  const [buyer] = await db.select().from(buyers).where(eq(buyers.id, id));
  
  if (!buyer) {
    throw new Error('Buyer not found');
  }
  
  if (buyer.ownerId !== userId) {
    throw new Error('You can only delete your own buyers');
  }
  
  await db.delete(buyers).where(eq(buyers.id, id));
}

export async function canEditBuyer(buyerId: string, userId: string): Promise<boolean> {
  const [buyer] = await db.select().from(buyers).where(eq(buyers.id, buyerId));
  return buyer?.ownerId === userId;
}
