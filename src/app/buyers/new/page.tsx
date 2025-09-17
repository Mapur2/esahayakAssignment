import { requireAuth } from '@/lib/auth';
import { createBuyer } from '@/lib/queries';
import { createBuyerSchema } from '@/lib/validations';
import { redirect } from 'next/navigation';
import BuyerForm from '../components/BuyerForm';

export default async function NewBuyerPage() {
  const user = await requireAuth();

  async function handleSubmit(formData: FormData) {
    'use server';
    
    const rawData = {
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      city: formData.get('city') as string,
      propertyType: formData.get('propertyType') as string,
      bhk: formData.get('bhk') as string,
      purpose: formData.get('purpose') as string,
      budgetMin: formData.get('budgetMin') ? parseInt(formData.get('budgetMin') as string) : undefined,
      budgetMax: formData.get('budgetMax') ? parseInt(formData.get('budgetMax') as string) : undefined,
      timeline: formData.get('timeline') as string,
      source: formData.get('source') as string,
      notes: formData.get('notes') as string,
      tags: formData.get('tags') ? (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean) : undefined,
    };

    try {
      const validatedData = createBuyerSchema.parse(rawData);
      
      await createBuyer({
        ...validatedData,
        ownerId: user.id,
        status: 'New',
        tags: validatedData.tags ? JSON.stringify(validatedData.tags) : null,
      }, user.id);
      
      redirect('/buyers');
    } catch (error) {
      console.error('Validation error:', error);
      // In a real app, you'd handle this with proper error handling
      throw new Error('Invalid form data');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Add New Buyer Lead</h1>
            <p className="mt-2 text-sm text-gray-600">
              Fill in the details below to create a new buyer lead.
            </p>
          </div>
          
          <BuyerForm action={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
