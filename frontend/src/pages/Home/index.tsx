import { useMemo, useState, useEffect, type FC, type ChangeEventHandler } from 'react';
import { Spinner, FooterDivider } from 'flowbite-react';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/solid';
import { useQuery, useQueries } from '@tanstack/react-query';
import Input from '../../components/Input';
import Table, { type TableProps } from '../../components/Table';
import { formatNumber, classNames, convertCurrencyToNumber } from '../../utils';
import { useTypedOutletContext } from '../../utils/hooks';
import { INITIAL_AMOUNT, INITIAL_CHECK_PERIOD } from '../../constants';
import type { AxiosError } from 'axios';
import type { CurrencyType, DBCurrencyRate, IntRange } from '../../@types';

type TabIndex = IntRange<0, 2>;

const Home: FC = () => {
	const { currencies } = useTypedOutletContext();
	const [currentTabIndex, setCurrentTabIndex] = useState<TabIndex>(0);
	const [latestCurrencies, setLatestCurrencies] = useState<
		(Omit<DBCurrencyRate, 'created_at'> & { created_at: string })[]
	>(localStorage.getItem('latestCurrencies') ? JSON.parse(localStorage.getItem('latestCurrencies') as string) : []);
	const [checkPeriod, setCheckPeriod] = useState<number>(INITIAL_CHECK_PERIOD);
	const [currentBaseCurrency, setCurrentBaseCurrency] = useState<CurrencyType>('BRL');
	const [currentToCurrency, setCurrentToCurrency] = useState<CurrencyType>('USD');
	const [baseCurrencyValue, setBaseCurrencyValue] = useState<number>(INITIAL_AMOUNT);
	const [toCurrencyValue, setToCurrencyValue] = useState<number>(INITIAL_AMOUNT);
	const [deleteAllCurrenciesRates, setDeleteAllCurrenciesRates] = useState<boolean>(false);
	const { isError, error, data, isFetching, refetch } = useQuery<DBCurrencyRate[]>({
		queryKey: [
			'api',
			'currency-rates',
			'POST',
			{ data: { base_currency: currentBaseCurrency, to_currency: currentToCurrency } },
		],
		enabled: checkPeriod > 0,
		refetchOnMount: 'always',
		refetchOnWindowFocus: true,
		refetchOnReconnect: 'always',
		refetchInterval: checkPeriod * 1000,
		refetchIntervalInBackground: true,
		staleTime: checkPeriod * 1000,
	});

	const [
		{ data: allCurrenciesRates, refetch: refetchDatabaseCurrencyRates },
		{ isFetching: isDeletingAll, isSuccess: isSuccessDeleteAll, isFetched: isFetchedDeleteAll },
	] = useQueries({
		queries: [
			{
				queryKey: ['api', 'currency-rates', 'GET'],
				enabled: currentTabIndex === 1 && checkPeriod > 0,
				refetchOnMount: 'always',
				refetchOnWindowFocus: true,
				refetchOnReconnect: 'always',
				refetchInterval: checkPeriod * 1000,
				refetchIntervalInBackground: true,
				staleTime: checkPeriod * 1000,
			},
			{
				queryKey: ['api', 'currency-rates/delete-all', 'DELETE'],
				enabled: deleteAllCurrenciesRates,
			},
		],
	});

	useEffect(() => {
		if (isSuccessDeleteAll) refetchDatabaseCurrencyRates();
	}, [isSuccessDeleteAll]);

	useEffect(() => {
		if (isFetchedDeleteAll) setDeleteAllCurrenciesRates(false);
	}, [isFetchedDeleteAll]);

	useEffect(() => {
		refetch();
		refetchDatabaseCurrencyRates();
	}, [currentBaseCurrency, currentToCurrency]);

	const currentRates = useMemo(() => {
		if (isError || !data || !data.length) return latestCurrencies;

		return data;
	}, [isError, data, latestCurrencies]);

	const currentRate = useMemo(
		() =>
			currentRates?.find(
				({ base_currency, to_currency }) => currentBaseCurrency == base_currency && currentToCurrency == to_currency
			)?.rate || 1,
		[currentBaseCurrency, currentToCurrency, currentRates]
	);

	const updateInput = (value: number): void => {
		if (!currentRates) return;

		setBaseCurrencyValue(value);
		setToCurrencyValue(value * currentRate);
	};

	useEffect(() => {
		updateInput(baseCurrencyValue);
	}, [currentRate]);

	useEffect(() => {
		if (isError && error) alert((error as AxiosError)?.response?.data || error);
	}, [isError, error]);

	useEffect(() => {
		if (isFetching || isError || !currentRates) return;

		setLatestCurrencies(prev => {
			const newLatestCurrencies = prev.concat(currentRates);

			localStorage.setItem('latestCurrencies', JSON.stringify(newLatestCurrencies));

			return newLatestCurrencies;
		});
	}, [isFetching, isError, currentRates]);

	const tableTabs: (TableProps & { label: string; current: boolean })[] = [
		{
			title: 'Cotações anteriores',
			description: 'Acompanhe os últimos valores registrados neste dispositivo.',
			label: 'Armazenamento local',
			current: currentTabIndex === 0,
			columns: [
				{ label: 'Moeda Base', value: 'base_currency' },
				{ label: 'Moeda de Destino', value: 'to_currency' },
				{ label: 'Taxa de Câmbio', value: 'rate' },
				{ label: 'Data', value: 'created_at' },
			],
			data: latestCurrencies,
			clearButtonFunction: () => {
				setLatestCurrencies([]);
				localStorage.removeItem('latestCurrencies');
			},
		},
		{
			title: 'Cotações anteriores',
			description: 'Acompanhe os últimos valores registrados em nosso banco de dados.',
			label: 'Banco de dados',
			current: currentTabIndex === 1,
			columns: [
				{ label: 'ID', value: 'id' },
				{ label: 'Moeda Base', value: 'base_currency' },
				{ label: 'Moeda de Destino', value: 'to_currency' },
				{ label: 'Taxa de Câmbio', value: 'rate' },
				{ label: 'Data', value: 'created_at' },
			],
			data: (allCurrenciesRates as DBCurrencyRate[]) || [],
			isLoading: isDeletingAll,
			clearButtonFunction: () => setDeleteAllCurrenciesRates(true),
		},
	];

	const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) =>
		updateInput(convertCurrencyToNumber(target.value));

	const handleSwapCurrencies = () => {
		setCurrentBaseCurrency(currentToCurrency);
		setBaseCurrencyValue(toCurrencyValue);

		setToCurrencyValue(baseCurrencyValue);
		setCurrentToCurrency(currentBaseCurrency);
	};

	if (!currentRates) {
		if (!isFetching) return <h1 className="text-center text-red-600 text-6xl mt-12">Serviço indisponível</h1>;

		return (
			<div className="flex flex-col items-center justify-center gap-y-12">
				<h1 className="text-center text-blue-600 text-6xl mt-12 motion-safe:animate-pulse">
					Estabelecendo conexão com o servidor...
				</h1>
				<Spinner size="xl" color="info" />
			</div>
		);
	}

	return (
		<main className="flex flex-col items-center justify-center w-full h-full gap-y-12">
			<div className="space-y-4">
				<h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Conversor de moedas</h1>
				<h1 className="text-center text-lg leading-8 text-gray-600">
					{`${currentBaseCurrency} x ${currentToCurrency}`}
				</h1>
			</div>
			<div className="flex flex-col gap-y-8 items-center justify-center w-full h-full">
				<div className="space-y-8 w-full">
					<div className="flex flex-col md:flex-row gap-8 items-center justify-center">
						<div className="space-y-2">
							<div className="space-y-2 w-fit">
								<label htmlFor="base_currency" className="block text-sm font-medium leading-6 text-gray-900">
									Moeda Base
								</label>
								<select
									id="base_currency"
									name="base_currency"
									className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
									value={currentBaseCurrency}
									onChange={({ target }) => {
										if (currentToCurrency == target.value) setCurrentToCurrency(currentBaseCurrency);
										setCurrentBaseCurrency(target.value as CurrencyType);
									}}
								>
									{currencies.map(({ currency }) => (
										<option key={`base_${currency}`} value={currency} disabled={currency == currentBaseCurrency}>
											{currency}
										</option>
									))}
								</select>
							</div>
							<Input
								value={formatNumber(baseCurrencyValue, 'currency', 'pt-BR', currentBaseCurrency)}
								onChange={handleChange}
							/>
						</div>
						<button className="text-gray-900 hover:text-gray-800" onClick={handleSwapCurrencies}>
							<ArrowsRightLeftIcon className="h-4 md:h-6 w-auto" aria-disabled="true" />
						</button>
						<div className="space-y-2">
							<div className="space-y-2 w-fit">
								<label htmlFor="to_currency" className="block text-sm font-medium leading-6 text-gray-900">
									Moeda de Destino
								</label>
								<select
									id="to_currency"
									name="to_currency"
									className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
									value={currentToCurrency}
									onChange={({ target }) => {
										if (currentBaseCurrency == target.value) setCurrentBaseCurrency(currentToCurrency);
										setCurrentToCurrency(target.value as CurrencyType);
									}}
								>
									{currencies.map(({ currency }) => (
										<option key={`to_${currency}`} value={currency} disabled={currency == currentToCurrency}>
											{currency}
										</option>
									))}
								</select>
							</div>
							<Input
								value={formatNumber(toCurrencyValue, 'currency', 'pt-BR', currentToCurrency)}
								onChange={handleChange}
								disabled
							/>
						</div>
					</div>
					<p className="text-center text-xl">
						Cotação atual &rarr; {`1 ${currentBaseCurrency} = ${currentRate.toFixed(2)} ${currentToCurrency}`}
					</p>
					<div className="flex flex-col items-center justify-center gap-y-2">
						<Input
							label="Período de atualização da cotação (em segundos)"
							type="number"
							value={checkPeriod}
							onChange={({ target }) => setCheckPeriod(+target.value)}
						/>
						{isFetching ? (
							<p className="text-center text-base md:text-lg text-indigo-600 motion-safe:animate-pulse">
								Atualizando cotação...
							</p>
						) : isError ? (
							<p className="text-center text-base md:text-lg text-red-600">Erro ao atualizar cotação!</p>
						) : (
							<p className="text-center text-base md:text-lg text-teal-500">Cotação atualizada!</p>
						)}
					</div>
				</div>
				<FooterDivider />
				<div className="flex flex-col items-center justify-center gap-y-4 w-full">
					<nav className="flex space-x-4" aria-label="Tabs">
						{tableTabs.map(({ label, current }, index) => (
							<button
								key={label}
								onClick={() => setCurrentTabIndex(index as TabIndex)}
								className={classNames(
									current ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700',
									'rounded-md px-3 py-2 text-sm font-medium'
								)}
								aria-current={current ? 'page' : undefined}
							>
								{label}
							</button>
						))}
					</nav>
					<Table {...tableTabs[currentTabIndex]} />
				</div>
			</div>
		</main>
	);
};

export default Home;
