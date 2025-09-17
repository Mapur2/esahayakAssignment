import { getBuyer, getBuyerHistory, canEditBuyer } from '@/lib/queries';
import { requireAuth } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import BuyerDetail from './components/BuyerDetail';

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <BuyerDetail 
            buyer={buyer} 
            canEdit={canEdit} 
            history={history}
            currentUserId={user.id}
          />
        </div>
      </div>
    </div>
  );
}
