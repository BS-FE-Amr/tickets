import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import api from '../utils/api';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

interface FormDataInterface {
  username: string;
  password: string;
  remember: boolean;
}

interface FormDataError {
  username: string;
  password: string;
  global: string;
}

const LoginPage = () => {
  const navigate = useNavigate();

  const loginUser = async () => {
    const { data } = await api.post('/auth/login', {
      username: formData.username,
      password: formData.password,
      expiresInMins: 1,
    });
    return data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => loginUser(),
    onSuccess: (data) => {
      if (formData.remember) {
        localStorage.setItem('access_token', data?.accessToken);
        localStorage.setItem('refresh_token', data?.refreshToken);
      } else {
        sessionStorage.setItem('access_token', data?.accessToken);
        sessionStorage.setItem('refresh_token', data?.refreshToken);
      }
      navigate('/dashboard');
    },
    onError: (error) => {
      console.log('error is', error);
      setErrors({
        username: '',
        password: '',
        global: error.message,
      });
    },
  });

  const [formData, setFormData] = useState<FormDataInterface>({
    username: '',
    password: '',
    remember: false,
  });

  const [errors, setErrors] = useState<FormDataError>({
    global: '',
    username: '',
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
      global: '',
      [name]: '',
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { username, password } = formData;

    let hasError = false;
    const newErrors = { username: '', password: '', global: '' };

    if (!username) {
      newErrors.username = 'Username is required';
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
      console.log(newErrors);
      return;
    }

    localStorage.setItem('token', 'loggedIn');
    console.log('B?');
    mutate();
  };

  const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }));
  };

  return (
    <div className="w-full h-screen grid place-items-center justify-center">
      <div className="container">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh">
          <Paper elevation={3} sx={{ padding: 4, width: 400 }}>
            <Typography variant="h5" align="center" gutterBottom>
              Login
            </Typography>

            <form onSubmit={handleSubmit}>
              <div className="py-[24px] flex flex-col gap-[24px] ">
                <TextField
                  id="outlined-basic"
                  label="User Name"
                  variant="outlined"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  error={!!errors.username}
                  helperText={errors.username}
                  disabled={isPending}
                />
                <TextField
                  id="outlined-basic"
                  label="Password"
                  variant="outlined"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  disabled={isPending}
                />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center">
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="remember"
                        checked={formData.remember}
                        onChange={handleCheckChange}
                      />
                    }
                    label="Remember Me"
                  />
                  <Link href="#" variant="body2">
                    Forgot Password?
                  </Link>
                </Box>

                {errors?.global && <p>{errors.global}</p>}
                <Button type="submit" variant="contained" disabled={isPending}>
                  Login
                </Button>
                <Typography align="center" variant="body2">
                  New User? <Link href="#">Signup</Link>
                </Typography>
              </div>
            </form>
          </Paper>
        </Box>
      </div>
    </div>
  );
};

export default LoginPage;

