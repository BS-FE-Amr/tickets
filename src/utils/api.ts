import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:1337/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (
      config.url?.includes('/auth/local')
      // ||
      // config.url?.includes('/users/me')
    ) {
      return config;
    }

    const token =
      localStorage.getItem('access_token') ||
      sessionStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/local')
    ) {
      originalRequest._retry = true;

      const refreshToken =
        localStorage.getItem('refresh_token') ||
        sessionStorage.getItem('refresh_token');
      try {
        const { data } = await axios.post(
          'https://dummyjson.com/auth/refresh',
          {
            refreshToken,
          },
        );

        localStorage.setItem('access_token', data.accessToken);
        api.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${data.accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;

        return api(originalRequest); // Retry original request
      } catch (refreshError) {
        console.error('Refresh token failed', refreshError);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }

    const message =
      error.response?.data?.message || error.message || 'Something went wrong';

    return Promise.reject(new Error(message));
  },
);

export default api;

