import { useNavigate } from 'react-router';

const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    navigate('/login');
  };

  return { handleLogout };
};

export default useLogout;

