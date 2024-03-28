import { useOutletContext } from 'react-router-dom';
import type { ContextType } from '../@types';

export function useTypedOutletContext(): ContextType {
	return useOutletContext<ContextType>();
}
