import { useState, type Dispatch, type SetStateAction } from 'react';
import { useCustomFetch } from '../../../hooks/use-custom-fetch';
import { useNavigate } from 'react-router';
import type {
  AuthResponse,
  FormDataError,
  FormDataInterface,
} from '../types/login';

const useLoginRequest = (
  setFormData: Dispatch<SetStateAction<FormDataInterface>>,
  setErrors: Dispatch<SetStateAction<FormDataError>>,
) => {
  const customFetch = useCustomFetch();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function getUser(username: string, password: string) {
    setIsLoading(true);
    try {
      const user = await customFetch<AuthResponse, FormDataInterface>(
        'https://dummyjson.com/auth/login',
        {
          method: 'POST',
          body: { username: username, password: password },
        },
      );
      console.log(user);
      setFormData({
        username: '',
        password: '',
      });
      document.cookie = `token=${user.accessToken}; path=/; max-age=3600`; // 1 hour
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        setErrors({
          username: '',
          password: '',
          global: error.message,
        });
      } else {
        setErrors({
          username: '',
          password: '',
          global: 'An unexpected error occurred',
        });
      }
      console.error('Failed to fetch user:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, getUser };
};

export default useLoginRequest;

