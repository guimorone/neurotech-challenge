import axios, { type AxiosRequestConfig, type AxiosResponse, type Method } from 'axios';

const api = axios.create({ baseURL: `${import.meta.env.VITE_BACKEND_URL}` });

export async function httpRequest(
	baseUrl: string,
	endpoint: string,
	method: Method,
	additionalConfig?: AxiosRequestConfig<any>
): Promise<AxiosResponse<any, any>> {
	const url = `/${baseUrl}/${endpoint}`;
	const config = { method, ...additionalConfig };

	const response = await api(url, config);

	return response;
}

export default api;
