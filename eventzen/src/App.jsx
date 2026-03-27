import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { AppProvider }  from './context/AppContext';
import Navbar    from './components/Navbar';
import Footer    from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import { useLocation } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary:    { main: '#6366F1' },
    secondary:  { main: '#8B5CF6' },
    background: { default: '#F8FAFC' },
  },
  typography: { fontFamily: 'Outfit, sans-serif' },
  components: {
    MuiButton:    { styleOverrides: { root: { fontFamily: 'Outfit, sans-serif' } } },
    MuiTextField: { styleOverrides: { root: { fontFamily: 'Outfit, sans-serif' } } },
    MuiMenuItem:  { styleOverrides: { root: { fontFamily: 'Outfit, sans-serif' } } },
  },
  shape: { borderRadius: 10 },
});


const HIDE_FOOTER = ['/login', '/register'];

/**
 * Structural shell component orchestrating standard application chrome 
 * (Navigation, Content Area, Footer) around active routing views.
 */
function Layout() {
  const location = useLocation();
  const hideFooter = HIDE_FOOTER.includes(location.pathname);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <AppRoutes />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

/**
 * Root application component responsible for initializing global providers 
 * (Theme, Router, Auth, App State) and the notification system.
 */
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <Layout />
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>

      <ToastContainer
        position="bottom-right"
        autoClose={3200}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        toastStyle={{
          fontFamily: 'Outfit, sans-serif',
          borderRadius: '12px',
          fontSize: '0.9rem',
        }}
      />
    </ThemeProvider>
  );
}
