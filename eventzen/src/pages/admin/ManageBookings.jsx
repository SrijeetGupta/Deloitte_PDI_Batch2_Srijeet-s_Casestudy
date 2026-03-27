import { useState, useEffect } from 'react';
import {
  Box, Typography, Container, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, CircularProgress, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, Tooltip,
} from '@mui/material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { approveBooking, rejectBooking, cancelBooking } from '../../api/api';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import BlockIcon from '@mui/icons-material/Block';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import RefreshIcon from '@mui/icons-material/Refresh';

const STATUS_CONFIG = {
  CONFIRMED: { label: 'Confirmed', color: '#059669', bg: '#D1FAE5' },
  APPROVED:  { label: 'Approved',  color: '#059669', bg: '#D1FAE5' },
  PENDING:   { label: 'Pending',   color: '#D97706', bg: '#FEF3C7' },
  CANCELLED: { label: 'Cancelled', color: '#DC2626', bg: '#FEE2E2' },
  REJECTED:  { label: 'Rejected',  color: '#DC2626', bg: '#FEE2E2' },
};

/**
 * Higher-level moderation table providing privileged operators the ability to 
 * audit, approve, reject, or cancel ticket reservations across all events.
 */
export default function ManageBookings() {
  const { adminBookings, fetchAdminBookings } = useApp();
  const [actionId,  setActionId]  = useState(null);
  const [actionType, setActionType] = useState(null); 
  const [loading, setLoading]     = useState(false);

  useEffect(() => { fetchAdminBookings(); }, []);

  const confirm = (id, type) => { setActionId(id); setActionType(type); };

  const handleAction = async () => {
    setLoading(true);
    try {
      if (actionType === 'approve') await approveBooking(actionId);
      else if (actionType === 'reject') await rejectBooking(actionId);
      else if (actionType === 'cancel') await cancelBooking(actionId);
      await fetchAdminBookings();
      toast.success(`Booking ${actionType}d successfully`);
    } catch (e) {
      toast.error(e.response?.data?.message || `Failed to ${actionType} booking`);
    } finally {
      setLoading(false);
      setActionId(null);
      setActionType(null);
    }
  };

  const pending  = adminBookings.filter(b => b.status === 'PENDING').length;
  const approved = adminBookings.filter(b => ['APPROVED','CONFIRMED'].includes(b.status)).length;

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Typography sx={{ fontFamily: 'Syne', fontWeight: 800, fontSize: { xs: '2rem', md: '2.4rem' }, color: '#111827', letterSpacing: '-0.03em' }}>
              Manage Bookings
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 0.5, flexWrap: 'wrap' }}>
              {[
                { label: `${adminBookings.length} Total`, bg: '#F1F5F9', color: '#374151' },
                { label: `${pending} Pending`, bg: '#FEF3C7', color: '#D97706' },
                { label: `${approved} Approved`, bg: '#D1FAE5', color: '#059669' },
              ].map(({ label, bg, color }) => (
                <Chip key={label} label={label} size="small" sx={{ bgcolor: bg, color, fontFamily: 'Outfit', fontWeight: 600, fontSize: '0.78rem' }} />
              ))}
            </Box>
          </motion.div>
          <Tooltip title="Refresh"><IconButton onClick={fetchAdminBookings} sx={{ color: '#6366F1', mt: 0.5 }}><RefreshIcon /></IconButton></Tooltip>
        </Box>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                  {['ID', 'Event', 'Booking Date', 'Seats', 'Status', 'Actions'].map(h => (
                    <TableCell key={h} sx={{ fontFamily: 'Syne', fontWeight: 700, color: '#374151', fontSize: '0.78rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {adminBookings.map((b, i) => {
                  const sc = STATUS_CONFIG[b.status] || STATUS_CONFIG.PENDING;
                  const isPending   = b.status === 'PENDING';
                  const isCancelled = ['CANCELLED', 'REJECTED'].includes(b.status);
                  return (
                    <TableRow key={b.id} sx={{ '&:hover': { bgcolor: '#F8FAFC' }, transition: 'background 0.2s' }}>
                      <TableCell sx={{ fontFamily: 'Outfit', color: '#9CA3AF', fontSize: '0.82rem' }}>#{b.id}</TableCell>
                      <TableCell sx={{ fontFamily: 'Outfit', fontWeight: 600, color: '#111827' }}>
                        {b.event?.name || `Event #${b.event?.id ?? b.eventId ?? '—'}`}
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'Outfit', color: '#4B5563', fontSize: '0.83rem' }}>
                        {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : '—'}
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'Outfit', color: '#4B5563' }}>{b.numberOfSeats ?? '—'}</TableCell>
                      <TableCell>
                        <Chip label={sc.label} size="small" sx={{ bgcolor: sc.bg, color: sc.color, fontFamily: 'Outfit', fontWeight: 600, fontSize: '0.72rem' }} />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.25 }}>
                          {}
                          {isPending && (
                            <Tooltip title="Approve">
                              <IconButton onClick={() => confirm(b.id, 'approve')} size="small" sx={{ color: '#059669', '&:hover': { bgcolor: 'rgba(5,150,105,0.08)' } }}>
                                <CheckCircleOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {}
                          {isPending && (
                            <Tooltip title="Reject">
                              <IconButton onClick={() => confirm(b.id, 'reject')} size="small" sx={{ color: '#DC2626', '&:hover': { bgcolor: 'rgba(220,38,38,0.08)' } }}>
                                <CancelOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {}
                          {!isCancelled && !isPending && (
                            <Tooltip title="Cancel">
                              <IconButton onClick={() => confirm(b.id, 'cancel')} size="small" sx={{ color: '#EF4444', '&:hover': { bgcolor: 'rgba(239,68,68,0.08)' } }}>
                                <BlockIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {}
                          <Tooltip title="View Attendees">
                            <IconButton component={Link} to={`/attendees/${b.id}`} size="small" sx={{ color: '#6366F1', '&:hover': { bgcolor: 'rgba(99,102,241,0.08)' } }}>
                              <PeopleAltIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {adminBookings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 6, fontFamily: 'Outfit', color: '#9CA3AF' }}>
                      No bookings found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>
      </Container>

      {}
      <Dialog open={!!actionId} onClose={() => setActionId(null)} PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}>
        <DialogTitle sx={{ fontFamily: 'Syne', fontWeight: 700, textTransform: 'capitalize' }}>
          {actionType} Booking #{actionId}?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: 'Outfit', color: '#4B5563' }}>
            {actionType === 'approve' && 'This will approve the booking and notify the customer.'}
            {actionType === 'reject'  && 'This will reject the booking. The customer will be notified.'}
            {actionType === 'cancel'  && 'This will cancel the booking. This action cannot be undone.'}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setActionId(null)} sx={{ fontFamily: 'Outfit', textTransform: 'none', color: '#6B7280' }}>Back</Button>
          <Button onClick={handleAction} disabled={loading} variant="contained"
            color={actionType === 'approve' ? 'success' : 'error'}
            sx={{ fontFamily: 'Outfit', fontWeight: 600, textTransform: 'capitalize', borderRadius: '8px' }}>
            {loading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : actionType}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
