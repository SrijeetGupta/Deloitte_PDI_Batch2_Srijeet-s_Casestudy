import { Box, Typography, Button, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ApartmentIcon from '@mui/icons-material/Apartment';

/**
 * Placeholder layout skeleton displaying while awaiting true Venue telemetry constraints.
 */
export function VenueCardSkeleton() {
  return (
    <Box sx={{ borderRadius: '16px', bgcolor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', p: 2.5 }}>
      <Skeleton width={40} height={40} variant="circular" sx={{ mb: 2 }} />
      <Skeleton width="65%" height={28} sx={{ mb: 1 }} />
      <Skeleton width="45%" height={20} sx={{ mb: 2 }} />
      <Skeleton width="100%" height={1} sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Skeleton width="40%" height={20} />
        <Skeleton width="40%" height={20} />
      </Box>
      <Skeleton variant="rectangular" height={38} sx={{ borderRadius: '8px' }} />
    </Box>
  );
}

/**
 * High-fidelity reusable card representing a physical venue's key metrics.
 * 
 * @param {Object} venue - Core spatial features and location boundaries
 * @param {number} index - Structural index generating wave-like presentation animations 
 * @param {Function} onViewDetails - Bound action trigger routing towards exact details list
 */
export default function VenueCard({ venue, index = 0, onViewDetails }) {
  if (!venue) return <VenueCardSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      style={{ height: '100%' }}
    >
      <Box sx={{
        borderRadius: '16px', bgcolor: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        p: 2.5, height: '100%', display: 'flex', flexDirection: 'column',
        transition: 'box-shadow 0.3s',
        '&:hover': { boxShadow: '0 8px 32px rgba(99,102,241,0.14)' },
      }}>
        {/* Isolated Venue Typology Header */}
        <Box sx={{
          width: 44, height: 44, borderRadius: '12px', mb: 2,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <ApartmentIcon sx={{ color: '#6366F1', fontSize: 22 }} />
        </Box>

        <Typography sx={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.05rem', color: '#111827', mb: 0.5 }}>
          {venue.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
          <LocationOnIcon sx={{ fontSize: 14, color: '#6366F1' }} />
          <Typography sx={{ fontFamily: 'Outfit', fontSize: '0.83rem', color: '#6B7280' }}>
            {venue.location || 'Location TBA'}
          </Typography>
        </Box>

        <Box sx={{ height: '1px', bgcolor: '#F1F5F9', mb: 2 }} />

        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PeopleIcon sx={{ fontSize: 14, color: '#8B5CF6' }} />
            <Typography sx={{ fontFamily: 'Outfit', fontSize: '0.83rem', color: '#4B5563', fontWeight: 500 }}>
              {venue.capacity} cap.
            </Typography>
          </Box>
          {venue.pricePerHour !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
              <AttachMoneyIcon sx={{ fontSize: 14, color: '#8B5CF6' }} />
              <Typography sx={{ fontFamily: 'Outfit', fontSize: '0.83rem', color: '#4B5563', fontWeight: 500 }}>
                ₹{venue.pricePerHour}/hr
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ mt: 'auto' }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => onViewDetails && onViewDetails(venue)}
            sx={{
              fontFamily: 'Outfit', fontWeight: 600, textTransform: 'none',
              borderRadius: '10px', py: 0.9,
              borderColor: '#6366F1', color: '#6366F1',
              '&:hover': {
                bgcolor: 'rgba(99,102,241,0.06)',
                borderColor: '#4F46E5',
              },
              transition: 'all 0.2s',
            }}
          >
            View Details
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
}
