import axios from 'axios';
import type { HouseholdTransaction, TransactionFormData } from '../types';

const API_BASE_URL = 'http://localhost:8080/api/transactions';

export const transactionApi = {
	getAll: async () => {
		const response = await axios.get<HouseholdTransaction[]>(API_BASE_URL);
		return response.data;
	},

	getById: async (id: number) => {
		const response = await axios.get<HouseholdTransaction>(`${API_BASE_URL}/${id}`);
		return response.data;
	},

	create: async (data: TransactionFormData) => {
		const response = await axios.post<HouseholdTransaction>(API_BASE_URL, data);
		return response.data;
	},

	update: async (id: number, data: TransactionFormData) => {
		const response = await axios.put<HouseholdTransaction>(`${API_BASE_URL}/${id}`, data);
		return response.data;
	},

	delete: async (id: number) => {
		await axios.delete(`${API_BASE_URL}/${id}`);
	}
};