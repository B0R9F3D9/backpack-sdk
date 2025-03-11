import axios, {
	AxiosError,
	type AxiosInstance,
	type AxiosProxyConfig,
	type AxiosResponse,
} from 'axios';

import type { Depth } from '../types';

interface RequestParams {
	[key: string]: string | number | boolean | undefined;
}

export class PublicClient {
	protected readonly API_URL: string = 'https://api.backpack.exchange/';
	protected axiosInstance: AxiosInstance;

	constructor(proxy?: AxiosProxyConfig) {
		this.axiosInstance = axios.create({
			baseURL: this.API_URL,
			proxy,
		});
	}

	private async makePublicRequest<T>(uri: string, params: RequestParams = {}) {
		try {
			const response: AxiosResponse<T> = await this.axiosInstance.get<T>(uri, {
				params,
			});
			return response.data;
		} catch (error) {
			if (error instanceof AxiosError) {
				const status = error.response?.status;
				const message = error.response?.data?.message || error.message;
				throw new Error(
					`API request failed: ${status ? `Status ${status} - ` : ''}${message}`,
				);
			}
			throw new Error(
				`Unexpected error during API request: ${(error as Error).message}`,
			);
		}
	}

	async getDepth(symbol: string) {
		return this.makePublicRequest<Depth>('/api/v1/depth', { symbol });
	}
}

export default PublicClient;
