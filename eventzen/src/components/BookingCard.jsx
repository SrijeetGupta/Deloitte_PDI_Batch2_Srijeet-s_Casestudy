import { Box, Typography, Button, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import EventIcon from '@mui/icons-material/Event';
import ChairIcon from '@mui/icons-material/Chair';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

/**
 * Standard configuration mapping the textual state of a booking to distinct visual UI elements.
 */
const STATUS_CONFIG = {
  PENDING: { label: 'Pending', color: '#D97706', bg: '#FEF3C7' },
  APPROVED: { label: 'Approved', color: '#2563EB', bg: '#DBEAFE' },
  CONFIRMED: { label: 'Confirmed', color: '#059669', bg: '#D1FAE5' },
  REJECTED: { label: 'Rejected', color: '#DC2626', bg: '#FEE2E2' },
  CANCELLED: { label: 'Cancelled', color: '#6B7280', bg: '#E5E7EB' },
};

/**
 * Renders an interactive card previewing an individual booking's core telemetry.
 * 
 * @param {Object} booking - Raw booking dataset including status and ownership limits
 * @param {number} index - Index utilized by framer-motion to stagger the entrance animation
 * @param {Function} onCancel - Callback executing deletion/cancellation workflows centrally
 */
export default function BookingCard({ booking, index = 0, onCancel }) {
  const normalizedStatus = booking.status?.toUpperCase();

  const status = STATUS_CONFIG[normalizedStatus] || STATUS_CONFIG.PENDING;

  const isCancelled = normalizedStatus === 'CANCELLED';
  const canCancel = normalizedStatus === 'PENDING';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
    >
      <Box sx={{
        bgcolor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        p: 2.5,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderLeft: `4px solid ${isCancelled ? '#EF4444' : '#6366F1'}`,
      }}>
        {/* Left Hand Core Information Block */}
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography sx={{ fontWeight: 700 }}>
              Booking #{booking.id}
            </Typography>

            <Chip
              label={status.label}
              size="small"
              sx={{
                bgcolor: status.bg,
                color: status.color,
                fontWeight: 600,
                fontSize: '0.72rem'
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <EventIcon sx={{ fontSize: 14 }} />
              <Typography sx={{ fontSize: '0.83rem' }}>
                Event #{booking.eventId}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ChairIcon sx={{ fontSize: 14 }} />
              <Typography sx={{ fontSize: '0.83rem' }}>
                {booking.numberOfSeats} seats
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right Hand Action Controllers */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            component={Link}
            to={`/attendees/${booking.id}`}
            size="small"
            variant="outlined"
            startIcon={<PeopleAltIcon sx={{ fontSize: 14 }} />}
          >
            Attendees
          </Button>

          {canCancel && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => onCancel && onCancel(booking.id)}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Box>
    </motion.div>
  );
}