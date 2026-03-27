import { useState } from 'react';
import {
  Box, Typography, Container, Button, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, CircularProgress, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { createVenue, updateVenue, deleteVenue } from '../../api/api';
import { useApp } from '../../context/AppContext';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const EMPTY = { name: '', location: '', capacity: '', pricePerHour: '' };

/**
 * Master catalog administration allowing the addition, structural modification, 
 * or unlisting of physical hosting facilities available on the platform.
 */
export default function ManageVenues() {
  const { venues, fetchVenues } = useApp();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (v) => {
    setEditing(v);
    setForm({ name: v.name || '', location: v.location || '', capacity: v.capacity || '', pricePerHour: v.pricePerHour || '' });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Venue name is required');
    setSaving(true);
    try {
      const payload = { ...form, capacity: Number(form.capacity), pricePerHour: Number(form.pricePerHour) };
      if (editing) { await updateVenue(editing.id, payload); toast.success('Venue updated'); }
      else { await createVenue(payload); toast.success('Venue created'); }
      await fetchVenues();
      setOpen(false);
    } catch (e) { toast.error(e.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await deleteVenue(deleteId);
      await fetchVenues();
      toast.success('Venue deleted');
    } catch (e) { toast.error(e.response?.data?.message || 'Delete failed'); }
    finally { setDeleteId(null); }
  };

  const fields = [
    { key: 'name', label: 'Venue Name *', type: 'text' },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'capacity', label: 'Capacity', type: 'number' },
    { key: 'pricePerHour', label: 'Price Per Hour (₹)', type: 'number' },
  ];

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Typography sx={{ fontFamily: 'Syne', fontWeight: 800, fontSize: { xs: '2rem', md: '2.4rem' }, color: '#111827', letterSpacing: '-0.03em' }}>
              Manage Venues
            </Typography>
            <Typography sx={{ fontFamily: 'Outfit', color: '#6B7280' }}>{venues.length} venues total</Typography>
          </motion.div>
          <Button onClick={openCreate} variant="contained" startIcon={<AddIcon />}
            sx={{
              fontFamily: 'Outfit', fontWeight: 600, textTransform: 'none', borderRadius: '10px', mt: 0.5,
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
              '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(99,102,241,0.4)' },
              transition: 'all 0.2s',
            }}>
            New Venue
          </Button>
        </Box>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                  {['ID', 'Name', 'Location', 'Capacity', 'Price/hr', 'Actions'].map(h => (
                    <TableCell key={h} sx={{ fontFamily: 'Syne', fontWeight: 700, color: '#374151', fontSize: '0.82rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {venues.map(v => (
                  <TableRow key={v.id} sx={{ '&:hover': { bgcolor: '#F8FAFC' }, transition: 'background 0.2s' }}>
                    <TableCell sx={{ fontFamily: 'Outfit', color: '#9CA3AF', fontSize: '0.82rem' }}>#{v.id}</TableCell>
                    <TableCell sx={{ fontFamily: 'Outfit', fontWeight: 600, color: '#111827' }}>{v.name}</TableCell>
                    <TableCell sx={{ fontFamily: 'Outfit', color: '#4B5563', fontSize: '0.85rem' }}>{v.location || '—'}</TableCell>
                    <TableCell sx={{ fontFamily: 'Outfit', color: '#4B5563' }}>{v.capacity}</TableCell>
                    <TableCell sx={{ fontFamily: 'Outfit', color: '#4B5563' }}>{v.pricePerHour ? `₹${v.pricePerHour}` : '—'}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton onClick={() => openEdit(v)} size="small" sx={{ color: '#6366F1', '&:hover': { bgcolor: 'rgba(99,102,241,0.08)' } }}>
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => setDeleteId(v.id)} size="small" sx={{ color: '#EF4444', '&:hover': { bgcolor: 'rgba(239,68,68,0.08)' } }}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {venues.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 6, fontFamily: 'Outfit', color: '#9CA3AF' }}>
                      No venues yet. Create your first one!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>
      </Container>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
        <DialogTitle sx={{ fontFamily: 'Syne', fontWeight: 700 }}>{editing ? 'Edit Venue' : 'Create Venue'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          {fields.map(({ key, label, type }) => (
            <TextField key={key} label={label} type={type} value={form[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              sx={{ '& .MuiOutlinedInput-root': { fontFamily: 'Outfit', borderRadius: '10px', '&.Mui-focused fieldset': { borderColor: '#6366F1' } }, '& label.Mui-focused': { color: '#6366F1' } }}
            />
          ))}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setOpen(false)} sx={{ fontFamily: 'Outfit', textTransform: 'none', color: '#6B7280' }}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} variant="contained"
            sx={{ fontFamily: 'Outfit', fontWeight: 600, textTransform: 'none', borderRadius: '8px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
            {saving ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : (editing ? 'Save Changes' : 'Create Venue')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}>
        <DialogTitle sx={{ fontFamily: 'Syne', fontWeight: 700 }}>Delete Venue?</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: 'Outfit', color: '#4B5563' }}>This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ fontFamily: 'Outfit', textTransform: 'none', color: '#6B7280' }}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error"
            sx={{ fontFamily: 'Outfit', fontWeight: 600, textTransform: 'none', borderRadius: '8px' }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
