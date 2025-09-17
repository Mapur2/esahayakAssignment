import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getBuyers } from '@/lib/queries';
import Papa from 'papaparse';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    
    // Get filters from query params
    const filters = {
      city: searchParams.get('city') || undefined,
      propertyType: searchParams.get('propertyType') || undefined,
      status: searchParams.get('status') || undefined,
      timeline: searchParams.get('timeline') || undefined,
      search: searchParams.get('search') || undefined,
    };
    
    // Get all buyers (no pagination for export)
    const { buyers } = await getBuyers(1, 10000, filters);
    
    // Format data for CSV
    const csvData = buyers.map(buyer => ({
      fullName: buyer.fullName,
      email: buyer.email || '',
      phone: buyer.phone,
      city: buyer.city,
      propertyType: buyer.propertyType,
      bhk: buyer.bhk || '',
      purpose: buyer.purpose,
      budgetMin: buyer.budgetMin || '',
      budgetMax: buyer.budgetMax || '',
      timeline: buyer.timeline,
      source: buyer.source,
      notes: buyer.notes || '',
      tags: buyer.tags || '',
      status: buyer.status,
    }));
    
    // Generate CSV
    const csv = Papa.unparse(csvData);
    
    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="buyers-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
    
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export buyers' },
      { status: 500 }
    );
  }
}

