import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMsg(null);
    setError(null);

    try {
      await authApi.forgotPassword(email);
      setMsg('パスワード再設定用のリンクをメールで送信しました。');
    } catch (err) {
      setError('リクエストの送信に失敗しました。');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">パスワードの再設定</Typography>
        <Paper elevation={3} sx={{ p: 4, mt: 2, width: '100%' }}>
          {msg && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          {!msg && (
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Typography variant="body2" sx={{ mb: 2 }}>
                登録済みのメールアドレスを入力してください。再設定用のリンクをお送りします。
              </Typography>
              <TextField
                required fullWidth label="メールアドレス" type="email"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                送信
              </Button>
              <Button fullWidth onClick={() => navigate('/login')}>キャンセル</Button>
            </Box>
          )}
          {msg && (
             <Button fullWidth variant="outlined" onClick={() => navigate('/login')}>ログイン画面へ</Button>
          )}
        </Paper>
      </Box>
    </Container>
  );
};
export default ForgotPassword;