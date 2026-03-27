import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Button, CircularProgress, TextField } from '@mui/material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getEventById, createBooking } from '../api/api';
import { useApp } from '../context/AppContext';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChairIcon from '@mui/icons-material/Chair';

/**
 * Interactive surface responsible for guiding a user through committing a physical ticket/seat reservation.
 */
export default function BookingPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  
  // Exposes global tracking mechanisms forcing UI reloads
  const { fetchBookings } = useApp();
  
  const [event, setEvent]   = useState(null);
  const [seats, setSeats]   = useState(1);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Synchronize targeted event object with API lookup
  useEffect(() => {
    getEventById(eventId)
      .then(r => setEvent(r.data))
      .catch(() => toast.error('Event not found'))
      .finally(() => setLoading(false));
  }, [eventId]);

  /**
   * Translates active user data inputs into a finalized commitment request upstream.
   */
  const handleBook = async () => {
    if (seats < 1) return toast.error('Please select at least 1 seat');
    setSubmitting(true);
    try {
      await createBooking({
        event: { id: Number(eventId) },
        bookingDate: new Date().toISOString(),
        status: 'PENDING',
        numberOfSeats: seats,
      });
      // Ping generic context to invalidate stale UI tables globally
      await fetchBookings();
      toast.success('Booking confirmed! 🎉');
      navigate('/bookings');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Booking failed. Are you logged in?');
    } finally { setSubmitting(false); }
  };

  // Halt rendering if critical data isn't supplied
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress sx={{ color: '#6366F1' }} /></Box>;
  if (!event) return <Box sx={{ textAlign: 'center', py: 10 }}><Typography sx={{ fontFamily: 'Syne', color: '#9CA3AF', fontSize: '1.3rem' }}>Event not found.</Typography></Box>;

  const formattedDate = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : 'Date TBA';

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="sm">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Active Booking Meta Preview Header */}
          <Box sx={{ bgcolor: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', mb: 3 }}>
            <Box sx={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', p: 3 }}>
              <Typography sx={{ fontFamily: 'Outfit', fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', mb: 0.5 }}>You are booking</Typography>
              <Typography sx={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.5rem', color: '#fff' }}>{event.name}</Typography>
            </Box>
            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><CalendarTodayIcon sx={{ fontSize: 16, color: '#6366F1' }} /><Typography sx={{ fontFamily: 'Outfit', fontSize: '0.9rem', color: '#374151' }}>{formattedDate}</Typography></Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><LocationOnIcon sx={{ fontSize: 16, color: '#6366F1' }} /><Typography sx={{ fontFamily: 'Outfit', fontSize: '0.9rem', color: '#374151' }}>Venue ID: {event.venueId ?? event.venue?.id ?? '—'}</Typography></Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><ChairIcon sx={{ fontSize: 16, color: '#6366F1' }} /><Typography sx={{ fontFamily: 'Outfit', fontSize: '0.9rem', color: '#374151' }}>{event.capacity} total capacity</Typography></Box>
              {event.description && <Typography sx={{ fontFamily: 'Outfit', fontSize: '0.85rem', color: '#6B7280', lineHeight: 1.6, mt: 0.5 }}>{event.description}</Typography>}
            </Box>
          </Box>

          {/* User Confirmation Interaction Container */}
          <Box sx={{ bgcolor: '#fff', borderRadius: '20px', p: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
            <Typography sx={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.2rem', color: '#111827', mb: 2.5 }}>Reserve Your Seats</Typography>
            <TextField
              type="number" value={seats}
              onChange={e => setSeats(Math.max(1, parseInt(e.target.value) || 1))}
              inputProps={{ min: 1, max: event.capacity }}
              fullWidth label="Number of Seats"
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { fontFamily: 'Outfit', borderRadius: '12px', '&:hover fieldset': { borderColor: '#6366F1' }, '&.Mui-focused fieldset': { borderColor: '#6366F1' } }, '& label.Mui-focused': { color: '#6366F1' } }}
            />
            <Button fullWidth variant="contained" size="large" onClick={handleBook} disabled={submitting}
              sx={{ fontFamily: 'Outfit', fontWeight: 700, textTransform: 'none', fontSize: '1rem', borderRadius: '12px', py: 1.5, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 6px 20px rgba(99,102,241,0.35)', '&:hover': { boxShadow: '0 8px 28px rgba(99,102,241,0.45)', transform: 'translateY(-1px)' }, '&:disabled': { background: '#E5E7EB', boxShadow: 'none' }, transition: 'all 0.2s' }}>
              {submitting ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : `Confirm ${seats} Seat${seats !== 1 ? 's' : ''}`}
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
