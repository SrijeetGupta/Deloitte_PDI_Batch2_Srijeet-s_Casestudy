import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Typography, Container, Button, TextField, CircularProgress,
  IconButton, Avatar, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getAttendees, addAttendee, deleteAttendee } from '../api/api';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PeopleIcon from '@mui/icons-material/People';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

// Shared palette to distinguish list demographics
const AVATAR_COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];

// Extrapolates short avatar names from full texts
const getInitials = (name) => name?.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2) || '?';

/**
 * Dedicated profile view orchestrating the enumeration, addition, and revocation
 * of physical attendees constrained to a single booking entity.
 */
export default function AttendeePage() {
  const { bookingId } = useParams();
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading]   = useState(true);
  
  // State directing the manual guest addition modal
  const [addOpen, setAddOpen]   = useState(false);
  const [form, setForm]         = useState({ name: '', email: '', phone: '' });
  const [saving, setSaving]     = useState(false);
  
  // State directing impending targeted deletion sweeps
  const [deleteId, setDeleteId] = useState(null);

  /**
   * Evaluates and updates the entire guestlist against remote states.
   */
  const fetchAttendees = async () => {
    setLoading(true);
    try {
      const res = await getAttendees(bookingId); 
      setAttendees(res.data);
    } catch { toast.error('Failed to load attendees'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAttendees(); }, [bookingId]);

  /**
   * Pushes a new guest block upstream and validates completion.
   */
  const handleAdd = async () => {
    if (!form.name.trim()) return toast.error('Name is required');
    setSaving(true);
    try {
      await addAttendee(bookingId, form); 
      await fetchAttendees();
      toast.success('Attendee added!');
      setForm({ name: '', email: '', phone: '' });
      setAddOpen(false);
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to add attendee'); }
    finally { setSaving(false); }
  };

  /**
   * Exises an identified individual from the booking scope.
   */
  const handleDelete = async () => {
    try {
      await deleteAttendee(deleteId); 
      await fetchAttendees();
      toast.success('Attendee removed');
    } catch { toast.error('Failed to remove attendee'); }
    finally { setDeleteId(null); }
  };

  // Reusable styling parameters mapped onto MUI Inputs
  const inputSx = { '& .MuiOutlinedInput-root': { fontFamily: 'Outfit', borderRadius: '10px', '&.Mui-focused fieldset': { borderColor: '#6366F1' } }, '& label.Mui-focused': { color: '#6366F1' } };

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        {/* Dynamic header describing ownership count */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Typography sx={{ fontFamily: 'Syne', fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.2rem' }, color: '#111827', letterSpacing: '-0.03em', mb: 0.5 }}>
              Attendees
            </Typography>
            <Typography sx={{ fontFamily: 'Outfit', color: '#6B7280' }}>
              Booking #{bookingId} · {attendees.length} attendee{attendees.length !== 1 ? 's' : ''}
            </Typography>
          </motion.div>
          <Button onClick={() => setAddOpen(true)} variant="contained" startIcon={<PersonAddIcon />}
            sx={{ fontFamily: 'Outfit', fontWeight: 600, textTransform: 'none', borderRadius: '10px', mt: 0.5, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 4px 14px rgba(99,102,241,0.3)', '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(99,102,241,0.4)' }, transition: 'all 0.2s' }}>
            Add Attendee
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: '#6366F1' }} /></Box>
        ) : attendees.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <PeopleIcon sx={{ fontSize: 56, color: '#E5E7EB', mb: 2 }} />
            <Typography sx={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '1.1rem', color: '#9CA3AF' }}>No attendees yet</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <AnimatePresence>
              {attendees.map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                  <Box sx={{ bgcolor: '#fff', borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', p: 2, display: 'flex', alignItems: 'center', gap: 2, '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }, transition: 'box-shadow 0.2s' }}>
                    <Avatar sx={{ bgcolor: AVATAR_COLORS[i % AVATAR_COLORS.length], fontFamily: 'Syne', fontWeight: 700, fontSize: '0.85rem' }}>
                      {getInitials(a.name)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: '0.95rem', color: '#111827' }}>{a.name}</Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 0.3 }}>
                        {a.email && <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}><EmailIcon sx={{ fontSize: 12, color: '#9CA3AF' }} /><Typography sx={{ fontFamily: 'Outfit', fontSize: '0.78rem', color: '#6B7280' }}>{a.email}</Typography></Box>}
                        {a.phone && <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}><PhoneIcon sx={{ fontSize: 12, color: '#9CA3AF' }} /><Typography sx={{ fontFamily: 'Outfit', fontSize: '0.78rem', color: '#6B7280' }}>{a.phone}</Typography></Box>}
                      </Box>
                    </Box>
                    <IconButton onClick={() => setDeleteId(a.id)} size="small" sx={{ color: '#EF4444', '&:hover': { bgcolor: 'rgba(239,68,68,0.06)' } }}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>
        )}
      </Container>

      {/* Internal Guest Registration Modal Fragment */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
        <DialogTitle sx={{ fontFamily: 'Syne', fontWeight: 700 }}>Add Attendee</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          {[{ key: 'name', label: 'Full Name *', type: 'text' }, { key: 'email', label: 'Email', type: 'email' }, { key: 'phone', label: 'Phone', type: 'tel' }].map(({ key, label, type }) => (
            <TextField key={key} label={label} type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} sx={inputSx} />
          ))}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAddOpen(false)} sx={{ fontFamily: 'Outfit', textTransform: 'none', color: '#6B7280' }}>Cancel</Button>
          <Button onClick={handleAdd} disabled={saving} variant="contained" sx={{ fontFamily: 'Outfit', fontWeight: 600, textTransform: 'none', borderRadius: '8px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
            {saving ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Internal Security/Deletion Dialogue Modal */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}>
        <DialogTitle sx={{ fontFamily: 'Syne', fontWeight: 700 }}>Remove Attendee?</DialogTitle>
        <DialogContent><Typography sx={{ fontFamily: 'Outfit', color: '#4B5563' }}>This will permanently remove this attendee.</Typography></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ fontFamily: 'Outfit', textTransform: 'none', color: '#6B7280' }}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error" sx={{ fontFamily: 'Outfit', fontWeight: 600, textTransform: 'none', borderRadius: '8px' }}>Remove</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
