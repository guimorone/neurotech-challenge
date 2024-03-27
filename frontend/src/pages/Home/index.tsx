import { useState, useEffect, type FC, type ChangeEventHandler } from 'react';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/solid';
import Input from '../../components/Input';
import { formatNumber, classNames, convertCurrencyToNumber } from '../../utils';
import { INITIAL_AMOUNT } from '../../constants';
import type { CurrencyType } from '../../@types';

const Home: FC = () => {
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyType>('BRL');
  const [BRLValue, setBRLValue] = useState<number>(INITIAL_AMOUNT);
  const [USDValue, setUSDValue] = useState<number>(INITIAL_AMOUNT);

  const updateInput = (value: number): void => {
    if (currentCurrency === 'BRL') {
      setBRLValue(value);
      setUSDValue(value / 5.5);
    } else {
      setUSDValue(value);
      setBRLValue(value * 5.5);
    }
  };

  useEffect(() => {
    if (currentCurrency === 'BRL') updateInput(BRLValue);
    else updateInput(USDValue);
  }, [currentCurrency]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) =>
    updateInput(convertCurrencyToNumber(target.value));

  return (
    <main className="flex flex-col items-center justify-center max-w-7xl mt-32 m-auto w-full h-full gap-y-8">
      <h1 className="text-center text-4xl md:text-6xl">Conversor de moedas</h1>
      <h1 className="text-center text-2xl md:text-4xl">{currentCurrency === 'BRL' ? 'BRL x USD' : 'USD x BRL'}</h1>
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
          <Input value={formatNumber(USDValue, 'currency', 'en-US', 'USD')} disabled={currentCurrency === 'BRL'} />
        </div>
      </div>
      <div className="flex items-center gap-x-4 text-xl">
        Cotação atual &rarr; {currentCurrency === 'BRL' ? '1 BRL = 0.5 USD' : '1 USD = 5.5 BRL'}
      </div>
    </main>
  );
};

export default Home;
