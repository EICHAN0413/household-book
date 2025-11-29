import React, { useState, useEffect, useMemo } from 'react';
import {
	Container, Typography, Table, TableBody, TableCell, TableContainer,
	TableHead, TableRow, Paper, Button, IconButton, Box, CircularProgress, Alert,
	Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
	TextField, Chip, TablePagination, TableSortLabel, Grid, Tabs, Tab, Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { transactionApi } from '../services/api';
import type { HouseholdTransaction } from '../types';

// カテゴリ一覧
const CATEGORIES = ['食費', '交通費', '光熱費', '通信費', '交際費', '趣味・娯楽', '給与', 'その他収入', 'その他支出'];

type Order = 'asc' | 'desc';

const TransactionList: React.FC = () => {
	const navigate = useNavigate();

	const [transactions, setTransactions] = useState<HouseholdTransaction[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
	const [selectedId, setSelectedId] = useState<number | null>(null);

	// フィルタ機能
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [startDate, setStartDate] = useState<string>('');
	const [endDate, setEndDate] = useState<string>('');
	const [minAmount, setMinAmount] = useState<string>('');
	const [maxAmount, setMaxAmount] = useState<string>('');

	// カテゴリ選択用ステート (デフォルトは 'ALL')
	const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

	// ソート・ページネーション
	const [order, setOrder] = useState<Order>('desc');
	const [orderBy, setOrderBy] = useState<keyof HouseholdTransaction>('transactionDate');
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(20);

	useEffect(() => {
		fetchTransactions();
	}, []);

	const fetchTransactions = async () => {
		try {
			setLoading(true);
			const data = await transactionApi.getAll();
			setTransactions(data);
			setError(null);
		} catch (err) {
			console.error(err);
			setError('データの取得に失敗しました。');
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteClick = (id: number) => {
		setSelectedId(id);
		setOpenDeleteDialog(true);
	};

	const handleCloseDeleteDialog = () => {
		setOpenDeleteDialog(false);
		setSelectedId(null);
	};

	const handleConfirmDelete = async () => {
		if (selectedId) {
			try {
				await transactionApi.delete(selectedId);
				fetchTransactions();
				handleCloseDeleteDialog();
			} catch (err) {
				console.error(err);
				setError('データの削除に失敗しました。');
			}
		}
	};

	const handleRequestSort = (property: keyof HouseholdTransaction) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleChangePage = (_: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	// タブ切り替え時のハンドラ
	const handleCategoryChange = (_: React.SyntheticEvent, newValue: string) => {
		setSelectedCategory(newValue);
		setPage(0);
	};

	// フィルタリングロジック
	const filteredTransactions = useMemo(() => {
		return transactions.filter(t => {
			// カテゴリフィルタ (Tabs)
			const matchesCategory = selectedCategory === 'ALL' || t.category === selectedCategory;

			// フリー検索
			const lowerTerm = searchTerm.toLowerCase();
			const matchesSearch =
				t.transactionDate.toString().includes(lowerTerm) ||
				t.description.toLowerCase().includes(lowerTerm) ||
				t.amount.toString().includes(lowerTerm) ||
				t.type.toString().includes(lowerTerm) ||
				t.category.toString().includes(lowerTerm)
				;

			// 日付範囲
			const matchesStart = startDate ? t.transactionDate >= startDate : true;
			const matchesEnd = endDate ? t.transactionDate <= endDate : true;

			// 金額範囲
			const matchesMinAmount = minAmount !== '' ? t.amount >= Number(minAmount) : true;
			const matchesMaxAmount = maxAmount !== '' ? t.amount <= Number(maxAmount) : true;

			return matchesCategory && matchesSearch && matchesStart && matchesEnd && matchesMinAmount && matchesMaxAmount;
		});
	}, [transactions, searchTerm, startDate, endDate, selectedCategory, minAmount, maxAmount]);

	const sortedTransactions = useMemo(() => {
		return [...filteredTransactions].sort((a, b) => {
			const aValue = a[orderBy];
			const bValue = b[orderBy];
			if (bValue < aValue) return order === 'asc' ? 1 : -1;
			if (bValue > aValue) return order === 'asc' ? -1 : 1;
			return 0;
		});
	}, [filteredTransactions, order, orderBy]);

	const paginatedTransactions = useMemo(() => {
		return sortedTransactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
	}, [sortedTransactions, page, rowsPerPage]);


	if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
	if (error) return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;

	return (
		<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
				<Typography variant="h4">入出金一覧</Typography>
				<Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/add-transaction')}>
					新規登録
				</Button>
			</Box>

			<Paper sx={{ mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				<Tabs
					value={selectedCategory}
					onChange={handleCategoryChange}
					variant="scrollable"
					scrollButtons="auto"
					textColor="primary"
					indicatorColor="primary"
					aria-label="category tabs"
				>
					<Tab label="すべて" value="ALL" />
					{CATEGORIES.map((cat) => (
						<Tab key={cat} label={cat} value={cat} />
					))}
				</Tabs>
			</Paper>

			{/* フィルタエリア */}
			<Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				<Grid container spacing={2} alignItems="center">
					<Grid size={{ xs: 12, md: 2 }}>
						<TextField
							label="フリー検索"
							variant="outlined"
							size="small"
							fullWidth
							value={searchTerm}
							onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
						/>
					</Grid>
					<Grid size={{ xs: 6, md: 2 }}>
						<TextField
							label="開始日"
							type="date"
							size="small"
							fullWidth
							InputLabelProps={{ shrink: true }}
							value={startDate}
							onChange={(e) => { setStartDate(e.target.value); setPage(0); }}
						/>
					</Grid>
					<Grid size={{ xs: 6, md: 2 }}>
						<TextField
							label="終了日"
							type="date"
							size="small"
							fullWidth
							InputLabelProps={{ shrink: true }}
							value={endDate}
							onChange={(e) => { setEndDate(e.target.value); setPage(0); }}
						/>
					</Grid>
					<Grid size={{ xs: 6, md: 2 }}>
						<TextField
							label="金額 (下限)"
							type="number"
							size="small"
							fullWidth
							value={minAmount}
							onChange={(e) => { setMinAmount(e.target.value); setPage(0); }}
						/>
					</Grid>
					<Grid size={{ xs: 6, md: 2 }}>
						<TextField
							label="金額 (上限)"
							type="number"
							size="small"
							fullWidth
							value={maxAmount}
							onChange={(e) => { setMaxAmount(e.target.value); setPage(0); }}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 2 }} >
						<Button
							variant="text"
							onClick={() => { setSearchTerm(''); setStartDate(''); setEndDate(''); setPage(0); }}
						>
							リセット
						</Button>
					</Grid>
				</Grid>
			</Paper>

			<Paper elevation={2}>
				<TableContainer>
					<Table sx={{ minWidth: 650 }} aria-label="transaction table">
						<TableHead sx={{ bgcolor: '#f5f5f5' }}>
							<TableRow>
								{/* ソート可能ヘッダー */}
								<TableCell sortDirection={orderBy === 'transactionDate' ? order : false}>
									<TableSortLabel
										active={orderBy === 'transactionDate'}
										direction={orderBy === 'transactionDate' ? order : 'asc'}
										onClick={() => handleRequestSort('transactionDate')}
									>
										日付
									</TableSortLabel>
								</TableCell>

								<TableCell sortDirection={orderBy === 'type' ? order : false}>
									<TableSortLabel
										active={orderBy === 'type'}
										direction={orderBy === 'type' ? order : 'asc'}
										onClick={() => handleRequestSort('type')}
									>
										種別
									</TableSortLabel>
								</TableCell>

								<TableCell sortDirection={orderBy === 'category' ? order : false}>
									<TableSortLabel
										active={orderBy === 'category'}
										direction={orderBy === 'category' ? order : 'asc'}
										onClick={() => handleRequestSort('category')}
									>
										カテゴリ
									</TableSortLabel>
								</TableCell>

								<TableCell>説明</TableCell>

								<TableCell align="right" sortDirection={orderBy === 'amount' ? order : false}>
									<TableSortLabel
										active={orderBy === 'amount'}
										direction={orderBy === 'amount' ? order : 'asc'}
										onClick={() => handleRequestSort('amount')}
									>
										金額
									</TableSortLabel>
								</TableCell>
								<TableCell align="center">操作</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paginatedTransactions.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} align="center">データがありません。</TableCell>
								</TableRow>
							) : (
								paginatedTransactions.map((t) => (
									<TableRow key={t.id} hover>
										<TableCell>{t.transactionDate}</TableCell>
										<TableCell>
											<Chip
												label={t.type === 'INCOME' ? '収入' : '支出'}
												color={t.type === 'INCOME' ? 'primary' : 'error'}
												size="small"
												variant="outlined"
											/>
										</TableCell>
										<TableCell>{t.category}</TableCell>
										<TableCell>{t.description}</TableCell>
										<TableCell align="right" sx={{ fontWeight: 'bold', color: t.type === 'INCOME' ? 'primary.main' : 'error.main' }}>
											{t.type === 'INCOME' ? '+' : '-'} ¥{t.amount.toLocaleString()}
										</TableCell>
										<TableCell align="center">
											<Tooltip title="編集" arrow>
												<IconButton color="primary" onClick={() => navigate(`/edit-transaction/${t.id}`)}>
													<EditIcon />
												</IconButton>
											</Tooltip>
											<Tooltip title="削除" arrow>
												<IconButton color="error" onClick={() => handleDeleteClick(t.id)}>
													<DeleteIcon />
												</IconButton>
											</Tooltip>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</TableContainer>

				{/* ページネーション */}
				<TablePagination
					rowsPerPageOptions={[10, 20, 50]}
					component="div"
					count={filteredTransactions.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
					labelRowsPerPage="表示件数:"
				/>
			</Paper>

			<Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
				<DialogTitle>削除の確認</DialogTitle>
				<DialogContent>
					<DialogContentText>このデータを本当に削除してもよろしいですか？</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDeleteDialog}>キャンセル</Button>
					<Button onClick={handleConfirmDelete} color="error" autoFocus>削除</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
};

export default TransactionList;