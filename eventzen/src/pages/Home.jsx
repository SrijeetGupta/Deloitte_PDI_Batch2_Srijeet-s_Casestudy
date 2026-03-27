import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import EventCard, { EventCardSkeleton } from '../components/EventCard';
import VenueCard, { VenueCardSkeleton } from '../components/VenueCard';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BoltIcon from '@mui/icons-material/Bolt';

/**
 * Standard animation envelope for orchestrating upward-fading arrival patterns.
 */
const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

/**
 * Primary marketing landing page aggregating live datasets to draw initial user interaction.
 */
export default function Home() {
  const { events, venues, loading } = useApp();

  return (
    <Box>
      {/* Immersive Hero Advertisement Banner Layer */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)',
        pt: { xs: 10, md: 14 },
        pb: { xs: 10, md: 14 },
        position: 'relative',
        overflow: 'hidden',
      }}>
        {}
        <Box sx={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -150, left: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <motion.div {...fadeUp}>
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.75,
              bgcolor: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: '100px', px: 2, py: 0.75, mb: 3,
            }}>
              <BoltIcon sx={{ color: '#818CF8', fontSize: 14 }} />
              <Typography sx={{ fontFamily: 'Outfit', fontSize: '0.8rem', color: '#A5B4FC', fontWeight: 500 }}>
                Seamless Event Management
              </Typography>
            </Box>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            <Typography sx={{
              fontFamily: 'Syne', fontWeight: 800,
              fontSize: { xs: '2.8rem', md: '4.5rem' },
              color: '#F8FAFC',
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              mb: 3,
              maxWidth: 700,
            }}>
              Craft{' '}
              <Box component="span" sx={{ background: 'linear-gradient(90deg, #818CF8, #C084FC)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                Unforgettable
              </Box>{' '}
              Experiences.
            </Typography>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}>
            <Typography sx={{ fontFamily: 'Outfit', fontSize: { xs: '1rem', md: '1.15rem' }, color: '#94A3B8', mb: 4, maxWidth: 520, lineHeight: 1.75 }}>
              Browse curated venues, discover exciting events, and book seats instantly. EventZen makes every occasion extraordinary.
            </Typography>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.38 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                component={Link} to="/events"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  fontFamily: 'Outfit', fontWeight: 600, textTransform: 'none', fontSize: '1rem',
                  borderRadius: '12px', px: 3.5, py: 1.4,
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  boxShadow: '0 8px 24px rgba(99,102,241,0.45)',
                  '&:hover': { boxShadow: '0 12px 32px rgba(99,102,241,0.55)', transform: 'translateY(-2px)' },
                  transition: 'all 0.25s',
                }}
              >
                Browse Events
              </Button>
              <Button
                component={Link} to="/venues"
                variant="outlined"
                size="large"
                sx={{
                  fontFamily: 'Outfit', fontWeight: 600, textTransform: 'none', fontSize: '1rem',
                  borderRadius: '12px', px: 3.5, py: 1.4,
                  borderColor: 'rgba(129,140,248,0.4)', color: '#A5B4FC',
                  '&:hover': { borderColor: '#818CF8', bgcolor: 'rgba(99,102,241,0.08)' },
                  transition: 'all 0.25s',
                }}
              >
                Explore Venues
              </Button>
            </Box>
          </motion.div>

          {}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.6 }}>
            <Box sx={{ display: 'flex', gap: 4, mt: 6, flexWrap: 'wrap' }}>
              {[
                { value: `${events.length}+`, label: 'Live Events' },
                { value: `${venues.length}+`, label: 'Venues' },
                { value: '100%', label: 'Satisfaction' },
              ].map(({ value, label }) => (
                <Box key={label}>
                  <Typography sx={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.8rem', color: '#F8FAFC' }}>{value}</Typography>
                  <Typography sx={{ fontFamily: 'Outfit', fontSize: '0.82rem', color: '#64748B' }}>{label}</Typography>
                </Box>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {}
      <Box sx={{ bgcolor: '#F8FAFC', py: { xs: 7, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography sx={{ fontFamily: 'Syne', fontWeight: 700, fontSize: { xs: '1.6rem', md: '2rem' }, color: '#111827', letterSpacing: '-0.02em' }}>
                Upcoming Events
              </Typography>
              <Typography sx={{ fontFamily: 'Outfit', color: '#6B7280', mt: 0.5 }}>Don't miss what's happening near you</Typography>
            </Box>
            <Button
              component={Link} to="/events"
              endIcon={<ArrowForwardIcon />}
              sx={{ fontFamily: 'Outfit', fontWeight: 600, textTransform: 'none', color: '#6366F1', '&:hover': { bgcolor: 'rgba(99,102,241,0.06)' }, borderRadius: '8px' }}
            >
              View all
            </Button>
          </Box>

          <Grid container spacing={3}>
            {loading.events
              ? [1, 2, 3].map(i => <Grid item xs={12} sm={6} md={4} key={i}><EventCardSkeleton /></Grid>)
              : events.slice(0, 3).map((ev, i) => (
                <Grid item xs={12} sm={6} md={4} key={ev.id}>
                  <EventCard event={ev} index={i} />
                </Grid>
              ))
            }
          </Grid>
        </Container>
      </Box>

      {}
      <Box sx={{ bgcolor: '#fff', py: { xs: 7, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography sx={{ fontFamily: 'Syne', fontWeight: 700, fontSize: { xs: '1.6rem', md: '2rem' }, color: '#111827', letterSpacing: '-0.02em' }}>
                Featured Venues
              </Typography>
              <Typography sx={{ fontFamily: 'Outfit', color: '#6B7280', mt: 0.5 }}>Hand-picked spaces for your special moments</Typography>
            </Box>
            <Button
              component={Link} to="/venues"
              endIcon={<ArrowForwardIcon />}
              sx={{ fontFamily: 'Outfit', fontWeight: 600, textTransform: 'none', color: '#6366F1', '&:hover': { bgcolor: 'rgba(99,102,241,0.06)' }, borderRadius: '8px' }}
            >
              View all
            </Button>
          </Box>

          <Grid container spacing={3}>
            {loading.venues
              ? [1, 2, 3].map(i => <Grid item xs={12} sm={6} md={4} key={i}><VenueCardSkeleton /></Grid>)
              : venues.slice(0, 3).map((v, i) => (
                <Grid item xs={12} sm={6} md={4} key={v.id}>
                  <VenueCard venue={v} index={i} />
                </Grid>
              ))
            }
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
