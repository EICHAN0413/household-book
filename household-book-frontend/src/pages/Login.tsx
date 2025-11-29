import React, { useState, useEffect } from 'react'; 
import { TextField, Button, Container, Typography, Box, Paper, Avatar, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verified = searchParams.get('verified');
    const errParam = searchParams.get('error');

    if (verified === 'true') {
      setSuccessMsg('メール認証が完了しました。ログインしてください。');
    } else if (errParam === 'expired') {
      setError('認証リンクの有効期限が切れています。再度登録を行ってください。');
    } else if (errParam === 'invalid_token') {
      setError('無効な認証リンクです。');
    }
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMsg(null);

    try {
      await login(username, password);
      navigate('/'); 
    } catch (err) {
      console.error(err);
      setError('ログインに失敗しました。ユーザー名かパスワードが間違っています。');
    }
  };

	return (
		<Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          ログイン
        </Typography>
        <Paper elevation={3} sx={{ p: 4, mt: 2, width: '100%', borderRadius: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              label="ユーザー名"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="パスワード"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              ログイン
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, width: '100%' }}>
  <Link to="/forgot-password" style={{ textDecoration: 'none', color: '#1976d2', fontSize: '0.875rem' }}>
    パスワードを忘れた方
  </Link>
  <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2', fontSize: '0.875rem' }}>
    アカウント作成
  </Link>
</Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;