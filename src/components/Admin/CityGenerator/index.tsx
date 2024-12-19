import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { CityPageForm } from './CityPageForm';
import { CityList } from './CityList';
import { EditContentModal } from './EditContentModal';
import { useCityPages } from './hooks/useCityPages';
import { supabase } from '../../../config/supabase';
import type { CityPage } from './types';

export function CityGenerator() {
  const [pages, setPages] = useState<CityPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<CityPage | null>(null);
  const { loading, error, generatePage, approvePage, updateContent } = useCityPages();
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    const { data } = await supabase
      .from('city_pages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setPages(data);
  };

  const handleGenerate = async (city: string, state: string) => {
    try {
      setSuccess(null);
      await generatePage(city, state);
      await fetchPages();
      setSuccess(`Successfully generated page for ${city}, ${state}`);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleApprove = async (pageId: string) => {
    try {
      await approvePage(pageId);
      await fetchPages();
      setSuccess('Page approved successfully');
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleEdit = (page: CityPage) => {
    setSelectedPage(page);
  };

  const handleSaveContent = async (pageId: string, content: string) => {
    try {
      await updateContent(pageId, content);
      await fetchPages();
      setSuccess('Content updated successfully');
      setSelectedPage(null);
    } catch (err) {
      // Error is handled by the hook
      throw err;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">City Page Generator</h2>
          <p className="mt-1 text-sm text-gray-500">
            Generate new city pages based on the template. Pages must be approved before they go live.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        <CityPageForm onGenerate={handleGenerate} loading={loading} />
        
        {pages.length > 0 && (
          <CityList 
            pages={pages} 
            onApprove={handleApprove}
            onEdit={handleEdit}
            loading={loading}
          />
        )}

        {selectedPage && (
          <EditContentModal
            page={selectedPage}
            onClose={() => setSelectedPage(null)}
            onSave={handleSaveContent}
          />
        )}
      </div>
    </div>
  );
}