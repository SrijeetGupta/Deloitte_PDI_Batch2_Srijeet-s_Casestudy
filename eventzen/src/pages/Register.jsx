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
 * Onboarding portal collecting novel user identifying information and registering 
 * a fresh entity within the system's identity management array.
 */
export default function Register() {
  const navigate = useNavigate();
  const { doRegister } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const setField = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Name, email and password are required');
    
    // Password validation
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters');
    if (!/(?=.*[a-z])/.test(form.password)) return toast.error('Password must contain a lowercase letter');
    if (!/(?=.*[A-Z])/.test(form.password)) return toast.error('Password must contain an uppercase letter');
    if (!/(?=.*\d)/.test(form.password)) return toast.error('Password must contain a number');
    if (!/(?=.*[@$!%*?&])/.test(form.password)) return toast.error('Password must contain a special character (@$!%*?&)');

    setLoading(true);
    try {
      await doRegister(form);
      toast.success('Account created! Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const darkInput = {
    '& .MuiInputLabel-root': { color: '#94A3B8' },
    '& .MuiOutlinedInput-root': {
      fontFamily: 'Outfit', borderRadius: '12px',
      bgcolor: 'rgba(255,255,255,0.05)',
      '& input': { color: '#F8FAFC' },
      '&:hover fieldset': { borderColor: '#6366F1' },
      '&.Mui-focused fieldset': { borderColor: '#6366F1' },
    },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.12)' },
    '& label.Mui-focused': { color: '#818CF8' },
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      <Box sx={{ position: 'absolute', top: -120, right: -80, width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: -80, left: -80, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <Container maxWidth="xs" sx={{ position: 'relative' }}>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
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
              Create account
            </Typography>
            <Typography sx={{ fontFamily: 'Outfit', color: '#94A3B8', textAlign: 'center', mb: 3, fontSize: '0.9rem' }}>
              Join EventZen and start booking today
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { key: 'name',  label: 'Full Name',    type: 'text'  },
                { key: 'email', label: 'Email',        type: 'email' },
                { key: 'phone', label: 'Phone (optional)', type: 'tel' },
              ].map(({ key, label, type }) => (
                <TextField key={key} label={label} type={type} value={form[key]} onChange={setField(key)} fullWidth sx={darkInput} />
              ))}

              <TextField
                label="Password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={setField('password')}
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
                sx={darkInput}
              />

              <Button
                type="submit" fullWidth variant="contained" disabled={loading}
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
                {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Create Account'}
              </Button>
            </Box>

            <Typography sx={{ fontFamily: 'Outfit', textAlign: 'center', mt: 3, color: '#64748B', fontSize: '0.88rem' }}>
              Already have an account?{' '}
              <Box component={Link} to="/login" sx={{ color: '#818CF8', fontWeight: 600, textDecoration: 'none', '&:hover': { color: '#A5B4FC' } }}>
                Sign in
              </Box>
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
