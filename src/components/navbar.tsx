import { NavLink, Outlet, useNavigate } from 'react-router';

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <>
      <nav className="bg-slate-200 fixed w-full h-[48px] flex items-center justify-center top-0">
        <div className="container flex items-center gap-[24px]">
          <NavLink to={'/dashboard'}>Dashboard</NavLink>
          <NavLink to={'/dashboard/users'}>Users</NavLink>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <div className="pt-[48px]">
        <Outlet />
      </div>
    </>
  );
};

export default Navbar;

