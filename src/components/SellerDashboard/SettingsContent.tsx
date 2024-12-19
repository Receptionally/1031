import React from 'react';
import { StripeConnect } from './StripeConnect';
import { SettingsSection } from './SettingsSection';
import type { Seller } from '../../types/seller';

interface SettingsContentProps {
  seller: Seller;
}

export function SettingsContent({ seller }: SettingsContentProps) {
  return (
    <div className="space-y-8">
      <StripeConnect />
      <SettingsSection seller={seller} />
    </div>
  );
}