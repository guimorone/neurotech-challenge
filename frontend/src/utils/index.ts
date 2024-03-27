export function formatNumber(
  value: number,
  style: Intl.NumberFormatOptions['style'] = 'currency',
  format: string | string[] = 'pt-BR',
  currency: Intl.NumberFormatOptions['currency'] = 'BRL'
): string {
  const options: Intl.NumberFormatOptions = {
    style,
    currency: style === 'currency' ? currency : undefined,
    minimumFractionDigits: 2,
    maximumFractionDigits: style === 'currency' ? 2 : 20,
    minimumSignificantDigits: style !== 'currency' ? 1 : undefined,
    maximumSignificantDigits: style !== 'currency' ? 20 : undefined,
  };

  return new Intl.NumberFormat(format, options).format(value);
}

export const classNames = (...classes: any[]): string => classes.filter(Boolean).join(' ');

export const convertCurrencyToNumber = (value: string): number =>
  Number(
    value
      .replace(',', '.')
      .replace('.', '')
      .replace(/[^0-9-]+/g, '')
  ) / 100;
