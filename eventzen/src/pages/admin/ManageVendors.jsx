import { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Button, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, CircularProgress, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, MenuItem,
} from '@mui/material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { createVendor, getVendors, updateVendor, deleteVendor } from '../../api/api';
import { useApp } from '../../context/AppContext';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import StorefrontIcon from '@mui/icons-material/Storefront';

const EMPTY_FORM = { name: '', serviceType: '' };

/**
 * Administrative interface enabling managers to register and map third-party 
 * service providers (e.g. catering, AV equipment) directly to distinct hosting venues.
 */
export default function ManageVendors() {
  const { venues } = useApp();
  const [selectedVenueId, setSelectedVenueId] = useState('');
  const [vendors, setVendors]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [open, setOpen]         = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchVendors = async (venueId) => {
    if (!venueId) return;
    setLoading(true);
    try {
      const res = await getVendors(venueId);
      setVendors(res.data);
    } catch { toast.error('Failed to load vendors'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (selectedVenueId) fetchVendors(selectedVenueId);
    else setVendors([]);
  }, [selectedVenueId]);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setOpen(true); };
  const openEdit   = (v) => { setEditing(v); setForm({ name: v.name || '', serviceType: v.serviceType || '' }); setOpen(true); };

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Vendor name is required');
    if (!selectedVenueId)  return toast.error('Select a venue first');
    setSaving(true);
    try {
      if (editing) {
        await updateVendor(editing.id, form, selectedVenueId);
        toast.success('Vendor updated');
      } else {
        await createVendor(selectedVenueId, form);
        toast.success('Vendor created');
      }
      await fetchVendors(selectedVenueId);
      setOpen(false);
    } catch (e) { toast.error(e.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await deleteVendor(deleteId);
      toast.success('Vendor deleted');
      await fetchVendors(selectedVenueId);
    } catch (e) { toast.error(e.response?.data?.message || 'Delete failed'); }
    finally { setDeleteId(null); }
  };

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Typography sx={{ fontFamily: 'Syne', fontWeight: 800, fontSize: { xs: '2rem', md: '2.4rem' }, color: '#111827', letterSpacing: '-0.03em' }}>
              Manage Vendors
            </Typography>
            <Typography sx={{ fontFamily: 'Outfit', color: '#6B7280' }}>
              Select a venue to view and manage its vendors
            </Typography>
          </motion.div>
          <Button onClick={openCreate} variant="contained" startIcon={<AddIcon />} disabled={!selectedVenueId}
            sx={{ fontFamily: 'Outfit', fontWeight: 600, textTransform: 'none', borderRadius: '10px', mt: 0.5, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 4px 14px rgba(99,102,241,0.3)', '&:hover': { transform: 'translateY(-1px)' }, transition: 'all 0.2s', '&:disabled': { background: '#E5E7EB' } }}>
            Add Vendor
          </Button>
        </Box>

        {}
        <Box sx={{ bgcolor: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', p: 2.5, mb: 4 }}>
          <TextField
            select fullWidth label="Select Venue"
            value={selectedVenueId}
            onChange={e => setSelectedVenueId(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { fontFamily: 'Outfit', borderRadius: '12px', '&.Mui-focused fieldset': { borderColor: '#6366F1' } }, '& label.Mui-focused': { color: '#6366F1' } }}
          >
            <MenuItem value="" sx={{ fontFamily: 'Outfit', color: '#9CA3AF' }}>— Choose a venue —</MenuItem>
            {venues.map(v => (
              <MenuItem key={v.id} value={v.id} sx={{ fontFamily: 'Outfit' }}>
                {v.name} {v.location ? `· ${v.location}` : ''}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {!selectedVenueId ? (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <StorefrontIcon sx={{ fontSize: 56, color: '#E5E7EB', mb: 2 }} />
              <Typography sx={{ fontFamily: 'Syne', fontWeight: 600, color: '#9CA3AF' }}>Select a venue to see its vendors</Typography>
            </Box>
          ) : loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: '#6366F1' }} /></Box>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                    {['ID', 'Name', 'Service Type', 'Actions'].map(h => (
                      <TableCell key={h} sx={{ fontFamily: 'Syne', fontWeight: 700, color: '#374151', fontSize: '0.78rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vendors.map(v => (
                    <TableRow key={v.id} sx={{ '&:hover': { bgcolor: '#F8FAFC' }, transition: 'background 0.2s' }}>
                      <TableCell sx={{ fontFamily: 'Outfit', color: '#9CA3AF', fontSize: '0.82rem' }}>#{v.id}</TableCell>
                      <TableCell sx={{ fontFamily: 'Outfit', fontWeight: 600, color: '#111827' }}>{v.name}</TableCell>
                      <TableCell sx={{ fontFamily: 'Outfit', color: '#4B5563' }}>{v.serviceType || '—'}</TableCell>
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
                  {vendors.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: 'center', py: 5, fontFamily: 'Outfit', color: '#9CA3AF' }}>
                        No vendors for this venue. Add one!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </motion.div>
      </Container>

      {}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
        <DialogTitle sx={{ fontFamily: 'Syne', fontWeight: 700 }}>{editing ? 'Edit Vendor' : 'Add Vendor'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField label="Vendor Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            sx={{ '& .MuiOutlinedInput-root': { fontFamily: 'Outfit', borderRadius: '10px', '&.Mui-focused fieldset': { borderColor: '#6366F1' } }, '& label.Mui-focused': { color: '#6366F1' } }} />
          <TextField label="Service Type" placeholder="e.g. Catering, AV, Decor"
            value={form.serviceType} onChange={e => setForm(f => ({ ...f, serviceType: e.target.value }))}
            sx={{ '& .MuiOutlinedInput-root': { fontFamily: 'Outfit', borderRadius: '10px', '&.Mui-focused fieldset': { borderColor: '#6366F1' } }, '& label.Mui-focused': { color: '#6366F1' } }} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setOpen(false)} sx={{ fontFamily: 'Outfit', textTransform: 'none', color: '#6B7280' }}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} variant="contained"
            sx={{ fontFamily: 'Outfit', fontWeight: 600, textTransform: 'none', borderRadius: '8px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
            {saving ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : (editing ? 'Save Changes' : 'Add Vendor')}
          </Button>
        </DialogActions>
      </Dialog>

      {}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}>
        <DialogTitle sx={{ fontFamily: 'Syne', fontWeight: 700 }}>Delete Vendor?</DialogTitle>
        <DialogContent><Typography sx={{ fontFamily: 'Outfit', color: '#4B5563' }}>This cannot be undone.</Typography></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ fontFamily: 'Outfit', textTransform: 'none', color: '#6B7280' }}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error" sx={{ fontFamily: 'Outfit', fontWeight: 600, textTransform: 'none', borderRadius: '8px' }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
