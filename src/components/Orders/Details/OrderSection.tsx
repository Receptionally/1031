import React from 'react';

interface OrderSectionProps {
  title: string;
  fields: Array<{
    label: string;
    value: string | number;
  }>;
}

export function OrderSection({ title, fields }: OrderSectionProps) {
  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900">{title}</h4>
      <dl className="space-y-2">
        {fields.map((field, i) => (
          <div key={i}>
            <dt className="text-xs font-medium text-gray-500">{field.label}</dt>
            <dd className="mt-1 text-sm text-gray-900 break-all">{field.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}