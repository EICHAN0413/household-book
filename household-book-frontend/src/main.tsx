import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'; // CSSベースライン

// カスタムテーマの定義 (任意、デフォルトでもOK)
const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // 例: 緑色をプライマリカラーに
    },
    secondary: {
      main: '#FFC107', // 例: アンバー色をセカンダリカラーに
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* CSSベースラインを適用してブラウザ間の差異を吸収 */}
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
