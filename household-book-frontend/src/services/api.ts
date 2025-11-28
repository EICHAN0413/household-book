import axios from 'axios';
import type { HouseholdTransaction, TransactionFormData } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const client = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const transactionApi = {
	getAll: async () => {
        const response = await client.get<HouseholdTransaction[]>('/transactions');
		return response.data;
	},

	getById: async (id: number) => {
		const response = await client.get<HouseholdTransaction>(`/transactions/${id}`);
		return response.data;
	},

	create: async (data: TransactionFormData) => {
		const response = await client.post<HouseholdTransaction>('/transactions', data);
		return response.data;
	},

	update: async (id: number, data: TransactionFormData) => {
        const response = await client.put<HouseholdTransaction>(`/transactions/${id}`, data);
		return response.data;
	},

	delete: async (id: number) => {
        await client.delete(`/transactions/${id}`);
	}
};

export const authApi = {
    // ログイン (Spring標準に合わせてフォーム形式で送信)
    login: async (username: string, password: string) => {
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);
      
      await client.post('/auth/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
    },
  
    // ログアウト
    logout: async () => {
      await client.post('/auth/logout');
    },
  
    // 登録
    register: async (username: string, password: string) => {
      await client.post('/auth/register', { username, password });
    },
  
    // 認証チェック
    checkStatus: async () => {
      await client.get('/auth/status');
    }
  };