import { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Button, CircularProgress, MenuItem, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getAvailability, updateAvailability } from '../../api/api';
import { useApp } from '../../context/AppContext';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';

const STATUS_OPTIONS = ['AVAILABLE', 'BOOKED', 'MAINTENANCE'];
const STATUS_COLORS  = {
  AVAILABLE:   { bg: '#D1FAE5', color: '#059669' },
  BOOKED:      { bg: '#FEE2E2', color: '#DC2626' },
  MAINTENANCE: { bg: '#FEF3C7', color: '#D97706' },
};

/**
 * Configuration matrix for defining or overriding the open time slots 
 * attributed to specified hosting venues.
 */
export default function ManageAvailability() {
  const { venues } = useApp();
  const [venueId, setVenueId]       = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [availability, setAvail]    = useState([]);
  const [loading, setLoading]       = useState(false);
  const [editOpen, setEditOpen]     = useState(false);
  const [editRow, setEditRow]       = useState(null); 
  const [newStatus, setNewStatus]   = useState('');
  const [saving, setSaving]         = useState(false);

  const fetchAvail = async () => {
    if (!venueId) return;
    setLoading(true);
    try {
      const res = await getAvailability(venueId, dateFilter || undefined);
      setAvail(Array.isArray(res.data) ? res.data : [res.data]);
    } catch { toast.error('Could not load availability'); setAvail([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (venueId) fetchAvail(); else setAvail([]); }, [venueId]);

  const openEdit = (row) => { setEditRow(row); setNewStatus(row.status || 'AVAILABLE'); setEditOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAvailability(venueId, editRow.date, newStatus);
      toast.success('Availability updated');
      await fetchAvail();
      setEditOpen(false);
    } catch (e) { toast.error(e.response?.data?.message || 'Update failed'); }
    finally { setSaving(false); }
  };

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Typography sx={{ fontFamily: 'Syne', fontWeight: 800, fontSize: { xs: '2rem', md: '2.4rem' }, color: '#111827', letterSpacing: '-0.03em', mb: 0.5 }}>
            Venue Availability
          </Typography>
          <Typography sx={{ fontFamily: 'Outfit', color: '#6B7280', mb: 4 }}>
            View and update availability slots for any venue
          </Typography>
        </motion.div>

        {}
        <Box sx={{ bgcolor: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', p: 2.5, mb: 4 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <TextField select label="Select Venue" value={venueId} onChange={e => setVenueId(e.target.value)} sx={{ flex: '1 1 200px', '& .MuiOutlinedInput-root': { fontFamily: 'Outfit', borderRadius: '10px', '&.Mui-focused fieldset': { borderColor: '#6366F1' } } }}>
              <MenuItem value="" sx={{ fontFamily: 'Outfit', color: '#9CA3AF' }}>— Choose venue —</MenuItem>
              {venues.map(v => <MenuItem key={v.id} value={v.id} sx={{ fontFamily: 'Outfit' }}>{v.name}</MenuItem>)}
            </TextField>
            <TextField label="Filter by Date" type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ flex: '1 1 160px', '& .MuiOutlinedInput-root': { fontFamily: 'Outfit', borderRadius: '10px', '&.Mui-focused fieldset': { borderColor: '#6366F1' } } }} />
            <Button onClick={fetchAvail} disabled={!venueId} variant="contained"
              sx={{ fontFamily: 'Outfit', fontWeight: 600, textTransform: 'none', borderRadius: '10px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', '&:disabled': { background: '#E5E7EB' } }}>
              Load
            </Button>
          </Box>
        </Box>

        {!venueId ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <EventAvailableIcon sx={{ fontSize: 56, color: '#E5E7EB', mb: 2 }} />
            <Typography sx={{ fontFamily: 'Syne', fontWeight: 600, color: '#9CA3AF' }}>Select a venue above to see availability</Typography>
          </Box>
        ) : loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: '#6366F1' }} /></Box>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                  {['Date', 'Status', 'Actions'].map(h => (
                    <TableCell key={h} sx={{ fontFamily: 'Syne', fontWeight: 700, color: '#374151', fontSize: '0.78rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {availability.map((a, i) => {
                  const sc = STATUS_COLORS[a.status] || STATUS_COLORS.AVAILABLE;
                  return (
                    <TableRow key={i} sx={{ '&:hover': { bgcolor: '#F8FAFC' } }}>
                      <TableCell sx={{ fontFamily: 'Outfit', color: '#374151' }}>
                        {a.date ? new Date(a.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </TableCell>
                      <TableCell>
                        <Chip label={a.status || 'AVAILABLE'} size="small" sx={{ bgcolor: sc.bg, color: sc.color, fontFamily: 'Outfit', fontWeight: 600, fontSize: '0.72rem' }} />
                      </TableCell>
                      <TableCell>
                        <Button size="small" startIcon={<EditCalendarIcon fontSize="small" />} onClick={() => openEdit(a)}
                          sx={{ fontFamily: 'Outfit', textTransform: 'none', fontWeight: 600, color: '#6366F1', '&:hover': { bgcolor: 'rgba(99,102,241,0.06)' }, borderRadius: '8px' }}>
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {availability.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} sx={{ textAlign: 'center', py: 5, fontFamily: 'Outfit', color: '#9CA3AF' }}>
                      No availability records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>

      {}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '18px', p: 1 } }}>
        <DialogTitle sx={{ fontFamily: 'Syne', fontWeight: 700 }}>Update Availability</DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          <Typography sx={{ fontFamily: 'Outfit', color: '#6B7280', fontSize: '0.85rem', mb: 2 }}>
            Date: <strong style={{ color: '#111827' }}>
              {editRow?.date ? new Date(editRow.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—'}
            </strong>
          </Typography>
          <TextField select fullWidth label="Status" value={newStatus} onChange={e => setNewStatus(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { fontFamily: 'Outfit', borderRadius: '10px', '&.Mui-focused fieldset': { borderColor: '#6366F1' } }, '& label.Mui-focused': { color: '#6366F1' } }}>
            {STATUS_OPTIONS.map(s => <MenuItem key={s} value={s} sx={{ fontFamily: 'Outfit' }}>{s}</MenuItem>)}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setEditOpen(false)} sx={{ fontFamily: 'Outfit', textTransform: 'none', color: '#6B7280' }}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} variant="contained"
            sx={{ fontFamily: 'Outfit', fontWeight: 600, textTransform: 'none', borderRadius: '8px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
            {saving ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
