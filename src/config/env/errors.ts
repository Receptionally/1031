export class EnvironmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvironmentError';
  }
}

export function createEnvError(message: string): EnvironmentError {
  return new EnvironmentError(message);
}