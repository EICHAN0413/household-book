import React, { useState, useEffect } from 'react';
import {
	Container, Typography, TextField, Button, Box, Paper, FormControl,
	InputLabel, Select, MenuItem, RadioGroup, FormControlLabel, Radio, Alert
} from '@mui/material';
import axios from 'axios';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate, useParams } from 'react-router-dom';
import { transactionApi } from '../services/api';
import type { TransactionFormData } from '../types';

const defaultCategories = ['食費', '交通費', '光熱費', '通信費', '趣味・娯楽', '給与', 'その他収入', 'その他支出'];

const TransactionForm: React.FC = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const isEditMode = !!id;

	const [formData, setFormData] = useState<TransactionFormData>({
		transactionDate: new Date().toISOString().split('T')[0],
		description: '',
		category: '',
		amount: '',
		type: 'EXPENSE',
	});
	const [error, setError] = useState<string | null>(null);
	const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		const loadData = async (transactionId: number) => {
			try {
				const data = await transactionApi.getById(transactionId);
				setFormData({
					...data,
					amount: data.amount,
				});
			} catch (err) {
				console.error(err);
				setError('データの取得に失敗しました。');
			}
		};

		if (isEditMode && id) {
			loadData(Number(id));
		}
	}, [id, isEditMode]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		clearError(name);
	};

	const handleSelectChange = (e: SelectChangeEvent<string>) => {
		const { value } = e.target;
		setFormData(prev => ({ ...prev, category: value }));
		clearError('category');
	};

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value === '' || /^\d*\.?\d*$/.test(value)) {
			setFormData(prev => ({ ...prev, amount: value === '' ? '' : value as string }));
			clearError('amount');
		}
	};

	const clearError = (field: string) => {
		if (validationErrors[field]) {
			setValidationErrors(prev => {
				const newErrors = { ...prev };
				delete newErrors[field];
				return newErrors;
			});
		}
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setError(null);
		setValidationErrors({});

		const payload: TransactionFormData = {
			...formData,
			amount: formData.amount === '' ? 0 : Number(formData.amount),
		};

		try {
			if (isEditMode) {
				await transactionApi.update(Number(id), payload);
			} else {
				await transactionApi.create(payload);
			}
			navigate('/transactionList');
		} catch (err) {
			console.error(err);
			if (axios.isAxiosError(err) && err.response?.status === 400 && err.response.data) {
				setValidationErrors(err.response.data);
			} else {
				setError(`データの${isEditMode ? '更新' : '登録'}に失敗しました。`);
			}
		}
	};

	return (
		<Container maxWidth="md">
			<Paper elevation={3} sx={{ p: 4, mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				<Typography component="h1" variant="h4" gutterBottom>
					{isEditMode ? '入出金の編集' : '入出金の登録'}
				</Typography>

				{error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

				<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>

					<FormControl component="fieldset" margin="normal" fullWidth sx={{ display: 'flex', alignItems: 'center' }}>
						<RadioGroup row name="type" value={formData.type} onChange={handleChange}>
							<FormControlLabel value="EXPENSE" control={<Radio color="error" />} label="支出" />
							<FormControlLabel value="INCOME" control={<Radio color="primary" />} label="収入" />
						</RadioGroup>
					</FormControl>

					<TextField
						margin="normal"
						required
						fullWidth
						label="日付"
						type="date"
						name="transactionDate"
						value={formData.transactionDate}
						onChange={handleChange}
						InputLabelProps={{ shrink: true }}
						error={!!validationErrors.transactionDate}
						helperText={validationErrors.transactionDate}
					/>

					<TextField
						margin="normal"
						required
						fullWidth
						label="説明"
						name="description"
						value={formData.description}
						onChange={handleChange}
						error={!!validationErrors.description}
						helperText={validationErrors.description}
					/>

					<FormControl margin="normal" required fullWidth error={!!validationErrors.category}>
						<InputLabel>カテゴリ</InputLabel>
						<Select
							name="category"
							value={formData.category}
							label="カテゴリ"
							onChange={handleSelectChange}
						>
							{defaultCategories.map((cat) => (
								<MenuItem key={cat} value={cat}>{cat}</MenuItem>
							))}
						</Select>
						{validationErrors.category && <Typography color="error" variant="caption" sx={{ ml: 2 }}>{validationErrors.category}</Typography>}
					</FormControl>

					<TextField
						margin="normal"
						required
						fullWidth
						label="金額"
						name="amount"
						value={formData.amount}
						onChange={handleAmountChange}
						InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>¥</Typography> }}
						error={!!validationErrors.amount}
						helperText={validationErrors.amount}
					/>

					<Box sx={{ mt: 4, mb: 1, display: 'flex', gap: 2 }}>
						<Button type="submit" fullWidth variant="contained" size="large">
							{isEditMode ? '更新' : '登録'}
						</Button>
						<Button fullWidth variant="outlined" size="large" onClick={() => navigate('/transactionList')}>
							キャンセル
						</Button>
					</Box>
				</Box>
			</Paper>
		</Container>
	);
};

export default TransactionForm;