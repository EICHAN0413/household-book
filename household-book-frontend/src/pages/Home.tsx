import React, { useState, useEffect, useMemo } from 'react';
import { Container, Typography, Paper, Box, CircularProgress, Alert, Grid, TextField } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { transactionApi } from '../services/api';
import type { HouseholdTransaction } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend);

const Home: React.FC = () => {
  const [transactions, setTransactions] = useState<HouseholdTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 月選択用のステート (初期値は現在の月 YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await transactionApi.getAll();
        setTransactions(data);
      } catch (err) {
        console.error(err);
        setError('データの取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 選択された月でデータをフィルタリング＆ソート
  const monthlyTransactions = useMemo(() => {
    // データがない場合は空配列
    if (!transactions) return [];

    return transactions
      .filter((t) => t.transactionDate.startsWith(selectedMonth))
      .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
  }, [transactions, selectedMonth]);

  // 集計ロジック
  const calculateSummary = () => {
    const totalIncome = monthlyTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpense = monthlyTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
  };

  const { totalIncome, totalExpense, balance } = calculateSummary();

  // カテゴリ別データ
  const getCategoryExpenseData = () => {
    const categoryMap: { [key: string]: number } = {};
    monthlyTransactions
      .filter(t => t.type === 'EXPENSE')
      .forEach(t => {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + Number(t.amount);
      });

    return {
      labels: Object.keys(categoryMap),
      datasets: [{
        data: Object.values(categoryMap),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9933', '#C9CBCF'],
      }],
    };
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;

	return (
		<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">ダッシュボード</Typography>
        
        {/* 月選択ピッカー */}
        <TextField
          label="表示月"
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          sx={{ width: 200, bgcolor: 'background.paper' }}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
      </Box>

			<Grid container spacing={3}>
				{/* サマリーカード */}
				<Grid size={{ xs: 12, sm: 4 }}>
					<Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd' }}>
						<Typography variant="subtitle1">総収入</Typography>
						<Typography variant="h5" color="primary.main">¥{totalIncome.toLocaleString()}</Typography>
					</Paper>
				</Grid>
				<Grid size={{ xs: 12, sm: 4 }}>
					<Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#ffebee' }}>
						<Typography variant="subtitle1">総支出</Typography>
						<Typography variant="h5" color="error.main">¥{totalExpense.toLocaleString()}</Typography>
					</Paper>
				</Grid>
				<Grid size={{ xs: 12, sm: 4 }}>
					<Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f1f8e9' }}>
						<Typography variant="subtitle1">残高</Typography>
						<Typography variant="h5" sx={{ color: balance >= 0 ? 'success.main' : 'error.main' }}>
							¥{balance.toLocaleString()}
						</Typography>
					</Paper>
				</Grid>

				{/* グラフ */}
				<Grid size={{ xs: 12, md: 6 }}>
					<Paper sx={{ p: 3, height: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
						<Typography variant="h6" gutterBottom>カテゴリ別支出</Typography>
						{totalExpense > 0 ? (
							<Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
								<Doughnut data={getCategoryExpenseData()} options={{ maintainAspectRatio: false }} />
							</Box>
						) : (
							<Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
								<Typography color="text.secondary">支出データがありません</Typography>
							</Box>
						)}
					</Paper>
				</Grid>

				{/* 最新の履歴 */}
				<Grid size={{ xs: 12, md: 6 }}>
					<Paper sx={{ p: 2, height: 400, overflow: 'auto' }}>
						<Typography variant="h6" gutterBottom>今月の入出金</Typography>
						{monthlyTransactions.length > 0 ? (
              monthlyTransactions.map((t) => (
                <Box key={t.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid #eee' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">{t.transactionDate}</Typography>
                    <Typography variant="body1">{t.description} <Typography component="span" variant="caption" color="text.secondary">({t.category})</Typography></Typography>
                  </Box>
                  <Typography color={t.type === 'INCOME' ? 'primary' : 'error'} fontWeight="bold">
                    {t.type === 'INCOME' ? '+' : '-'}¥{Number(t.amount).toLocaleString()}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                この月のデータはありません。
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;