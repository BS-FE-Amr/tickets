import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router';

const useLogin = () => {
  const navigate = useNavigate();

  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitLoading(true);

    const { email, password } = formData;

    let hasError = false;
    const newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = 'Email is required';
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      hasError = true;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      hasError = true;
    } else if (password.length < 6) {
      newErrors.password = 'Password at least 6 characters';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      setFormSubmitLoading(false);
      return;
    }

    setFormSubmitLoading(false);

    setFormData({
      email: '',
      password: '',
    });
    localStorage.setItem('token', 'loggedIn');
    navigate('/dashboard');
    // alert('HELLO');
  };

  return { formSubmitLoading, errors, handleChange, handleSubmit, formData };
};

export default useLogin;

