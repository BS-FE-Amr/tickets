import { Button, TextField } from '@mui/material';
import useLogin from '../hooks/use-login';

const LoginForm = () => {
  const { errors, formSubmitLoading, handleChange, handleSubmit, formData } =
    useLogin();

  return (
    <div className="w-full h-screen grid place-items-center justify-center">
      <div className="container">
        <h1 className="font-rubik text-[40px] font-black mb-[24px]">Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="py-[24px] px-[40px] rounded-[24px] bg-slate-100 flex flex-col gap-[24px] items-center justify-center w-fit">
            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={formSubmitLoading}
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
              disabled={formSubmitLoading}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={formSubmitLoading}>
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;

