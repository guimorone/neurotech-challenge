import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { DocumentTextIcon } from '@heroicons/react/24/solid';
import { SWAGGER_DOCS } from '../constants/urls';
import * as routes from '../constants/routes';

export default function Default() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === routes.DEFAULT) navigate(`/${routes.HOME}`);
  }, [navigate, pathname]);

  return (
    <div className="max-w-7xl my-8 px-4 m-auto w-full h-full space-y-4">
      <a
        target="_blank"
        href={SWAGGER_DOCS}
        className="inline-flex gap-x-2 items-center rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <DocumentTextIcon className="w-auto h-5" aria-hidden="true" />
        <span>Documentação da API</span>
      </a>
      <Outlet />
    </div>
  );
}
