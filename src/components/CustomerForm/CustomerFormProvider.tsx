import React, { createContext, useContext, ReactNode } from 'react';
import type { SellerWithAccount } from '../../types/seller';

interface CustomerFormContextType {
  seller: SellerWithAccount;
  productId: string;
  quantity: number;
  amount: number;
  deliveryAddress: string;
}

const CustomerFormContext = createContext<CustomerFormContextType | null>(null);

interface CustomerFormProviderProps extends CustomerFormContextType {
  children: ReactNode;
}

export function CustomerFormProvider({ children, ...props }: CustomerFormProviderProps) {
  return (
    <CustomerFormContext.Provider value={props}>
      {children}
    </CustomerFormContext.Provider>
  );
}

export function useCustomerForm() {
  const context = useContext(CustomerFormContext);
  if (!context) {
    throw new Error('useCustomerForm must be used within CustomerFormProvider');
  }
  return context;
}