import { getBuyers } from '@/lib/queries';
import { requireAuth } from '@/lib/auth';
import BuyersList from './components/BuyersList';
import { Suspense } from 'react';

interface SearchParams {
  page?: string;
  city?: string;
  propertyType?: string;
  status?: string;
  timeline?: string;
  search?: string;
  sort?: string;
}

export default async function BuyersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const user = await requireAuth();
  const params = await searchParams;
  
  const page = parseInt(params.page || '1');
  const filters = {
    city: params.city,
    propertyType: params.propertyType,
    status: params.status,
    timeline: params.timeline,
    search: params.search,
  };
  
  const sort = params.sort 
    ? { field: params.sort.split('-')[0] as 'updatedAt' | 'fullName', direction: params.sort.split('-')[1] as 'asc' | 'desc' }
    : { field: 'updatedAt' as const, direction: 'desc' as const };

  const { buyers, total } = await getBuyers(page, 10, filters, sort);
  const totalPages = Math.ceil(total / 10);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Buyer Leads</h1>
            <a
              href="/buyers/new"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Add New Lead
            </a>
          </div>
          
          <Suspense fallback={<div>Loading...</div>}>
            <BuyersList 
              buyers={buyers}
              totalPages={totalPages}
              currentPage={page}
              filters={filters}
              sort={sort}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
