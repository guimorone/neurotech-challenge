import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Spinner } from 'flowbite-react';
import { useQuery } from '@tanstack/react-query';
import { DocumentTextIcon } from '@heroicons/react/24/solid';
import { CURRENCIES } from '../constants';
import { SWAGGER_DOCS } from '../constants/urls';
import * as routes from '../constants/routes';

import type { DBCurrency } from '../@types';

export default function Default() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [currencies, setCurrencies] = useState<DBCurrency[]>(
    localStorage.getItem('currencies') ? JSON.parse(localStorage.getItem('currencies') as string) : []
  );

  const { data: currenciesStored } = useQuery<DBCurrency[]>({
    queryKey: ['api', 'currencies', 'GET'],
    enabled: true,
  });

  const { data: createdCurrencies, isFetching: isCreatingCurrencies } = useQuery<DBCurrency[]>({
    queryKey: ['api', 'currencies', 'POST', { data: CURRENCIES.map(c => ({ currency: c })) }],
    enabled: !currenciesStored || !currenciesStored.length,
  });

  useEffect(() => {
    if (pathname === routes.DEFAULT) navigate(`/${routes.HOME}`);
  }, [navigate, pathname]);

  useEffect(() => {
    if (createdCurrencies && createdCurrencies.length) setCurrencies(createdCurrencies);
    else if (currenciesStored && currenciesStored.length) setCurrencies(currenciesStored);
  }, [currenciesStored, createdCurrencies]);

  useEffect(() => {
    if (!currencies || !currencies.length) return;

    localStorage.setItem('currencies', JSON.stringify(currencies));
  }, [currencies]);

  return (
    <div className="max-w-7xl my-8 px-4 mx-auto w-full h-full space-y-4">
      <a
        target="_blank"
        href={SWAGGER_DOCS}
        className="inline-flex gap-x-2 items-center rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <DocumentTextIcon className="w-auto h-5" aria-hidden="true" />
        <span>Documentação da API</span>
      </a>
      {!currencies || !currencies.length || isCreatingCurrencies ? (
        <Spinner size="xl" />
      ) : (
        <Outlet context={{ currencies }} />
      )}
    </div>
  );
}
