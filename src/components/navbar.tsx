import { NavLink, Outlet, useLocation } from 'react-router';
import AccountMenu from './account-menu';
import { AppBar, Toolbar } from '@mui/material';

const Navbar = () => {
  const location = useLocation();

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          left: 0,
        }}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}>
          <div className="container">
            <div className="w-full flex items-center justify-between gap-[24px]">
              <div className="flex gap-[24px]">
                <NavLink
                  to={'/dashboard'}
                  style={{
                    fontWeight:
                      location.pathname === '/dashboard' ? 'bold' : 'normal',
                  }}>
                  Dashboard
                </NavLink>
                <NavLink
                  to={'/dashboard/users'}
                  style={{
                    fontWeight:
                      location.pathname === '/dashboard/users'
                        ? 'bold'
                        : 'normal',
                  }}>
                  Users
                </NavLink>
              </div>
              <AccountMenu />
            </div>
          </div>
        </Toolbar>
      </AppBar>

      <div className="pt-[64px]">
        <Outlet />
      </div>
    </>
  );
};

export default Navbar;

