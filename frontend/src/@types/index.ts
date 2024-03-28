import type { ForwardRefExoticComponent, PropsWithoutRef, SVGProps, RefAttributes, JSX } from 'react';

export type OrderType = 'asc' | 'desc';
export type DataItem = { [key: string]: any };
export type Column = { label: string; value: string };

export type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
	? Acc[number]
	: Enumerate<N, [...Acc, Acc['length']]>;

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

export type Sizes =
	| 'xs'
	| 'sm'
	| 'md'
	| 'lg'
	| 'xl'
	| '2xl'
	| '3xl'
	| '4xl'
	| '5xl'
	| '6xl'
	| '7xl'
	| '8xl'
	| '9xl'
	| '10xl';

export type IconType =
	| ForwardRefExoticComponent<
			PropsWithoutRef<SVGProps<SVGSVGElement>> & {
				title?: string;
				titleId?: string;
			} & RefAttributes<SVGSVGElement>
	  >
	| ((props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => JSX.Element);

export type CurrencyType = 'BRL' | 'USD' | 'EUR';

export type DBCurrencyRate = {
	base_currency: CurrencyType;
	to_currency: CurrencyType;
	rate: number;
	created_at: string;
};
export type DBCurrency = { currency: CurrencyType; rates: DBCurrencyRate[]; created_at: string; updated_at: string };

export type ContextType = {
	currencies: DBCurrency[];
};
