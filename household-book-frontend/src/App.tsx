import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'; // CssBaselineを追加
import Home from './pages/Home';
import ExpenseList from './pages/TransactionList';
import ExpenseForm from './pages/TransactionForm';
import Settings from './pages/Settings';
import Login from './pages/Login';

function App() {
	return (
		<Router>
			<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

				{/* 上部バー */}
				<AppBar position="static">
					<Toolbar>
						<Typography variant="h6" sx={{ flexGrow: 1 }}>
							家計簿アプリ
						</Typography>
						{/* リンクボタン */}
						<Button color="inherit" component={Link} to="/home">ホーム</Button>
						<Button color="inherit" component={Link} to="/transactionList">一覧</Button>
						<Button color="inherit" component={Link} to="/add-transaction">入力</Button>
						<Button color="inherit" component={Link} to="/settings">設定</Button>
						<Button color="inherit" component={Link} to="/login">ログイン</Button>
					</Toolbar>
				</AppBar>

				{/* コンテンツ領域 */}
				<Box
					component="main"
					sx={{
						flexGrow: 1,
						width: '100%',
						bgcolor: '#f7f7f7',
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/home" element={<Home />} />
						<Route path="/transactionList" element={<ExpenseList />} />
						<Route path="/add-transaction" element={<ExpenseForm />} />
						<Route path="/edit-transaction/:id" element={<ExpenseForm />} />
						<Route path="/settings" element={<Settings />} />
						<Route path="/login" element={<Login />} />
					</Routes>
				</Box>
			</Box>
		</Router>
	);
}

export default App;