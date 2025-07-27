import { useState, type ChangeEvent, type FormEvent } from 'react';
import useLoginRequest from './use-login-request';
import type { FormDataError, FormDataInterface } from '../types/login';

const useLogin = () => {
  // const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [formData, setFormData] = useState<FormDataInterface>({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormDataError>({
    global: '',
    username: '',
    password: '',
  });

  const { getUser, isLoading } = useLoginRequest(setFormData, setErrors);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    setErrors((prev) => ({
      ...prev,
      global: '',
      [name]: '',
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // setFormSubmitLoading(true);
    console.log('A?');

    const { username, password } = formData;

    let hasError = false;
    const newErrors = { username: '', password: '', global: '' };

    if (!username) {
      newErrors.username = 'Username is required';
      hasError = true;
    }
    // else if (!/\S+@\S+\.\S+/.test(username)) {
    //   newErrors.username = 'Username is invalid';
    //   hasError = true;
    // }

    if (!password) {
      newErrors.password = 'Password is required';
      hasError = true;
    } else if (password.length < 6) {
      newErrors.password = 'Password at least 6 characters';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      // setFormSubmitLoading(false);
      console.log(newErrors);
      console.log('AS?');
      return;
    }

    // setFormSubmitLoading(false);

    localStorage.setItem('token', 'loggedIn');
    console.log('B?');
    await getUser(formData.username, formData.password);
    // alert('HELLO');
  };

  return { isLoading, errors, handleChange, handleSubmit, formData };
};

export default useLogin;

