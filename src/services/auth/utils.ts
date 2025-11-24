import { AxiosResponse } from 'axios';

export const handleAuthResponse = <T>(response: AxiosResponse<T>, context: string): T => {
  // Debug log for inspection
  console.log(`${context} Response:`, {
    status: response.status,
    headers: response.headers,
    data: response.data,
  });

  if (response.status === 204 || !response.data) {
    // Attempt to recover token from headers if body is empty
    const authHeader = response.headers['authorization'] || response.headers['Authorization'];
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      console.warn("Token found in headers but body was empty.");
      throw new Error('Login failed: Server returned 204 but provided a token in headers. Application requires user details in body.');
    }
    throw new Error(`Login failed: Server returned status ${response.status} with no content. Please check the browser console for details.`);
  }
  return response.data;
};
