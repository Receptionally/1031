import React, { useState, useRef } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { compressImage } from '../../utils/image';

interface SellerOnboardingFormProps {
  onComplete: (profileImage: string, bio: string) => Promise<void>;
}

export function SellerOnboardingForm({ onComplete }: SellerOnboardingFormProps) {
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null);
      setUploading(true);

      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image must be less than 5MB');
      }

      // Compress image
      const compressedFile = await compressImage(file);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('sellers')
        .upload(filePath, compressedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('sellers')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!imageUrl) {
        throw new Error('Please upload a profile image');
      }

      if (bio.length < 10) {
        throw new Error('Bio must be at least 10 characters');
      }

      if (bio.length > 100) {
        throw new Error('Bio must be less than 100 characters');
      }

      await onComplete(imageUrl, bio);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'Failed to complete onboarding');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Profile Picture
        </label>
        <div className="flex justify-center">
          <div className="space-y-2 flex flex-col items-center">
            <div className="relative h-40 w-40">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Profile"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="h-full w-full rounded-full bg-gray-100 flex items-center justify-center">
                  <Camera className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50"
              >
                <Upload className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            {uploading && (
              <p className="text-sm text-gray-500">Uploading...</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          Short Bio
        </label>
        <p className="mt-1 text-sm text-gray-500">
          Tell customers about your experience and commitment to quality firewood.
        </p>
        <div className="mt-2">
          <textarea
            id="bio"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            maxLength={100}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          {bio.length}/100 characters (minimum 10)
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
        >
          {loading ? 'Completing...' : 'Complete Profile'}
        </button>
        
        <div className="text-center">
          <Link
            to="/seller-dashboard"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Complete Later
          </Link>
        </div>
      </div>
    </form>
  );
}