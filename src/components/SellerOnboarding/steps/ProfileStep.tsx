import React from 'react';
import { ProfileSection } from '../ProfileSection';
import type { SellerFormState } from '../../../types/seller';

const DEFAULT_BIO = 'I enjoy delivering firewood to my customers. It\'s very hard work but it is also rewarding too as I get to be outside.';

interface ProfileStepProps {
  formState: SellerFormState;
  onImageUpload: (url: string) => void;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function ProfileStep({ formState, onImageUpload, onChange }: ProfileStepProps) {  
  // Set default bio if empty
  React.useEffect(() => {
    if (!formState.bio) {
      onChange({
        target: {
          name: 'bio',
          value: DEFAULT_BIO
        }
      } as React.ChangeEvent<HTMLTextAreaElement>);
    }
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
      <p className="text-sm text-gray-500">
        Tell customers about yourself and your firewood business. We've provided a default bio that you can customize.
      </p>
      <ProfileSection
        profileImage={formState.profileImage}
        bio={formState.bio}
        onImageUpload={onImageUpload}
        onChange={onChange}
        defaultBio={DEFAULT_BIO}
      />
    </div>
  );
}