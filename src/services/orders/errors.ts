export class OrderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OrderError';
  }
}

export const ORDER_ERRORS = {
  VALIDATION: 'Invalid order data',
  DATABASE: 'Database error occurred',
  STORAGE: 'Failed to store order data',
  NOT_FOUND: 'Order data not found',
  CREATE: 'Failed to create order',
} as const;