import { Button, TextField } from '@mui/material';
import useLogin from '../hooks/use-login';

const LoginForm = () => {
  const { errors, isLoading, handleChange, handleSubmit, formData } =
    useLogin();

  return (
    <div className="w-full h-screen grid place-items-center justify-center">
      <div className="container">
        <h1 className="font-rubik text-[40px] font-black mb-[24px]">Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="py-[24px] px-[40px] rounded-[24px] bg-slate-100 flex flex-col gap-[24px] items-center justify-center w-fit">
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
            {errors?.global && <p>{errors.global}</p>}
            <Button type="submit" variant="contained" disabled={isLoading}>
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;

