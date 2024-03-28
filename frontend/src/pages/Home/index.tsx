import { useState, useEffect, type FC, type ChangeEventHandler } from 'react';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/solid';
import { useQuery } from '@tanstack/react-query';
import Input from '../../components/Input';
import Table from '../../components/Table';
import { formatNumber, classNames, convertCurrencyToNumber } from '../../utils';
import { INITIAL_AMOUNT, INITIAL_CHECK_PERIOD } from '../../constants';
import type { CurrencyType, CurrencyRateData, SavedCurrencies } from '../../@types';

const Home: FC = () => {
	const [latestCurrencies, setLatestCurrencies] = useState<SavedCurrencies>(
		localStorage.getItem('latestCurrencies') ? JSON.parse(localStorage.getItem('latestCurrencies') as string) : []
	);
	const [checkPeriod, setCheckPeriod] = useState<number>(INITIAL_CHECK_PERIOD);
	const [currentCurrency, setCurrentCurrency] = useState<CurrencyType>('BRL');
	const [BRLValue, setBRLValue] = useState<number>(INITIAL_AMOUNT);
	const [USDValue, setUSDValue] = useState<number>(INITIAL_AMOUNT);
	const { data, isFetching } = useQuery<CurrencyRateData>({
		queryKey: ['api', 'currency', 'GET'],
		enabled: checkPeriod > 0,
		refetchOnMount: 'always',
		refetchOnWindowFocus: true,
		refetchOnReconnect: 'always',
		refetchInterval: checkPeriod * 1000,
		refetchIntervalInBackground: true,
		staleTime: checkPeriod * 1000,
	});

	const updateInput = (value: number): void => {
		if (!data || !data.BRL || !data.BRL.length || !data.USD || !data.USD.length) return;

		if (currentCurrency === 'BRL') {
			setBRLValue(value);
			setUSDValue(value * data.BRL[0][1]);
		} else {
			setBRLValue(value * data.USD[0][1]);
			setUSDValue(value);
		}
	};

	useEffect(() => {
		if (currentCurrency === 'BRL') updateInput(BRLValue);
		else updateInput(USDValue);
	}, [currentCurrency]);

	useEffect(() => {
		if (isFetching || !data || !data.BRL || !data.BRL.length || !data.USD || !data.USD.length) return;

		setLatestCurrencies(prev => {
			const now = new Date();
			const newLatestCurrencies = [
				{ ...data, datetime: now.toLocaleDateString() + ' às ' + now.toLocaleTimeString() },
				...prev,
			];

			localStorage.setItem('latestCurrencies', JSON.stringify(newLatestCurrencies));

			return newLatestCurrencies;
		});
	}, [isFetching, data]);

	const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) =>
		updateInput(convertCurrencyToNumber(target.value));

	if (!data || !data.BRL || !data.BRL.length || !data.USD || !data.USD.length) return null;

	return (
		<main className="flex flex-col items-center justify-center max-w-7xl my-12 px-4 m-auto w-full h-full gap-y-12">
			<div className="space-y-4">
				<h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Conversor de moedas</h1>
				<h1 className="text-center text-lg leading-8 text-gray-600">
					{currentCurrency === 'BRL' ? 'BRL x USD' : 'USD x BRL'}
				</h1>
			</div>
			<div className="flex flex-col lg:flex-row gap-y-8 lg:gap-x-8 lg:gap-y-0 items-center lg:items-start justify-center w-full">
				<div className="space-y-8">
					<div className="flex flex-col md:flex-row gap-y-8 gap-x-0 md:gap-y-0 md:gap-x-8 items-center">
						<div className={classNames(currentCurrency === 'BRL' ? 'order-1' : 'order-3')}>
							<Input value={formatNumber(BRLValue)} onChange={handleChange} disabled={currentCurrency === 'USD'} />
						</div>
						<button
							className="text-gray-900 hover:text-gray-800 order-2"
							onClick={() => setCurrentCurrency(prev => (prev === 'BRL' ? 'USD' : 'BRL'))}
						>
							<ArrowsRightLeftIcon className="h-4 md:h-6 w-auto" aria-disabled="true" />
						</button>
						<div className={classNames(currentCurrency === 'USD' ? 'order-1' : 'order-3')}>
							<Input
								value={formatNumber(USDValue, 'currency', 'en-US', 'USD')}
								onChange={handleChange}
								disabled={currentCurrency === 'BRL'}
							/>
						</div>
					</div>
					<p className="text-center text-xl">
						Cotação atual &rarr;{' '}
						{currentCurrency === 'BRL'
							? `1 BRL = ${data.BRL[0][1].toFixed(2)} USD`
							: `1 USD = ${data.USD[0][1].toFixed(2)} BRL`}
					</p>
					{isFetching ? (
						<p className="text-center text-lg text-indigo-600 motion-safe:animate-pulse">Atualizando cotação...</p>
					) : (
						<p className="text-center text-lg text-teal-500">Cotação atualizada!</p>
					)}
					<Input
						label="Período de atualização da cotação (em segundos)"
						type="number"
						value={checkPeriod}
						onChange={({ target }) => setCheckPeriod(+target.value)}
					/>
				</div>
				<Table
					title="Cotações anteriores"
					description="Acompanhe os últimos valores registrados neste dispositivo."
					data={latestCurrencies}
					clearButtonFunction={() => {
						setLatestCurrencies([]);
						localStorage.clear();
					}}
				/>
			</div>
		</main>
	);
};

export default Home;
