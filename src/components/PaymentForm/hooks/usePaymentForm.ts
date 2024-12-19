import { useState } from 'react';

export function usePaymentForm() {
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  return {
    customerName,
    setCustomerName,
    email,
    setEmail,
    phone,
    setPhone,
  };
}