import React from 'react';
import { Container, Typography, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Paper, Divider, Box } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CategoryIcon from '@mui/icons-material/Category';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import InfoIcon from '@mui/icons-material/Info';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Settings: React.FC = () => {
	const handleItemClick = (setting: string) => {
		console.log(`${setting} settings clicked`);
		// TODO: 各設定画面への遷移やモーダル表示などのロジックを実装
	};

	return (
		<Container maxWidth="md">
			<Paper elevation={3} sx={{ p: 4, mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				<Typography component="h1" variant="h4" gutterBottom>
					設定
				</Typography>

				<Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>

					<List component="nav" aria-label="設定メニュー">
						<ListItem disablePadding>
							<ListItemButton onClick={() => handleItemClick('アカウント')}>
								<ListItemIcon>
									<AccountCircleIcon />
								</ListItemIcon>
								<ListItemText primary="アカウント設定" secondary="ユーザー名、パスワード、アカウント削除" />
							</ListItemButton>
						</ListItem>

						<Divider />

						<ListItem disablePadding>
							<ListItemButton onClick={() => handleItemClick('カテゴリ')}>
								<ListItemIcon>
									<CategoryIcon />
								</ListItemIcon>
								<ListItemText primary="カテゴリ管理" secondary="カテゴリの追加、編集、削除" />
							</ListItemButton>
						</ListItem>

						<Divider />

						<ListItem disablePadding>
							<ListItemButton onClick={() => handleItemClick('通知')}>
								<ListItemIcon>
									<NotificationsIcon />
								</ListItemIcon>
								<ListItemText primary="通知設定" secondary="リマインダー通知のオン/オフ" />
							</ListItemButton>
						</ListItem>

						<Divider />

						<ListItem disablePadding>
							<ListItemButton onClick={() => handleItemClick('データ')}>
								<ListItemIcon>
									<DataUsageIcon />
								</ListItemIcon>
								<ListItemText primary="データ管理" secondary="データのインポート、エクスポート" />
							</ListItemButton>
						</ListItem>

						<Divider />

						<ListItem disablePadding>
							<ListItemButton onClick={() => handleItemClick('情報')}>
								<ListItemIcon>
									<InfoIcon />
								</ListItemIcon>
								<ListItemText primary="アプリ情報" secondary="バージョン情報、プライバシーポリシーなど" />
							</ListItemButton>
						</ListItem>

						<Divider />

						<ListItem disablePadding>
							<ListItemButton onClick={() => handleItemClick('ログアウト')}>
								<ListItemIcon>
									<ExitToAppIcon color="error" />
								</ListItemIcon>
								<ListItemText primary="ログアウト" />
							</ListItemButton>
						</ListItem>

					</List>
				</Box>
			</Paper>
		</Container>
	);
};

export default Settings;