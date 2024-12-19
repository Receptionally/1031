import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

export function CollapsibleLegalNotice() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-3 flex items-center justify-between text-left"
      >
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0" />
          <h3 className="ml-3 text-lg font-medium text-amber-800">
            Legal Notice
          </h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-amber-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-amber-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6">
          <div className="mt-2 text-sm text-amber-700">
            <p className="mb-2">
              While we strive to provide accurate information about state-level firewood transport regulations, please note:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Additional regulations may exist at the county, city, or local level</li>
              <li>Laws and regulations can change without notice</li>
              <li>Some areas may have seasonal or temporary restrictions</li>
              <li>Special permits or certifications might be required in certain jurisdictions</li>
            </ul>
            <p className="mt-3 font-medium">
              It is your responsibility as a seller to:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>Research and comply with all applicable local laws and regulations</li>
              <li>Obtain necessary permits and certifications</li>
              <li>Stay informed about changes in regulations</li>
              <li>Contact local authorities when in doubt</li>
            </ul>
            <p className="mt-3 text-amber-800 font-medium">
              The information provided here is for guidance only and does not constitute legal advice. You are solely responsible for ensuring compliance with all applicable laws and regulations.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}