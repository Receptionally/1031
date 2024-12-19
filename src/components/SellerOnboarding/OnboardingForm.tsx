import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { OnboardingSteps } from './OnboardingSteps';
import { StepButtons } from './StepButtons';
import { ProfileStep } from './steps/ProfileStep';
import { BusinessStep } from './steps/BusinessStep';
import { DeliveryStep } from './steps/DeliveryStep';
import { PaymentStep } from './steps/PaymentStep';
import type { SellerFormState } from '../../types/seller';
import { logger } from '../../services/utils/logger';

const STEPS = ['Profile', 'Business', 'Delivery'];

const initialState: SellerFormState = {
  profileImage: '',
  bio: '',
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
};

export function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formState, setFormState] = useState<SellerFormState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  const handleImageUpload = (url: string) => {
    setFormState(prev => ({
      ...prev,
      profileImage: url,
    }));
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0: // Profile
        if (!formState.bio || formState.bio.length < 10) {
          setError('Bio must be at least 10 characters');
          return false;
        }
        break;
      case 1: // Business
        if (!formState.name || !formState.businessName || !formState.businessAddress || !formState.phone) {
          setError('Please fill in all business details');
          return false;
        }
        break;
      case 2: // Delivery
        if (!formState.firewoodUnit || !formState.pricePerUnit || !formState.maxDeliveryDistance || 
            !formState.minDeliveryFee || !formState.pricePerMile) {
          setError('Please fill in all delivery options');
          return false;
        }
        break;
      case 3: // Payment
        if (!formState.paymentTiming) {
          setError('Please select when payment is required');
          return false;
        }
        if (formState.providesStacking && !formState.stackingFeePerUnit) {
          setError('Please enter stacking fee per unit');
          return false;
        }
        break;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      logger.info('Updating seller profile:', {
        sellerId: user.id,
        formState: { ...formState, email: undefined, password: undefined }
      });

      const { error: updateError } = await supabase
        .from('sellers')
        .update({
          profile_image: formState.profileImage || null,
          bio: formState.bio,
          name: formState.name,
          business_name: formState.businessName,
          business_address: formState.businessAddress,
          phone: formState.phone,
          firewood_unit: formState.firewoodUnit,
          price_per_unit: parseFloat(formState.pricePerUnit),
          max_delivery_distance: parseInt(formState.maxDeliveryDistance),
          min_delivery_fee: parseFloat(formState.minDeliveryFee),
          price_per_mile: parseFloat(formState.pricePerMile),
          payment_timing: formState.paymentTiming,
          provides_stacking: formState.providesStacking,
          stacking_fee_per_unit: formState.providesStacking ? parseFloat(formState.stackingFeePerUnit) : 0,
        })
        .eq('id', user.id)
        .select();

      if (updateError) {
        logger.error('Error updating seller:', updateError);
        throw updateError;
      }

      logger.info('Successfully updated seller profile');
      navigate('/seller-dashboard');
    } catch (err) {
      logger.error('Error completing onboarding:', err);
      setError(err instanceof Error ? err.message : 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) return;

    if (currentStep === STEPS.length - 1) {
      await handleSubmit();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSkip = () => {
    navigate('/seller-dashboard');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProfileStep
            formState={formState}
            onImageUpload={handleImageUpload}
            onChange={handleChange}
          />
        );
      case 1:
        return (
          <BusinessStep
            formState={formState}
            onChange={handleChange}
            onAddressChange={handleAddressChange}
          />
        );
      case 2:
        return (
          <DeliveryStep
            formState={formState}
            onChange={handleChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 bg-white p-8 rounded-lg shadow">
      <OnboardingSteps currentStep={currentStep} steps={STEPS} />
      
      {renderStep()}

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={handleSkip}
          className="text-gray-500 hover:text-gray-700"
        >
          Complete Later
        </button>
        <StepButtons
          currentStep={currentStep}
          totalSteps={STEPS.length}
          onNext={handleNext}
          onPrevious={handlePrevious}
          loading={loading}
        />
      </div>
    </div>
  );
}