import React from 'react';
import { AlertTriangle, Check, X, Ruler } from 'lucide-react';
import { useStateRules } from '../../hooks/useStateRules';
import { getStateFromAddress } from '../../utils/address';
import { logger } from '../../services/utils/logger';

interface StateRulesInfoProps {
  businessAddress: string;
}

export function StateRulesInfo({ businessAddress }: StateRulesInfoProps) {
  const { rules, loading, error } = useStateRules();
  const [sellerState, setSellerState] = React.useState<string | null>(null);
  const [stateRule, setStateRule] = React.useState<any | null>(null);

  React.useEffect(() => {
    async function getSellerState() {
      try {
        const state = await getStateFromAddress(businessAddress);
        setSellerState(state);
        
        if (state && rules) {
          const rule = rules.find(r => r.state_code === state);
          setStateRule(rule);
        }
      } catch (err) {
        logger.error('Error getting seller state:', err);
      }
    }

    if (businessAddress && rules) {
      getSellerState();
    }
  }, [businessAddress, rules]);

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="w-6 h-6 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <p className="text-sm text-red-700">Failed to load state rules</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stateRule) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        State Transport Rules for {stateRule.state_name}
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Import Allowed</span>
            {stateRule.allows_import ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <X className="h-5 w-5 text-red-500" />
            )}
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Export Allowed</span>
            {stateRule.allows_export ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <X className="h-5 w-5 text-red-500" />
            )}
          </div>
        </div>

        {stateRule.max_transport_miles && (
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <Ruler className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Maximum Transport Distance
              </p>
              <p className="text-sm text-gray-600">
                {stateRule.max_transport_miles} miles
                {stateRule.requires_certification_beyond_miles && 
                  ` (certification required beyond ${stateRule.certification_miles_threshold} miles)`
                }
              </p>
            </div>
          </div>
        )}

        {stateRule.certification_details && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-1">
              Certification Requirements
            </p>
            <p className="text-sm text-gray-600">
              {stateRule.certification_details}
            </p>
          </div>
        )}

        {stateRule.additional_requirements && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-1">
              Additional Requirements
            </p>
            <p className="text-sm text-gray-600">
              {stateRule.additional_requirements}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}