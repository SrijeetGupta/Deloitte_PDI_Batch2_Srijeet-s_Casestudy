import { Box, Typography, Container, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import BoltIcon from '@mui/icons-material/Bolt';

/**
 * Standard global footer spanning the absolute bottom of the viewport mapping primary discovery and administration trees.
 */
export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: '#0F172A', color: '#94A3B8', mt: 'auto', pt: 6, pb: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'space-between', mb: 4 }}>
          {/* Brand Presentation Section */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Box sx={{
                width: 30, height: 30, borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <BoltIcon sx={{ color: '#fff', fontSize: 18 }} />
              </Box>
              <Typography sx={{ fontFamily: 'Syne', fontWeight: 700, color: '#F8FAFC', fontSize: '1.1rem' }}>
                Event<span style={{ color: '#818CF8' }}>Zen</span>
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: 'Outfit', fontSize: '0.875rem', maxWidth: 240, lineHeight: 1.7 }}>
              Curated event experiences and seamless venue management in one place.
            </Typography>
          </Box>

          {/* Navigational Matrices */}
          <Box sx={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <Box>
              <Typography sx={{ fontFamily: 'Syne', fontWeight: 600, color: '#F1F5F9', mb: 2, fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Explore
              </Typography>
              {[['Events', '/events'], ['Venues', '/venues'], ['My Bookings', '/bookings']].map(([l, p]) => (
                <Box key={p} component={Link} to={p} sx={{ display: 'block', mb: 1, color: '#94A3B8', textDecoration: 'none', fontFamily: 'Outfit', fontSize: '0.9rem', '&:hover': { color: '#818CF8' }, transition: 'color 0.2s' }}>
                  {l}
                </Box>
              ))}
            </Box>
            <Box>
              <Typography sx={{ fontFamily: 'Syne', fontWeight: 600, color: '#F1F5F9', mb: 2, fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Admin
              </Typography>
              {[['Dashboard', '/admin'], ['Manage Events', '/admin/events'], ['Manage Venues', '/admin/venues']].map(([l, p]) => (
                <Box key={p} component={Link} to={p} sx={{ display: 'block', mb: 1, color: '#94A3B8', textDecoration: 'none', fontFamily: 'Outfit', fontSize: '0.9rem', '&:hover': { color: '#818CF8' }, transition: 'color 0.2s' }}>
                  {l}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(148,163,184,0.12)', mb: 3 }} />
        <Typography sx={{ fontFamily: 'Outfit', fontSize: '0.8rem', textAlign: 'center' }}>
          © {new Date().getFullYear()} EventZen. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
