export class StripeConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StripeConnectionError';
  }
}

export class StripeValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StripeValidationError';
  }
}

export class StripeAuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StripeAuthorizationError';
  }
}