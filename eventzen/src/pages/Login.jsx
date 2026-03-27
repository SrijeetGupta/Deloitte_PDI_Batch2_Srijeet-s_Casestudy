import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, CircularProgress,
  InputAdornment, IconButton, Container,
} from '@mui/material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import BoltIcon from '@mui/icons-material/Bolt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

/**
 * Access gateway responsible for collecting existing user credentials and 
 * initiating secure session persistence.
 */
export default function Login() {
  const navigate = useNavigate();
  const { doLogin } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('All fields are required');
    setLoading(true);
    try {
      await doLogin(form);
      toast.success('Welcome back! 👋');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      fontFamily: 'Outfit', borderRadius: '12px', bgcolor: '#F8FAFC',
      '&:hover fieldset': { borderColor: '#6366F1' },
      '&.Mui-focused fieldset': { borderColor: '#6366F1' },
    },
    '& label.Mui-focused': { color: '#6366F1' },
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {}
      <Box sx={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: -100, left: -80, width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <Container maxWidth="xs" sx={{ position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box sx={{
              width: 52, height: 52, borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(99,102,241,0.45)',
            }}>
              <BoltIcon sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
          </Box>

          <Box sx={{ bgcolor: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', p: 4 }}>
            <Typography sx={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.7rem', color: '#F8FAFC', textAlign: 'center', mb: 0.5, letterSpacing: '-0.02em' }}>
              Welcome back
            </Typography>
            <Typography sx={{ fontFamily: 'Outfit', color: '#94A3B8', textAlign: 'center', mb: 3, fontSize: '0.9rem' }}>
              Sign in to your EventZen account
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                fullWidth
                sx={{
                  ...inputSx,
                  '& .MuiInputLabel-root': { color: '#94A3B8' },
                  '& .MuiOutlinedInput-root': { ...inputSx['& .MuiOutlinedInput-root'], bgcolor: 'rgba(255,255,255,0.05)', '& input': { color: '#F8FAFC' } },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.12)' },
                }}
              />
              <TextField
                label="Password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPass(p => !p)} sx={{ color: '#94A3B8' }}>
                        {showPass ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  ...inputSx,
                  '& .MuiInputLabel-root': { color: '#94A3B8' },
                  '& .MuiOutlinedInput-root': { ...inputSx['& .MuiOutlinedInput-root'], bgcolor: 'rgba(255,255,255,0.05)', '& input': { color: '#F8FAFC' } },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.12)' },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 1, fontFamily: 'Outfit', fontWeight: 700, textTransform: 'none',
                  fontSize: '1rem', borderRadius: '12px', py: 1.4,
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  boxShadow: '0 6px 20px rgba(99,102,241,0.4)',
                  '&:hover': { boxShadow: '0 8px 28px rgba(99,102,241,0.55)', transform: 'translateY(-1px)' },
                  '&:disabled': { background: '#374151', boxShadow: 'none' },
                  transition: 'all 0.2s',
                }}
              >
                {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Sign In'}
              </Button>
            </Box>

            <Typography sx={{ fontFamily: 'Outfit', textAlign: 'center', mt: 3, color: '#64748B', fontSize: '0.88rem' }}>
              Don't have an account?{' '}
              <Box component={Link} to="/register" sx={{ color: '#818CF8', fontWeight: 600, textDecoration: 'none', '&:hover': { color: '#A5B4FC' } }}>
                Register
              </Box>
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
