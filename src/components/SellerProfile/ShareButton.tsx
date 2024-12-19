import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface ShareButtonProps {
  sellerId: string;
}

export function ShareButton({ sellerId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/seller/${sellerId}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this firewood seller',
          url: url
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-1.5" />
          Copied!
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4 mr-1.5" />
          Share
        </>
      )}
    </button>
  );
}