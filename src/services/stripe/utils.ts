export function generateRandomState(): string {
  const array = new Uint32Array(2);
  crypto.getRandomValues(array);
  return Array.from(array, dec => dec.toString(16)).join('');
}

export function handleStripeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  if (typeof error === 'string') {
    return new Error(error);
  }
  return new Error('An unknown error occurred with Stripe');
}