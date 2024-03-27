import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import * as routes from '../constants/routes';

export default function Default() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === routes.DEFAULT) navigate(`/${routes.HOME}`);
  }, [navigate, pathname]);

  return <Outlet />;
}
