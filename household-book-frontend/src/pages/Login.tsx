import React from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login: React.FC = () => {
	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		console.log('Login attempt');
		// TODO: 認証ロジック
	};

	return (
		<Container maxWidth="md">
			<Box
				sx={{
					flexGrow: 1,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					py: 4,
					mt: 1,
				}}
			>
				<Container component="main" maxWidth="xs">
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
							<LockOutlinedIcon />
						</Avatar>
						<Typography component="h1" variant="h5" gutterBottom>
							ログイン
						</Typography>

						<Paper
							elevation={3}
							sx={{
								p: 4,
								width: '100%',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								borderRadius: 2
							}}
						>
							<Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
								<TextField
									margin="normal"
									required
									fullWidth
									id="email"
									label="メールアドレス"
									name="email"
									autoComplete="email"
									autoFocus
									variant="outlined"
								/>
								<TextField
									margin="normal"
									required
									fullWidth
									name="password"
									label="パスワード"
									type="password"
									id="password"
									autoComplete="current-password"
									variant="outlined"
								/>
								<Button
									type="submit"
									fullWidth
									variant="contained"
									sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
								>
									ログイン
								</Button>
								<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
									<Typography variant="body2" color="primary" sx={{ cursor: 'pointer', textDecoration: 'underline' }}>
										アカウント作成
									</Typography>
								</Box>
							</Box>
						</Paper>
					</Box>
				</Container>
			</Box>
		</Container>
	);
};

export default Login;