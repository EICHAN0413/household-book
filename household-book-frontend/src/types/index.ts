export type TransactionType = 'INCOME' | 'EXPENSE';

export interface HouseholdTransaction {
	id: number;
	transactionDate: string;
	description: string;
	category: string;
	amount: number;
	type: TransactionType;
}

// フォーム送信用データ型
export interface TransactionFormData {
	transactionDate: string;
	description: string;
	category: string;
	amount: number | string;
	type: TransactionType;
}