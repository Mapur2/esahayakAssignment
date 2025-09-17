import { getBuyer, getBuyerHistory, canEditBuyer } from '@/lib/queries';
import { requireAuth } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import BuyerDetail from './components/BuyerDetail';
import { updateBuyer } from '@/lib/queries';
import { updateBuyerSchema } from '@/lib/validations';

interface BuyerPageProps {
  params: {
    id: string;
  };
}

export default async function BuyerPage({ params }: BuyerPageProps) {
  const user = await requireAuth();
  const buyer = await getBuyer(params.id);
  
  if (!buyer) {
    notFound();
  }
  
  const canEdit = await canEditBuyer(params.id, user.id);
  const history = await getBuyerHistory(params.id, 5);

  async function onUpdate(formData: FormData) {
    'use server';
    const rawData = {
      id: formData.get('id') as string,
      updatedAt: parseInt(formData.get('updatedAt') as string),
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

    const validatedData = updateBuyerSchema.parse(rawData);
    await updateBuyer(
      validatedData.id,
      {
        ...validatedData,
        tags: validatedData.tags ? JSON.stringify(validatedData.tags) : null,
      },
      user.id,
      validatedData.updatedAt
    );

    redirect('/buyers');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <BuyerDetail 
            buyer={buyer} 
            canEdit={canEdit} 
            history={history}
            currentUserId={user.id}
            onUpdate={onUpdate}
          />
        </div>
      </div>
    </div>
  );
}
