import React from 'react';
import { CheckCircle, Clock, Edit } from 'lucide-react';
import type { CityPage } from './types';

interface CityListProps {
  pages: CityPage[];
  onApprove: (pageId: string) => void;
  onEdit: (page: CityPage) => void;
  loading?: boolean;
}

export function CityList({ pages, onApprove, onEdit, loading }: CityListProps) {
  return (
    <div className="mt-6">
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                City
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                State
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                URL
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {pages.map((page) => (
              <tr key={page.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  {page.city}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {page.state}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  /firewood/{page.slug}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    {page.status === 'approved' ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" />
                        <span>Approved</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 text-yellow-500 mr-1.5" />
                        <span>Pending</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => onEdit(page)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    {page.status === 'pending' && (
                      <button
                        onClick={() => onApprove(page.id)}
                        disabled={loading}
                        className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}