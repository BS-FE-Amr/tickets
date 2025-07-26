import { useNavigate } from 'react-router';

const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return { handleLogout };
};

export default useLogout;
