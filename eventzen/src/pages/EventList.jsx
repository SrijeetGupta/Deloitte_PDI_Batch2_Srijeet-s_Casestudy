import { Box, Typography, Container, Grid, TextField, InputAdornment } from '@mui/material';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import EventCard, { EventCardSkeleton } from '../components/EventCard';
import SearchIcon from '@mui/icons-material/Search';

/**
 * Global search index rendering layout representing the active registry of all published Events.
 */
export default function EventList() {
  const { events, loading } = useApp();
  const [search, setSearch] = useState('');

  // Dynamically match text filters linearly against global event states
  const filtered = events.filter(e =>
    e.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        {/* Search Parameter Hero Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Typography sx={{ fontFamily: 'Syne', fontWeight: 800, fontSize: { xs: '2rem', md: '2.5rem' }, color: '#111827', letterSpacing: '-0.03em', mb: 0.5 }}>
            All Events
          </Typography>
          <Typography sx={{ fontFamily: 'Outfit', color: '#6B7280', mb: 3 }}>
            {events.length} event{events.length !== 1 ? 's' : ''} available
          </Typography>

          <TextField
            fullWidth
            placeholder="Search events by name or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#9CA3AF' }} /></InputAdornment>,
              sx: { fontFamily: 'Outfit', borderRadius: '12px', bgcolor: '#fff' },
            }}
            sx={{ mb: 4, maxWidth: 480, '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: '#6366F1' }, '&.Mui-focused fieldset': { borderColor: '#6366F1' } } }}
          />
        </motion.div>

        {/* Dynamic Card Generation Grid */}
        <Grid container spacing={3}>
          {loading.events
            ? [1, 2, 3, 4, 5, 6].map(i => (
              <Grid item xs={12} sm={6} md={4} key={i}><EventCardSkeleton /></Grid>
            ))
            : filtered.length === 0
              ? (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography sx={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '1.2rem', color: '#9CA3AF' }}>No events found</Typography>
                    <Typography sx={{ fontFamily: 'Outfit', color: '#D1D5DB', mt: 1 }}>Try a different search term</Typography>
                  </Box>
                </Grid>
              )
              : filtered.map((ev, i) => (
                <Grid item xs={12} sm={6} md={4} key={ev.id}>
                  <EventCard event={ev} index={i} />
                </Grid>
              ))
          }
        </Grid>
      </Container>
    </Box>
  );
}
