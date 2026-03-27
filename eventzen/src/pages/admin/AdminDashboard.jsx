import { Box, Typography, Container, Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useEffect } from 'react';
import EventIcon from '@mui/icons-material/Event';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TuneIcon from '@mui/icons-material/Tune';
import StoreIcon from '@mui/icons-material/Store';
import GroupIcon from '@mui/icons-material/Group';

const StatCard = ({ label, value, icon, color, gradient, delay, to }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
  >
    <Box sx={{
      bgcolor: '#fff', borderRadius: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
      p: 3, overflow: 'hidden', position: 'relative',
      transition: 'box-shadow 0.3s',
      '&:hover': { boxShadow: `0 8px 32px ${color}28` },
    }}>
      <Box sx={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: `${color}10` }} />
      <Box sx={{ width: 48, height: 48, borderRadius: '14px', mb: 2, background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 14px ${color}40` }}>
        {icon}
      </Box>
      <Typography sx={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2.2rem', color: '#111827', lineHeight: 1 }}>{value}</Typography>
      <Typography sx={{ fontFamily: 'Outfit', fontSize: '0.9rem', color: '#6B7280', mt: 0.5 }}>{label}</Typography>
      {to && (
        <Button component={Link} to={to} size="small" endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
          sx={{ mt: 2, fontFamily: 'Outfit', textTransform: 'none', color, fontWeight: 600, p: 0, minWidth: 0, '&:hover': { bgcolor: 'transparent', opacity: 0.8 }, fontSize: '0.82rem' }}>
          Manage
        </Button>
      )}
    </Box>
  </motion.div>
);

const QuickAction = ({ label, to, icon, delay, badge }) => (
  <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay }}>
    <Box component={Link} to={to} sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#fff', borderRadius: '14px', p: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', textDecoration: 'none', transition: 'all 0.2s', '&:hover': { boxShadow: '0 6px 20px rgba(99,102,241,0.12)', transform: 'translateX(4px)' } }}>
      <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </Box>
      <Typography sx={{ fontFamily: 'Outfit', fontWeight: 600, color: '#374151', flex: 1 }}>{label}</Typography>
      {badge > 0 && <Box sx={{ bgcolor: '#EF4444', color: '#fff', fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.7rem', borderRadius: '999px', px: 1, py: 0.2 }}>{badge}</Box>}
      <ArrowForwardIcon sx={{ color: '#9CA3AF', fontSize: 16 }} />
    </Box>
  </motion.div>
);

/**
 * Secure system overview rendering top-level analytics and entry points for 
 * administrative moderation of the platform's core entities.
 */
export default function AdminDashboard() {
  const { events, venues, adminBookings, fetchAdminBookings } = useApp();

  useEffect(() => { fetchAdminBookings(); }, []);

  const pending = adminBookings.filter(b => b.status === 'PENDING').length;
  const approved = adminBookings.filter(b => b.status === 'APPROVED' || b.status === 'CONFIRMED').length;

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <TuneIcon sx={{ color: '#6366F1' }} />
            <Typography sx={{ fontFamily: 'Outfit', fontSize: '0.85rem', color: '#6366F1', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Admin Panel</Typography>
          </Box>
          <Typography sx={{ fontFamily: 'Syne', fontWeight: 800, fontSize: { xs: '2rem', md: '2.5rem' }, color: '#111827', letterSpacing: '-0.03em', mb: 4 }}>
            Dashboard
          </Typography>
        </motion.div>

        <Grid container spacing={3} sx={{ mb: 5 }}>
          {[
            { label: 'Total Venues', value: venues.length, icon: <LocationCityIcon sx={{ color: '#fff', fontSize: 22 }} />, color: '#6366F1', gradient: 'linear-gradient(135deg, #6366F1, #818CF8)', delay: 0, to: '/admin/venues' },
            { label: 'Total Events', value: events.length, icon: <EventIcon sx={{ color: '#fff', fontSize: 22 }} />, color: '#8B5CF6', gradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)', delay: 0.08, to: '/admin/events' },
            { label: 'Total Bookings', value: adminBookings.length, icon: <BookOnlineIcon sx={{ color: '#fff', fontSize: 22 }} />, color: '#EC4899', gradient: 'linear-gradient(135deg, #EC4899, #F9A8D4)', delay: 0.16, to: '/admin/bookings' },
            { label: 'Pending Review', value: pending, icon: <PendingActionsIcon sx={{ color: '#fff', fontSize: 22 }} />, color: '#F59E0B', gradient: 'linear-gradient(135deg, #F59E0B, #FCD34D)', delay: 0.24, to: '/admin/bookings' },
          ].map(s => (
            <Grid item xs={12} sm={6} md={3} key={s.label}><StatCard {...s} /></Grid>
          ))}
        </Grid>

        <Typography sx={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.2rem', color: '#111827', mb: 2 }}>Quick Actions</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxWidth: 520 }}>
          <QuickAction label="Manage Events" to="/admin/events" delay={0.1} icon={<EventIcon sx={{ color: '#6366F1', fontSize: 18 }} />} />
          <QuickAction label="Manage Venues" to="/admin/venues" delay={0.15} icon={<LocationCityIcon sx={{ color: '#6366F1', fontSize: 18 }} />} />
          <QuickAction label="Manage Bookings" to="/admin/bookings" delay={0.2} icon={<BookOnlineIcon sx={{ color: '#6366F1', fontSize: 18 }} />} badge={pending} />
          <QuickAction label="Manage Vendors" to="/admin/vendors" delay={0.25} icon={<StoreIcon sx={{ color: '#6366F1', fontSize: 18 }} />} />
          <QuickAction label="Manage Users" to="/admin/users" delay={0.3} icon={<GroupIcon sx={{ color: '#6366F1', fontSize: 18 }} />} />
        </Box>
      </Container>
    </Box>
  );
}
