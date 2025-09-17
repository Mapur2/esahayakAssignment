'use client';

import { useState } from 'react';
import { Buyer } from '@/lib/schema';

interface BuyerFormProps {
  action: (formData: FormData) => void;
  buyer?: Buyer;
  isEdit?: boolean;
}

export default function BuyerForm({ action, buyer, isEdit = false }: BuyerFormProps) {
  const [propertyType, setPropertyType] = useState(buyer?.propertyType || '');
  const [budgetMin, setBudgetMin] = useState(buyer?.budgetMin?.toString() || '');
  const [budgetMax, setBudgetMax] = useState(buyer?.budgetMax?.toString() || '');
  const [tags, setTags] = useState(
    buyer?.tags ? JSON.parse(buyer.tags).join(', ') : ''
  );

  const showBhk = propertyType === 'Apartment' || propertyType === 'Villa';

  return (
    <form action={action} className="space-y-6">
      {isEdit && buyer && (
        <input type="hidden" name="id" value={buyer.id} />
        <input type="hidden" name="updatedAt" value={buyer.updatedAt.getTime()} />
      )}

      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          {/* Full Name */}
          <div className="sm:col-span-3">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="fullName"
                id="fullName"
                required
                defaultValue={buyer?.fullName || ''}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter full name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="sm:col-span-3">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1">
              <input
                type="email"
                name="email"
                id="email"
                defaultValue={buyer?.email || ''}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter email address"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="sm:col-span-3">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone *
            </label>
            <div className="mt-1">
              <input
                type="tel"
                name="phone"
                id="phone"
                required
                defaultValue={buyer?.phone || ''}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* City */}
          <div className="sm:col-span-3">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City *
            </label>
            <div className="mt-1">
              <select
                name="city"
                id="city"
                required
                defaultValue={buyer?.city || ''}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Select city</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Mohali">Mohali</option>
                <option value="Zirakpur">Zirakpur</option>
                <option value="Panchkula">Panchkula</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Property Type */}
          <div className="sm:col-span-3">
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
              Property Type *
            </label>
            <div className="mt-1">
              <select
                name="propertyType"
                id="propertyType"
                required
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Select property type</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Plot">Plot</option>
                <option value="Office">Office</option>
                <option value="Retail">Retail</option>
              </select>
            </div>
          </div>

          {/* BHK */}
          {showBhk && (
            <div className="sm:col-span-3">
              <label htmlFor="bhk" className="block text-sm font-medium text-gray-700">
                BHK *
              </label>
              <div className="mt-1">
                <select
                  name="bhk"
                  id="bhk"
                  required
                  defaultValue={buyer?.bhk || ''}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">Select BHK</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4 BHK</option>
                  <option value="Studio">Studio</option>
                </select>
              </div>
            </div>
          )}

          {/* Purpose */}
          <div className="sm:col-span-3">
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
              Purpose *
            </label>
            <div className="mt-1">
              <select
                name="purpose"
                id="purpose"
                required
                defaultValue={buyer?.purpose || ''}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Select purpose</option>
                <option value="Buy">Buy</option>
                <option value="Rent">Rent</option>
              </select>
            </div>
          </div>

          {/* Budget Min */}
          <div className="sm:col-span-3">
            <label htmlFor="budgetMin" className="block text-sm font-medium text-gray-700">
              Budget Min (INR)
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="budgetMin"
                id="budgetMin"
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter minimum budget"
              />
            </div>
          </div>

          {/* Budget Max */}
          <div className="sm:col-span-3">
            <label htmlFor="budgetMax" className="block text-sm font-medium text-gray-700">
              Budget Max (INR)
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="budgetMax"
                id="budgetMax"
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter maximum budget"
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="sm:col-span-3">
            <label htmlFor="timeline" className="block text-sm font-medium text-gray-700">
              Timeline *
            </label>
            <div className="mt-1">
              <select
                name="timeline"
                id="timeline"
                required
                defaultValue={buyer?.timeline || ''}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Select timeline</option>
                <option value="0-3m">0-3 months</option>
                <option value="3-6m">3-6 months</option>
                <option value=">6m">>6 months</option>
                <option value="Exploring">Exploring</option>
              </select>
            </div>
          </div>

          {/* Source */}
          <div className="sm:col-span-3">
            <label htmlFor="source" className="block text-sm font-medium text-gray-700">
              Source *
            </label>
            <div className="mt-1">
              <select
                name="source"
                id="source"
                required
                defaultValue={buyer?.source || ''}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Select source</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Call">Call</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="sm:col-span-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <div className="mt-1">
              <textarea
                name="notes"
                id="notes"
                rows={3}
                defaultValue={buyer?.notes || ''}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter any additional notes"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="sm:col-span-6">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="tags"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter tags separated by commas"
              />
              <p className="mt-2 text-sm text-gray-500">
                Separate multiple tags with commas
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <a
          href="/buyers"
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </a>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isEdit ? 'Update Lead' : 'Create Lead'}
        </button>
      </div>
    </form>
  );
}
