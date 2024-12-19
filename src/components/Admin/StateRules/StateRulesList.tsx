import React, { useState } from 'react';
import { useStateRules } from '../../../hooks/useStateRules';
import { AlertTriangle, Check, X, Ruler } from 'lucide-react';

export function StateRulesList() {
  const { rules, loading, error, updateRule, updatingStates } = useStateRules();
  const [expandedState, setExpandedState] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const handleNumberInput = (stateCode: string, field: string, value: string) => {
    // Store the input value
    setInputValues(prev => ({
      ...prev,
      [`${stateCode}_${field}`]: value
    }));

    // Only update if the value is valid
    if (value === '') {
      handleRuleUpdate(stateCode, { [field]: null });
    } else {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue >= 0) {
        handleRuleUpdate(stateCode, { [field]: numValue });
      }
    }
  };

  const handleRuleUpdate = async (stateCode: string, updates: Partial<any>) => {
    try {
      setUpdateError(null);
      await updateRule(stateCode, updates);
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : 'Failed to update rule');
      console.error('Error updating rule:', err);
    }
  };

  const getInputValue = (stateCode: string, field: string, currentValue: number | null) => {
    const inputKey = `${stateCode}_${field}`;
    return inputKey in inputValues ? inputValues[inputKey] : (currentValue?.toString() ?? '');
  };

  return (
    <div className="space-y-4">
      {updateError && (
        <div className="bg-red-50 p-4 rounded-md mb-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{updateError}</p>
            </div>
          </div>
        </div>
      )}

      {rules.map((rule) => {
        const isExpanded = expandedState === rule.state_code;

        return (
          <div key={rule.state_code} className="bg-white shadow rounded-lg overflow-hidden">
            <div 
              className="px-6 py-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedState(isExpanded ? null : rule.state_code)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {rule.state_name} ({rule.state_code})
                </h3>
                <div className="flex items-center space-x-6">
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Allow Import</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          if (updatingStates[rule.state_code]) return;
                          e.stopPropagation();
                          handleRuleUpdate(rule.state_code, { allows_import: !rule.allows_import });
                        }}
                        className={`
                          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
                          ${rule.allows_import ? 'bg-orange-600' : 'bg-gray-200'} 
                          ${updatingStates[rule.state_code] ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        <span className="sr-only">Allow Import</span>
                        <span
                          className={`
                            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                            ${rule.allows_import ? 'translate-x-5' : 'translate-x-0'}
                          `}
                        />
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Allow Export</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          if (updatingStates[rule.state_code]) return;
                          e.stopPropagation();
                          handleRuleUpdate(rule.state_code, { allows_export: !rule.allows_export });
                        }}
                        disabled={updatingStates[rule.state_code]}
                        className={`
                          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
                          ${rule.allows_export ? 'bg-orange-600' : 'bg-gray-200'}
                          ${updatingStates[rule.state_code] ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        <span className="sr-only">Allow Export</span>
                        <span
                          className={`
                            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                            ${rule.allows_export ? 'translate-x-5' : 'translate-x-0'}
                          `}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Allow Import
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRuleUpdate(rule.state_code, { allows_import: !rule.allows_import })}
                        className={`
                          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                          ${rule.allows_import ? 'bg-blue-600' : 'bg-gray-200'}
                        `}
                      >
                        <span className="sr-only">Allow Import</span>
                        <span
                          className={`
                            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                            ${rule.allows_import ? 'translate-x-5' : 'translate-x-0'}
                          `}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Allow Export
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRuleUpdate(rule.state_code, { allows_export: !rule.allows_export })}
                        className={`
                          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                          ${rule.allows_export ? 'bg-blue-600' : 'bg-gray-200'}
                        `}
                      >
                        <span className="sr-only">Allow Export</span>
                        <span
                          className={`
                            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                            ${rule.allows_export ? 'translate-x-5' : 'translate-x-0'}
                          `}
                        />
                      </button>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Maximum Transport Distance (miles)
                      </label>
                      <div className="mt-1 flex items-center space-x-2">
                        <input
                          type="number"
                          value={getInputValue(rule.state_code, 'max_transport_miles', rule.max_transport_miles)}
                          onChange={(e) => handleNumberInput(rule.state_code, 'max_transport_miles', e.target.value)}
                          min="0"
                          placeholder="No limit"
                          className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        <Ruler className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-500">As the crow flies</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Requires Certification Beyond Miles
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRuleUpdate(rule.state_code, { 
                          requires_certification_beyond_miles: !rule.requires_certification_beyond_miles 
                        })}
                        className={`
                          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                          ${rule.requires_certification_beyond_miles ? 'bg-blue-600' : 'bg-gray-200'}
                        `}
                      >
                        <span className="sr-only">Requires Certification Beyond Miles</span>
                        <span
                          className={`
                            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                            ${rule.requires_certification_beyond_miles ? 'translate-x-5' : 'translate-x-0'}
                          `}
                        />
                      </button>
                    </div>

                    {rule.requires_certification_beyond_miles && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Certification Required Beyond Miles
                        </label>
                        <input
                          type="number"
                          value={getInputValue(rule.state_code, 'certification_miles_threshold', rule.certification_miles_threshold)}
                          onChange={(e) => handleNumberInput(rule.state_code, 'certification_miles_threshold', e.target.value)}
                          min="0"
                          className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Certification Details
                      </label>
                      <textarea
                        value={rule.certification_details || ''}
                        onChange={(e) => handleRuleUpdate(rule.state_code, { certification_details: e.target.value })}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Requirements
                      </label>
                      <textarea
                        value={rule.additional_requirements || ''}
                        onChange={(e) => handleRuleUpdate(rule.state_code, { additional_requirements: e.target.value })}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}