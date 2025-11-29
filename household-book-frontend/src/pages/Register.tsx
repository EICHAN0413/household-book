import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Avatar, Alert } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios'; // 型判定のために追加

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({}); // エラーリセット
    setGlobalError(null);
    setSuccessMsg(null);

    // フロントエンドでの簡易チェック
    let hasError = false;
    const newErrors: Record<string, string> = {};

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'パスワードが一致しません';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      await register(username, password, email);
      setSuccessMsg('登録を受け付けました。届いたメール内のリンクをクリックしてアカウントを有効化してください。');
      
    } catch (err: any) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.status === 400 && err.response.data) {
        // データがオブジェクト形式（Map）の場合
        if (typeof err.response.data === 'object') {
          setErrors(err.response.data);
        } else {
          setGlobalError('入力内容に誤りがあります。');
        }
      } else {
         setGlobalError('登録処理に失敗しました。サーバーエラーの可能性があります。');
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
          
          {/* 全体エラーがあれば表示 */}
          {globalError && <Alert severity="error" sx={{ mb: 2 }}>{globalError}</Alert>}
          
          {successMsg ? (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMsg}
              </Alert>
              <Button fullWidth variant="outlined" onClick={() => navigate('/login')}>
                ログイン画面へ戻る
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                label="ユーザー名"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                // ▼▼▼ エラー表示の設定 ▼▼▼
                error={!!errors.username}     // エラーがあれば赤くする
                helperText={errors.username}  // エラーメッセージを表示
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                label="メールアドレス"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // ▼▼▼ エラー表示の設定 ▼▼▼
                error={!!errors.email}
                helperText={errors.email}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                label="パスワード"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // ▼▼▼ エラー表示の設定 ▼▼▼
                error={!!errors.password}
                helperText={errors.password}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                label="パスワード（確認）"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                // ▼▼▼ エラー表示の設定 ▼▼▼
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                登録してメールを送信
              </Button>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
                  すでにアカウントをお持ちの方
                </Link>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;