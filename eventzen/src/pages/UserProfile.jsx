import { useState, useEffect } from 'react';
import { Box, Typography, Container, TextField, Button, CircularProgress, Avatar, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getUserById, updateUser, deleteUser } from '../api/api';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PersonIcon from '@mui/icons-material/Person';

/**
 * Self-service configuration surface allowing the authenticated user to parse, 
 * modify, or completely sever their core identifying data.
 */
export default function UserProfile() {
  const { user, doLogout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    getUserById(userId)
      .then(r => { setProfile(r.data); setForm({ name: r.data.name || '', email: r.data.email || '', phone: r.data.phone || '' }); })
      .catch(() => toast.error('Failed to load profile'));
  }, [userId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUser(userId, form);
      toast.success('Profile updated!');
      setEditing(false);
      setProfile(p => ({ ...p, ...form }));
    } catch (e) { toast.error(e.response?.data?.message || 'Update failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(userId);
      await doLogout();
      navigate('/register');
      toast.info('Account deleted');
    } catch (e) { toast.error(e.response?.data?.message || 'Delete failed'); }
  };

  const getInitials = (name) => name?.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2) || '?';

  const inputSx = { '& .MuiOutlinedInput-root': { fontFamily: 'Outfit', borderRadius: '12px', '&:hover fieldset': { borderColor: '#6366F1' }, '&.Mui-focused fieldset': { borderColor: '#6366F1' } }, '& label.Mui-focused': { color: '#6366F1' } };

  if (!user) return (
    <Box sx={{ textAlign: 'center', py: 10 }}>
      <Typography sx={{ fontFamily: 'Syne', color: '#9CA3AF', fontSize: '1.2rem' }}>Please log in to view your profile.</Typography>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="sm">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

          {}
          <Box sx={{ bgcolor: '#fff', borderRadius: '20px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', overflow: 'hidden', mb: 3 }}>
            <Box sx={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{
                width: 72, height: 72, bgcolor: 'rgba(255,255,255,0.2)',
                fontFamily: 'Syne', fontWeight: 700, fontSize: '1.6rem', color: '#fff',
                border: '3px solid rgba(255,255,255,0.4)',
              }}>
                {profile ? getInitials(profile.name) : <PersonIcon sx={{ fontSize: 32 }} />}
              </Avatar>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.3rem', color: '#fff' }}>
                  {profile?.name || user?.name || 'User'}
                </Typography>
                <Typography sx={{ fontFamily: 'Outfit', color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>
                  {profile?.email || user?.email}
                </Typography>
              </Box>
            </Box>
          </Box>

          {}
          <Box sx={{ bgcolor: '#fff', borderRadius: '20px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography sx={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem', color: '#111827' }}>Profile Details</Typography>
              {!editing && (
                <Button startIcon={<EditIcon />} onClick={() => setEditing(true)}
                  sx={{ fontFamily: 'Outfit', textTransform: 'none', color: '#6366F1', fontWeight: 600, '&:hover': { bgcolor: 'rgba(99,102,241,0.06)' } }}>
                  Edit
                </Button>
              )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {[
                { key: 'name',  label: 'Full Name', type: 'text'  },
                { key: 'email', label: 'Email',     type: 'email' },
                { key: 'phone', label: 'Phone',     type: 'tel'   },
              ].map(({ key, label, type }) => (
                <TextField
                  key={key} label={label} type={type}
                  value={editing ? form[key] : (profile?.[key] || '')}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  disabled={!editing}
                  fullWidth sx={inputSx}
                />
              ))}

              {editing && (
                <Box sx={{ display: 'flex', gap: 2, pt: 1 }}>
                  <Button onClick={() => setEditing(false)} variant="outlined"
                    sx={{ flex: 1, fontFamily: 'Outfit', textTransform: 'none', borderColor: '#E5E7EB', color: '#6B7280', borderRadius: '10px', '&:hover': { borderColor: '#9CA3AF' } }}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving} variant="contained"
                    sx={{ flex: 1, fontFamily: 'Outfit', fontWeight: 600, textTransform: 'none', borderRadius: '10px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
                    {saving ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Save Changes'}
                  </Button>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button startIcon={<LogoutIcon />} onClick={doLogout} variant="outlined"
                sx={{ fontFamily: 'Outfit', textTransform: 'none', fontWeight: 600, flex: 1, borderRadius: '10px', borderColor: '#E5E7EB', color: '#6B7280', '&:hover': { borderColor: '#9CA3AF' } }}>
                Log Out
              </Button>
              <Button startIcon={<DeleteForeverIcon />} onClick={() => setDeleteOpen(true)} variant="outlined" color="error"
                sx={{ fontFamily: 'Outfit', textTransform: 'none', fontWeight: 600, flex: 1, borderRadius: '10px', '&:hover': { bgcolor: 'rgba(239,68,68,0.06)' } }}>
                Delete Account
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Container>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}>
        <DialogTitle sx={{ fontFamily: 'Syne', fontWeight: 700 }}>Delete Account?</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: 'Outfit', color: '#4B5563' }}>This will permanently delete your account and all your data. This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteOpen(false)} sx={{ fontFamily: 'Outfit', textTransform: 'none', color: '#6B7280' }}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error" sx={{ fontFamily: 'Outfit', fontWeight: 600, textTransform: 'none', borderRadius: '8px' }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
