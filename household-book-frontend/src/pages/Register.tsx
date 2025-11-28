import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Avatar, Alert } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    try {
      await register(username, password);
      // 成功したらログイン画面へ
      navigate('/login'); 
      alert('登録が完了しました。ログインしてください。');
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 400) {
         setError('このユーザー名は既に使用されています。');
      } else {
         setError('登録処理に失敗しました。');
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <PersonAddIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          新規アカウント登録
        </Typography>
        <Paper elevation={3} sx={{ p: 4, mt: 2, width: '100%', borderRadius: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
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
            <TextField
              margin="normal"
              required
              fullWidth
              label="パスワード（確認）"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              登録
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
                すでにアカウントをお持ちの方
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;