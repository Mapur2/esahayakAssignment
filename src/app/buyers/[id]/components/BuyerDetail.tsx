'use client';

import { useState } from 'react';
import { Buyer, BuyerHistory } from '@/lib/schema';
import BuyerForm from '../../components/BuyerForm';
import { deleteBuyer } from '@/lib/queries';
import { useRouter } from 'next/navigation';
import { Trash2, Edit, ArrowLeft } from 'lucide-react';

interface BuyerDetailProps {
  buyer: Buyer;
  canEdit: boolean;
  history: BuyerHistory[];
  currentUserId: string;
  onUpdate: (formData: FormData) => Promise<void>;
}

export default function BuyerDetail({ buyer, canEdit, history, currentUserId, onUpdate }: BuyerDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this buyer lead? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteBuyer(buyer.id, currentUserId);
      router.push('/buyers');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete buyer. Please try again.');
    }
  };

  const formatBudget = () => {
    if (buyer.budgetMin && buyer.budgetMax) {
      return `₹${buyer.budgetMin.toLocaleString()} - ₹${buyer.budgetMax.toLocaleString()}`;
    } else if (buyer.budgetMin) {
      return `₹${buyer.budgetMin.toLocaleString()}+`;
    } else if (buyer.budgetMax) {
      return `Up to ₹${buyer.budgetMax.toLocaleString()}`;
    }
    return 'Not specified';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Qualified': return 'bg-green-100 text-green-800';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800';
      case 'Visited': return 'bg-purple-100 text-purple-800';
      case 'Negotiation': return 'bg-orange-100 text-orange-800';
      case 'Converted': return 'bg-green-100 text-green-800';
      case 'Dropped': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isEditing) {
    return (
      <div>
        <div className="mb-6">
          <button
            onClick={() => setIsEditing(false)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to view
          </button>
        </div>
        <BuyerForm action={onUpdate} buyer={buyer} isEdit={true} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <button
            onClick={() => router.push('/buyers')}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to buyers
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{buyer.fullName}</h1>
          <p className="text-sm text-gray-600">Created {new Date(buyer.updatedAt).toLocaleDateString()}</p>
        </div>
        
        {canEdit && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-3 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Buyer Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{buyer.fullName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">{buyer.phone}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{buyer.email || 'Not provided'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">City</dt>
                <dd className="mt-1 text-sm text-gray-900">{buyer.city}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Property Requirements</h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Property Type</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {buyer.propertyType}
                  {buyer.bhk && ` (${buyer.bhk} BHK)`}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Purpose</dt>
                <dd className="mt-1 text-sm text-gray-900">{buyer.purpose}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Budget</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatBudget()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Timeline</dt>
                <dd className="mt-1 text-sm text-gray-900">{buyer.timeline}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Lead Information</h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Source</dt>
                <dd className="mt-1 text-sm text-gray-900">{buyer.source}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(buyer.status)}`}>
                    {buyer.status}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          {buyer.notes && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Notes</h2>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{buyer.notes}</p>
            </div>
          )}

          {buyer.tags && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {JSON.parse(buyer.tags).map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* History Sidebar */}
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Changes</h2>
            <div className="space-y-4">
              {history.length === 0 ? (
                <p className="text-sm text-gray-500">No changes recorded</p>
              ) : (
                history.map((entry) => {
                  const diff = JSON.parse(entry.diff);
                  return (
                    <div key={entry.id} className="border-l-4 border-gray-200 pl-4">
                      <div className="text-sm text-gray-900">
                        {entry.changedBy}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(entry.changedAt).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {diff.action === 'created' ? 'Created lead' : 
                         Object.entries(diff).map(([field, change]: [string, any]) => (
                           <div key={field}>
                             {field}: {change.old} → {change.new}
                           </div>
                         ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
