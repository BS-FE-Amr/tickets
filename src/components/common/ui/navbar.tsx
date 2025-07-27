import { NavLink, Outlet } from 'react-router';
import useLogout from '../../../hooks/use-logout';

const Navbar = () => {
  const { handleLogout } = useLogout();

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

