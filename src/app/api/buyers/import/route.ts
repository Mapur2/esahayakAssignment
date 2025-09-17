import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createBuyer } from '@/lib/queries';
import { csvImportSchema } from '@/lib/validations';
import Papa from 'papaparse';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    const text = await file.text();
    
    // Parse CSV
    const results = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    });
    
    const errors: Array<{ row: number; message: string }> = [];
    const validRows: any[] = [];
    
    // Validate each row
    results.data.forEach((row: any, index: number) => {
      try {
        // Parse tags if present
        if (row.tags) {
          try {
            row.tags = JSON.parse(row.tags);
          } catch {
            row.tags = row.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
          }
        }
        
        // Parse budget values
        if (row.budgetMin) {
          row.budgetMin = parseInt(row.budgetMin);
        }
        if (row.budgetMax) {
          row.budgetMax = parseInt(row.budgetMax);
        }
        
        const validatedRow = csvImportSchema.parse(row);
        validRows.push(validatedRow);
      } catch (error: any) {
        errors.push({
          row: index + 1,
          message: error.message || 'Validation error',
        });
      }
    });
    
    if (errors.length > 0) {
      return NextResponse.json({
        error: 'Validation errors found',
        errors,
        validRows: validRows.length,
      }, { status: 400 });
    }
    
    // Insert valid rows in transaction
    const createdBuyers = [];
    for (const row of validRows) {
      try {
        const buyer = await createBuyer({
          ...row,
          ownerId: user.id,
          status: row.status || 'New',
          tags: row.tags ? JSON.stringify(row.tags) : null,
        }, user.id);
        createdBuyers.push(buyer);
      } catch (error) {
        console.error('Error creating buyer:', error);
        errors.push({
          row: validRows.indexOf(row) + 1,
          message: 'Failed to create buyer',
        });
      }
    }
    
    return NextResponse.json({
      message: `Successfully imported ${createdBuyers.length} buyers`,
      created: createdBuyers.length,
      errors: errors.length > 0 ? errors : undefined,
    });
    
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Failed to import buyers' },
      { status: 500 }
    );
  }
}
