import { Box, Typography, Button, Chip, Skeleton } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import LocationOnIcon from '@mui/icons-material/LocationOn';

/**
 * A curated selection of CSS linear gradients assigned dynamically to mask image absence.
 */
const EVENT_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
];

/**
 * Placeholder component maintaining UI shape while actual remote Event data resolves.
 */
export function EventCardSkeleton() {
  return (
    <Box sx={{ borderRadius: '16px', overflow: 'hidden', bgcolor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <Skeleton variant="rectangular" height={120} />
      <Box sx={{ p: 2.5 }}>
        <Skeleton width="70%" height={28} sx={{ mb: 1 }} />
        <Skeleton width="50%" height={20} sx={{ mb: 2 }} />
        <Skeleton width="40%" height={20} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={38} sx={{ borderRadius: '8px' }} />
      </Box>
    </Box>
  );
}

/**
 * Highly stylized component previewing a single distinct public Event.
 * 
 * @param {Object} event - Primary event structure
 * @param {number} index - Multiplier affecting sequential arrival transitions
 */
export default function EventCard({ event, index = 0 }) {
  if (!event) return <EventCardSkeleton />;

  // Dynamically resolve gradient tied to ID for consistency
  const gradient = EVENT_GRADIENTS[event.id % EVENT_GRADIENTS.length] || EVENT_GRADIENTS[0];
  const formattedDate = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Date TBA';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      style={{ height: '100%' }}
    >
      <Box sx={{
        borderRadius: '16px', overflow: 'hidden',
        bgcolor: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.3s',
        height: '100%', display: 'flex', flexDirection: 'column',
        '&:hover': { boxShadow: '0 8px 32px rgba(99,102,241,0.16)' },
      }}>
        {/* Synthetic Graphic Header Area */}
        <Box sx={{ height: 110, background: gradient, position: 'relative', overflow: 'hidden' }}>
          <Box sx={{
            position: 'absolute', top: -20, right: -20,
            width: 100, height: 100, borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
          }} />
          <Box sx={{
            position: 'absolute', bottom: -30, left: -10,
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
          }} />
          <Chip
            label={`ID: ${event.id}`}
            size="small"
            sx={{
              position: 'absolute', top: 12, right: 12,
              bgcolor: 'rgba(255,255,255,0.2)', color: '#fff',
              fontFamily: 'Outfit', fontSize: '0.7rem', fontWeight: 600,
              backdropFilter: 'blur(8px)',
            }}
          />
        </Box>

        {/* Text and Actions Body Payload */}
        <Box sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography sx={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.05rem', color: '#111827', mb: 0.5, lineHeight: 1.3 }}>
            {event.name}
          </Typography>
          {event.description && (
            <Typography sx={{ fontFamily: 'Outfit', fontSize: '0.82rem', color: '#6B7280', mb: 1.5, lineHeight: 1.5,
              overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {event.description}
            </Typography>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <CalendarTodayIcon sx={{ fontSize: 14, color: '#6366F1' }} />
              <Typography sx={{ fontFamily: 'Outfit', fontSize: '0.82rem', color: '#4B5563' }}>{formattedDate}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <LocationOnIcon sx={{ fontSize: 14, color: '#6366F1' }} />
              <Typography sx={{ fontFamily: 'Outfit', fontSize: '0.82rem', color: '#4B5563' }}>Venue #{event.venueId}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <PeopleIcon sx={{ fontSize: 14, color: '#6366F1' }} />
              <Typography sx={{ fontFamily: 'Outfit', fontSize: '0.82rem', color: '#4B5563' }}>{event.capacity} seats</Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 'auto' }}>
            <Button
              component={Link}
              to={`/booking/${event.id}`}
              fullWidth
              variant="contained"
              sx={{
                fontFamily: 'Outfit', fontWeight: 600, textTransform: 'none',
                borderRadius: '10px', py: 1,
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                boxShadow: '0 4px 12px rgba(99,102,241,0.25)',
                '&:hover': { boxShadow: '0 6px 18px rgba(99,102,241,0.38)', transform: 'translateY(-1px)' },
                transition: 'all 0.2s',
              }}
            >
              Book Now
            </Button>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}
