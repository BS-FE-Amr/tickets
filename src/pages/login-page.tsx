import {
  Box,
  Button,
  Checkbox,
  Container,
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
    const { data } = await api.post('/auth/local', {
      identifier: formData.username,
      password: formData.password,
    });
    return data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => loginUser(),
    onSuccess: (data) => {
      if (formData.remember) {
        localStorage.setItem('access_token', data?.jwt);
        localStorage.setItem('refresh_token', data?.refreshToken);
      } else {
        sessionStorage.setItem('access_token', data?.jwt);
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
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'grid',
        placeItems: 'center',
        justifyContent: 'center',
      }}>
      <Container>
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
              <Box
                sx={{
                  py: 3, // 24px (3 * 8px)
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                }}>
                <TextField
                  id="outlined-basic"
                  label="Username"
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
              </Box>
            </form>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;

