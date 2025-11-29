import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Alert } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../services/api';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // URLからトークン取得

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }
    if (!token) {
      setError('無効なリンクです');
      return;
    }

    try {
      await authApi.resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError('パスワードの再設定に失敗しました。リンクの有効期限が切れている可能性があります。');
    }
  };

  if (!token) return <Alert severity="error">無効なリンクです。</Alert>;

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">新しいパスワードの設定</Typography>
        <Paper elevation={3} sx={{ p: 4, mt: 2, width: '100%' }}>
          
          {success ? (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>パスワードを変更しました。</Alert>
              <Button fullWidth variant="contained" onClick={() => navigate('/login')}>
                ログイン画面へ
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit} noValidate>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              
              <TextField
                margin="normal" required fullWidth label="新しいパスワード" type="password"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                margin="normal" required fullWidth label="新しいパスワード（確認）" type="password"
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                パスワードを変更
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};
export default ResetPassword;