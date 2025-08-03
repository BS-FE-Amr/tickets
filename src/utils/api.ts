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
      config.url?.includes('/auth/local') ||
      config.url?.includes('/users/me')
    ) {
      return config;
    }

    const token =
      'b8f85935a7540735a2035e6a2ea24036666a868304890a74161cbe5e3ae044b6c873bc480ceef516e2c9a222e1080c4d0aca61ca38cce01bf63531eaa0c21f4a92d405359d7746b7cdb4e29ad484806606a5b61069b44ba666aa2340a6285b52938dd435d88ab5cc4e7473f59c3e095f9d28735ea8cc2d57739ed2374bcabed8';
    // localStorage.getItem('access_token') ||
    // sessionStorage.getItem('access_token');
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

