import { Box, Typography, Container, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { cancelBooking } from '../api/api';
import { useApp } from '../context/AppContext';
import BookingCard from '../components/BookingCard';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

/**
 * Personal dashboard view listing all historical and upcoming ticket reservations 
 * strictly bound to the authenticated user.
 */
export default function MyBookings() {
  const { bookings, loading, fetchBookings } = useApp();
  const [confirmId, setConfirmId] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await cancelBooking(confirmId);
      await fetchBookings();
      toast.success('Booking cancelled');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Cancellation failed');
    } finally {
      setCancelling(false);
      setConfirmId(null);
    }
  };

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Typography sx={{ fontFamily: 'Syne', fontWeight: 800, fontSize: { xs: '2rem', md: '2.5rem' }, color: '#111827', letterSpacing: '-0.03em', mb: 0.5 }}>
              My Bookings
            </Typography>
            <Typography sx={{ fontFamily: 'Outfit', color: '#6B7280' }}>
              {bookings.length} reservation{bookings.length !== 1 ? 's' : ''}
            </Typography>
          </motion.div>
          <Button component={Link} to="/events" variant="outlined" startIcon={<AddIcon />}
            sx={{ fontFamily: 'Outfit', fontWeight: 600, textTransform: 'none', borderRadius: '10px', mt: 0.5, borderColor: '#6366F1', color: '#6366F1', '&:hover': { bgcolor: 'rgba(99,102,241,0.06)' } }}>
            Book Event
          </Button>
        </Box>

        {loading.bookings ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#6366F1' }} />
          </Box>
        ) : bookings.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <BookmarkBorderIcon sx={{ fontSize: 56, color: '#E5E7EB', mb: 2 }} />
            <Typography sx={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '1.2rem', color: '#9CA3AF' }}>No bookings yet</Typography>
            <Typography sx={{ fontFamily: 'Outfit', color: '#D1D5DB', mt: 1 }}>Head over to Events to make your first booking</Typography>
            <Button component={Link} to="/events" variant="contained" sx={{ mt: 3, fontFamily: 'Outfit', fontWeight: 600, textTransform: 'none', borderRadius: '10px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
              Browse Events
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {bookings.map((b, i) => (
              <BookingCard key={b.id} booking={b} index={i} onCancel={setConfirmId} />
            ))}
          </Box>
        )}
      </Container>

      <Dialog open={!!confirmId} onClose={() => setConfirmId(null)} PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}>
        <DialogTitle sx={{ fontFamily: 'Syne', fontWeight: 700 }}>Cancel Booking?</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: 'Outfit', color: '#4B5563' }}>
            Are you sure you want to cancel Booking #{confirmId}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmId(null)} sx={{ fontFamily: 'Outfit', textTransform: 'none', color: '#6B7280' }}>Keep it</Button>
          <Button onClick={handleCancel} disabled={cancelling} variant="contained" color="error"
            sx={{ fontFamily: 'Outfit', fontWeight: 600, textTransform: 'none', borderRadius: '8px' }}>
            {cancelling ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Yes, Cancel'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
