import { NavLink, Outlet } from 'react-router';
import AccountMenu from './account-menu';

const Navbar = () => {
  return (
    <>
      <nav className="bg-slate-200 fixed w-full h-[48px] flex items-center justify-center top-0">
        <div className="container flex items-center justify-between gap-[24px]">
          <div className="flex gap-[24px]">
            <NavLink to={'/dashboard'}>Dashboard</NavLink>
            <NavLink to={'/dashboard/users'}>Users</NavLink>
          </div>
          <AccountMenu />
        </div>
      </nav>
      <div className="pt-[48px]">
        <Outlet />
      </div>
    </>
  );
};

export default Navbar;

