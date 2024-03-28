import type { FC, DetailedHTMLProps, InputHTMLAttributes } from 'react';
import { classNames } from '../../utils';

type InputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & { label?: string };

const Input: FC<InputProps> = ({
  label,
  className = 'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:bg-gray-100',
  ...props
}) => {
  return (
    <div>
      <label htmlFor={props.id} className={classNames(label ? 'mb-2 text-sm' : 'sr-only')}>
        {label || props.name}
      </label>
      <input className={className} {...props} />
    </div>
  );
};

export default Input;
