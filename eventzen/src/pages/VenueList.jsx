import { useState, useCallback } from 'react';
import {
  Box, Typography, Container, Grid, TextField, InputAdornment,
  Dialog, DialogContent, IconButton, Button, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useApp } from '../context/AppContext';
import VenueCard, { VenueCardSkeleton } from '../components/VenueCard';
import { getAvailability } from '../api/api';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import TuneIcon from '@mui/icons-material/Tune';
import SearchOffIcon from '@mui/icons-material/SearchOff';

const STATUS_COLORS = {
  AVAILABLE:   { bg: '#D1FAE5', color: '#059669' },
  BOOKED:      { bg: '#FEE2E2', color: '#DC2626' },
  MAINTENANCE: { bg: '#FEF3C7', color: '#D97706' },
};

/**
 * Interactive directory providing searchable access to all registered hosting 
 * properties along with detailed querying for timeslot availability mapping.
 */
export default function VenueList() {
  const { venues, loading, fetchVenues } = useApp();

  
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter]         = useState('');
  const [capacityFilter, setCapacityFilter] = useState('');
  const [searched, setSearched]             = useState(false);

  
  const [selectedVenue, setSelectedVenue]   = useState(null);
  const [availTab, setAvailTab]             = useState('details'); 
  const [availability, setAvailability]     = useState([]);
  const [availLoading, setAvailLoading]     = useState(false);

  const handleSearch = useCallback(() => {
    const params = {};
    if (locationFilter.trim()) params.location = locationFilter.trim();
    if (dateFilter)            params.date      = dateFilter;
    if (capacityFilter)        params.capacity  = Number(capacityFilter);
    fetchVenues(Object.keys(params).length ? params : undefined);
    setSearched(true);
  }, [locationFilter, dateFilter, capacityFilter, fetchVenues]);

  const handleReset = () => {
    setLocationFilter('');
    setDateFilter('');
    setCapacityFilter('');
    fetchVenues();
    setSearched(false);
  };

  const openVenueDetail = async (venue) => {
    setSelectedVenue(venue);
    setAvailTab('details');
  };

  const loadAvailability = async (venueId) => {
    setAvailLoading(true);
    try {
      const res = await getAvailability(venueId, dateFilter || undefined);
      setAvailability(Array.isArray(res.data) ? res.data : [res.data]);
    } catch { toast.error('Could not load availability'); setAvailability([]); }
    finally { setAvailLoading(false); }
  };

  const switchToAvail = () => {
    setAvailTab('availability');
    loadAvailability(selectedVenue.id);
  };

  const filtersActive = locationFilter || dateFilter || capacityFilter;

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        {}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Typography sx={{ fontFamily: 'Syne', fontWeight: 800, fontSize: { xs: '2rem', md: '2.5rem' }, color: '#111827', letterSpacing: '-0.03em', mb: 0.5 }}>
            Venues
          </Typography>
          <Typography sx={{ fontFamily: 'Outfit', color: '#6B7280', mb: 3 }}>
            {venues.length} venue{venues.length !== 1 ? 's' : ''} {searched && filtersActive ? 'matched your filters' : 'available'}
          </Typography>

          {}
          <Box sx={{ bgcolor: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', p: 2.5, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <TuneIcon sx={{ color: '#6366F1', fontSize: 18 }} />
              <Typography sx={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>Filter Venues</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <TextField
                label="Location" placeholder="e.g. Mumbai"
                value={locationFilter} onChange={e => setLocationFilter(e.target.value)}
                size="small"
                InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnIcon sx={{ color: '#9CA3AF', fontSize: 16 }} /></InputAdornment> }}
                sx={{ flex: '1 1 180px', '& .MuiOutlinedInput-root': { fontFamily: 'Outfit', borderRadius: '10px', '&.Mui-focused fieldset': { borderColor: '#6366F1' } } }}
              />
              <TextField
                label="Date" type="date" value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
                size="small" InputLabelProps={{ shrink: true }}
                sx={{ flex: '1 1 160px', '& .MuiOutlinedInput-root': { fontFamily: 'Outfit', borderRadius: '10px', '&.Mui-focused fieldset': { borderColor: '#6366F1' } } }}
              />
              <TextField
                label="Min Capacity" type="number" placeholder="e.g. 200"
                value={capacityFilter} onChange={e => setCapacityFilter(e.target.value)}
                size="small"
                InputProps={{ startAdornment: <InputAdornment position="start"><PeopleIcon sx={{ color: '#9CA3AF', fontSize: 16 }} /></InputAdornment> }}
                sx={{ flex: '1 1 150px', '& .MuiOutlinedInput-root': { fontFamily: 'Outfit', borderRadius: '10px', '&.Mui-focused fieldset': { borderColor: '#6366F1' } } }}
              />
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button onClick={handleSearch} variant="contained" startIcon={<SearchIcon />}
                  sx={{ fontFamily: 'Outfit', fontWeight: 600, textTransform: 'none', borderRadius: '10px', whiteSpace: 'nowrap', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 3px 10px rgba(99,102,241,0.3)', '&:hover': { transform: 'translateY(-1px)' }, transition: 'all 0.2s' }}>
                  Search
                </Button>
                {filtersActive && (
                  <Button onClick={handleReset} variant="outlined" startIcon={<SearchOffIcon />}
                    sx={{ fontFamily: 'Outfit', fontWeight: 600, textTransform: 'none', borderRadius: '10px', borderColor: '#E5E7EB', color: '#6B7280', '&:hover': { borderColor: '#9CA3AF' } }}>
                    Reset
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </motion.div>

        {}
        <Grid container spacing={3}>
          {loading.venues
            ? [1, 2, 3, 4, 5, 6].map(i => <Grid item xs={12} sm={6} md={4} key={i}><VenueCardSkeleton /></Grid>)
            : venues.length === 0
              ? (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography sx={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '1.2rem', color: '#9CA3AF' }}>No venues found</Typography>
                    <Typography sx={{ fontFamily: 'Outfit', color: '#D1D5DB', mt: 1 }}>Try adjusting your filters</Typography>
                  </Box>
                </Grid>
              )
              : venues.map((v, i) => (
                <Grid item xs={12} sm={6} md={4} key={v.id}>
                  <VenueCard venue={v} index={i} onViewDetails={openVenueDetail} />
                </Grid>
              ))
          }
        </Grid>
      </Container>

      {}
      <Dialog open={!!selectedVenue} onClose={() => setSelectedVenue(null)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: '20px', overflow: 'hidden' } }}>
        {selectedVenue && (
          <>
            {}
            <Box sx={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', p: 3, position: 'relative' }}>
              <IconButton onClick={() => setSelectedVenue(null)} sx={{ position: 'absolute', top: 12, right: 12, color: '#fff', bgcolor: 'rgba(255,255,255,0.15)', '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' } }}>
                <CloseIcon />
              </IconButton>
              <Typography sx={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.4rem', color: '#fff', pr: 5 }}>{selectedVenue.name}</Typography>
              <Typography sx={{ fontFamily: 'Outfit', color: 'rgba(255,255,255,0.75)', mt: 0.4 }}>
                {selectedVenue.location || 'Location TBA'}
              </Typography>
              {}
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                {[['details', 'Details'], ['availability', 'Availability']].map(([key, label]) => (
                  <Box
                    key={key}
                    onClick={() => key === 'availability' ? switchToAvail() : setAvailTab('details')}
                    sx={{ px: 2, py: 0.6, borderRadius: '8px', cursor: 'pointer', fontFamily: 'Outfit', fontWeight: 600, fontSize: '0.82rem', bgcolor: availTab === key ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)', color: '#fff', transition: 'background 0.2s', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                  >
                    {label}
                  </Box>
                ))}
              </Box>
            </Box>

            <DialogContent sx={{ p: 3 }}>
              {availTab === 'details' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {[
                    { icon: <PeopleIcon sx={{ color: '#6366F1', fontSize: 18 }} />, label: 'Capacity', value: `${selectedVenue.capacity} people` },
                    { icon: <AttachMoneyIcon sx={{ color: '#6366F1', fontSize: 18 }} />, label: 'Price', value: selectedVenue.price || selectedVenue.pricePerHour ? `₹${selectedVenue.price ?? selectedVenue.pricePerHour}/hr` : 'Contact for pricing' },
                    { icon: <LocationOnIcon sx={{ color: '#6366F1', fontSize: 18 }} />, label: 'Location', value: selectedVenue.location || '—' },
                  ].map(({ icon, label, value }) => (
                    <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: '#F8FAFC', borderRadius: '10px' }}>
                      {icon}
                      <Box>
                        <Typography sx={{ fontFamily: 'Outfit', fontSize: '0.72rem', color: '#9CA3AF', lineHeight: 1 }}>{label}</Typography>
                        <Typography sx={{ fontFamily: 'Outfit', fontWeight: 500, fontSize: '0.92rem', color: '#111827' }}>{value}</Typography>
                      </Box>
                    </Box>
                  ))}
                  <Button onClick={switchToAvail} startIcon={<EventAvailableIcon />} fullWidth variant="outlined"
                    sx={{ mt: 1, fontFamily: 'Outfit', fontWeight: 600, textTransform: 'none', borderColor: '#6366F1', color: '#6366F1', borderRadius: '10px', '&:hover': { bgcolor: 'rgba(99,102,241,0.06)' } }}>
                    Check Availability
                  </Button>
                </Box>
              )}

              {availTab === 'availability' && (
                <Box>
                  {availLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress sx={{ color: '#6366F1' }} /></Box>
                  ) : availability.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <EventAvailableIcon sx={{ fontSize: 40, color: '#E5E7EB', mb: 1 }} />
                      <Typography sx={{ fontFamily: 'Outfit', color: '#9CA3AF' }}>No availability data found</Typography>
                    </Box>
                  ) : (
                    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #F1F5F9', borderRadius: '12px' }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                            {['Date', 'Status'].map(h => (
                              <TableCell key={h} sx={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', color: '#374151', letterSpacing: '0.04em' }}>{h}</TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {availability.map((a, i) => {
                            const sc = STATUS_COLORS[a.status] || STATUS_COLORS.AVAILABLE;
                            return (
                              <TableRow key={i} sx={{ '&:hover': { bgcolor: '#F8FAFC' } }}>
                                <TableCell sx={{ fontFamily: 'Outfit', color: '#374151', fontSize: '0.88rem' }}>
                                  {a.date ? new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                </TableCell>
                                <TableCell>
                                  <Chip label={a.status || 'AVAILABLE'} size="small" sx={{ bgcolor: sc.bg, color: sc.color, fontFamily: 'Outfit', fontWeight: 600, fontSize: '0.72rem' }} />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}
