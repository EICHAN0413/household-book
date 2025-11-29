import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, CssBaseline, CircularProgress } from '@mui/material';
import Home from './pages/Home';
import TransactionList from './pages/TransactionList';
import TransactionForm from './pages/TransactionForm';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { isAuthenticated, isLoading } = useAuth();
	const location = useLocation();
  
	if (isLoading) {
	  return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
	}
  
	if (!isAuthenticated) {
	  return <Navigate to="/login" state={{ from: location }} replace />;
	}
  
	return <>{children}</>; // ReactNodeの場合、フラグメント <>...</> で囲むのが安全です
  };

  const PublicOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { isAuthenticated, isLoading } = useAuth();
  
	// 認証チェック中はローディングを表示（チラつき防止）
	if (isLoading) {
	  return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
	}
  
	// ログイン済みならホームへ飛ばす
	if (isAuthenticated) {
	  return <Navigate to="/" replace />;
	}
  
	// 未ログインならそのまま表示
	return <>{children}</>;
  };

// ナビゲーションバー
const NavBar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate(); // useNavigateを使うためにコンポーネント内に配置

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }} component={Link} to="/home">
          家計簿アプリ
        </Typography>
        {isAuthenticated ? (
          <>
            <Button color="inherit" component={Link} to="/home">ホーム</Button>
            <Button color="inherit" component={Link} to="/transactionList">一覧</Button>
            <Button color="inherit" component={Link} to="/add-transaction">入力</Button>
            <Button color="inherit" component={Link} to="/settings">設定</Button>
            <Button color="inherit" onClick={handleLogout}>ログアウト</Button>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/login">ログイン</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

function AppContent() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f7f7f7', pb: 4 }}>
        <Routes>
          {/* 公開ルート */}
          <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
          <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
          <Route path="/forgot-password" element={<PublicOnly><ForgotPassword /></PublicOnly>} />
          <Route path="/reset-password" element={<PublicOnly><ResetPassword /></PublicOnly>} />
          

          {/* 保護されたルート  */}
          <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/transactionList" element={<RequireAuth><TransactionList /></RequireAuth>} />
          <Route path="/add-transaction" element={<RequireAuth><TransactionForm /></RequireAuth>} />
          <Route path="/edit-transaction/:id" element={<RequireAuth><TransactionForm /></RequireAuth>} />
          <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
        </Routes>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <CssBaseline />
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;