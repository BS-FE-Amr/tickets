import useLoginData from './use-login-data';
import useLogout from './use-logout';

export function useCustomFetch() {
  const { token } = useLoginData();
  const { handleLogout } = useLogout();

  return async function customFetch<T, TBody = undefined>(
    url: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
      body?: TBody;
      headers?: HeadersInit;
      signal?: AbortSignal;
    } = {},
  ): Promise<T> {
    const { method = 'GET', body, headers, signal } = options;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (
          response.status === 401 ||
          data.message?.toLowerCase() === 'invalid token'
        ) {
          handleLogout();
        }

        throw new Error(data.message || `Error ${response.status}`);
      }

      return data as T;
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        return Promise.reject(err);
      } else {
        console.error('An unexpected error occurred');
        return Promise.reject(new Error('Unknown error'));
      }
    }
  };
}

