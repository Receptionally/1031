import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SellerFormState } from '../types/seller';
import { supabase } from '../config/supabase';
import { logger } from '../services/utils/logger';

const initialState: SellerFormState = {
  name: '',
  businessName: '',
  businessAddress: '',
  email: '',
  phone: '',
  password: '',
  firewoodUnit: '',
  pricePerUnit: '',
  maxDeliveryDistance: '',
  minDeliveryFee: '',
  pricePerMile: '',
  paymentTiming: 'delivery',
  providesStacking: false,
  stackingFeePerUnit: '0',
  providesKilnDried: false,
  kilnDriedFeePerUnit: '0',
  maxStackingDistance: '20',
  bio: '',
};

export function useSellerSignup() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<SellerFormState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAddressChange = (address: string) => {
    setFormState(prev => ({
      ...prev,
      businessAddress: address,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Basic validation
      if (!formState.email || !formState.password) {
        throw new Error('Please fill in all fields');
      }

      if (formState.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Sign up with minimal data
      const { data, error: signupError } = await supabase.auth.signUp({
        email: formState.email,
        password: formState.password,
        options: {
          data: {
            role: 'seller',
            name: formState.name,
            businessName: formState.businessName,
            businessAddress: formState.businessAddress,
            phone: formState.phone,
            firewoodUnit: formState.firewoodUnit,
            pricePerUnit: formState.pricePerUnit,
            maxDeliveryDistance: formState.maxDeliveryDistance,
            minDeliveryFee: formState.minDeliveryFee,
            pricePerMile: formState.pricePerMile,
            paymentTiming: formState.paymentTiming,
            providesStacking: formState.providesStacking,
            stackingFeePerUnit: formState.stackingFeePerUnit,
            providesKilnDried: formState.providesKilnDried,
            kilnDriedFeePerUnit: formState.kilnDriedFeePerUnit,
            maxStackingDistance: formState.maxStackingDistance,
          },
        },
      });

      if (signupError) throw signupError;
      if (!data.user) throw new Error('Failed to create account');

      logger.info('Successfully created seller account');
      navigate('/seller-onboarding');
    } catch (err) {
      logger.error('Signup error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return {
    formState,
    handleChange,
    handleAddressChange,
    handleSubmit,
    error,
    loading,
  };
}