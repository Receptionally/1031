import React, { useRef, useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { compressImage, validateImage } from '../../utils/image';

interface ProfileSectionProps {
  profileImage: string;
  bio: string;
  onImageUpload: (url: string) => void;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  defaultBio: string;
}

export function ProfileSection({ profileImage, bio, onImageUpload, onChange, defaultBio }: ProfileSectionProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null);
      setUploading(true);

      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file
      const validation = validateImage(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Compress image
      const compressedFile = await compressImage(file);

      // Upload file directly in user's folder
      const filePath = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${file.name.split('.').pop()?.toLowerCase()}`;

      const { error: uploadError } = await supabase.storage
        .from('sellers')
        .upload(filePath, compressedFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('sellers')
        .getPublicUrl(filePath);

      onImageUpload(publicUrl);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Profile Picture (Optional)
        </label>
        <div className="flex justify-center">
          <div className="space-y-2 flex flex-col items-center">
            <div className="relative h-40 w-40">
              {profileImage ? (
                <img
                  src={profileImage}
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
              accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
              onChange={handleImageUpload}
              className="hidden"
            />
            {uploading && (
              <p className="text-sm text-gray-500">Uploading...</p>
            )}
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <p className="text-xs text-gray-500 text-center">
              Supported formats: JPEG, PNG, WebP, HEIC/HEIF (max 5MB)
            </p>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          Short Bio
          <span className="ml-1 text-gray-400">(Optional - Default provided below)</span>
        </label>
        <p className="mt-1 text-sm text-gray-500">
          Tell customers about your experience and commitment to quality firewood.
        </p>
        <div className="mt-2">
          <textarea
            id="bio"
            name="bio"
            rows={3}
            value={bio}
            onChange={onChange}
            placeholder={defaultBio}
            className="block w-full text-base rounded-md border-2 border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 hover:border-gray-400 transition-colors p-3"
            maxLength={100}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          {bio.length}/100 characters (minimum 10)
          {bio === defaultBio && (
            <span className="ml-2 text-orange-600">
              ← Feel free to customize this default bio
            </span>
          )}
        </p>
      </div>
    </div>
  );
}