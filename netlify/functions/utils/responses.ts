import { corsHeaders } from './cors';

export function success(data: any) {
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(data),
  };
}

export function error(statusCode: number, message: string) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify({ error: message }),
  };
}

export function methodNotAllowed() {
  return error(405, 'Method not allowed');
}

export function badRequest(message: string) {
  return error(400, message);
}