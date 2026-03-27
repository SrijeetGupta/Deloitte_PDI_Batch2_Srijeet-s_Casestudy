import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, IconButton,
  Drawer, List, ListItem, ListItemButton, ListItemText,
  Box, useMediaQuery, useTheme, Avatar, Menu, MenuItem, Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import BoltIcon from '@mui/icons-material/Bolt';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

/**
 * Top-level array defining primary client traversal map within the header.
 */
const navLinks = [
  { label: 'Home',       path: '/'        },
  { label: 'Events',     path: '/events'  },
  { label: 'Venues',     path: '/venues'  },
  { label: 'My Bookings',path: '/bookings'},
];

/**
 * Derives a maximum two-character moniker from a string Name or Email constraint.
 */
const getInitials = (name) =>
  name?.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2) || '?';

/**
 * Main persistent navigation orchestrator sitting at the top of the Document Object Model.
 */
export default function Navbar() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const theme     = useTheme();
  
  // Identifies viewport intersections for mobile UI morphing
  const isMobile  = useMediaQuery(theme.breakpoints.down('md'));
  
  const { user, isAdmin, doLogout } = useAuth();

  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [anchorEl, setAnchorEl]       = useState(null);
  const userMenuOpen = Boolean(anchorEl);

  /**
   * Identifies exact-path equivalence to force 'active' highlight states.
   */
  const isActive = (path) => location.pathname === path;

  /**
   * Resets local session and cascades destruction to AuthContext.
   */
  const handleLogout = async () => {
    setAnchorEl(null);
    await doLogout();
    toast.info('Signed out');
    navigate('/login');
  };

  /**
   * Helper abstracting identical styling properties for core buttons.
   */
  const btnSx = (active) => ({
    fontFamily: 'Outfit, sans-serif',
    fontWeight: 500,
    fontSize: '0.9rem',
    color: active ? '#6366F1' : '#4B5563',
    borderRadius: '8px',
    px: 2, py: 0.75,
    background: active ? 'rgba(99,102,241,0.08)' : 'transparent',
    textTransform: 'none',
    '&:hover': { background: 'rgba(99,102,241,0.06)', color: '#6366F1' },
    transition: 'all 0.2s',
  });

  
  const onAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: onAuthPage ? 'transparent' : 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          borderBottom: onAuthPage ? 'none' : '1px solid rgba(99,102,241,0.12)',
          color: onAuthPage ? '#F8FAFC' : '#111827',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 4 }, py: 1 }}>
          {/* Logo Platform Segment */}
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', mr: 4 }}>
            <Box sx={{ width: 34, height: 34, borderRadius: '10px', background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BoltIcon sx={{ color: '#fff', fontSize: 20 }} />
            </Box>
            <Typography sx={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: onAuthPage ? '#F8FAFC' : '#111827', letterSpacing: '-0.02em' }}>
              Event<span style={{ color: '#6366F1' }}>Zen</span>
            </Typography>
          </Box>

          {/* Desktop-oriented Navigation Traversal Array */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', flex: 1 }}>
              {navLinks.map(({ label, path }) => (
                <Button key={path} component={Link} to={path} sx={btnSx(isActive(path))}>
                  {label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isMobile && isAdmin && (
              <Button component={Link} to="/admin"
                sx={{ ...btnSx(location.pathname.startsWith('/admin')), color: '#8B5CF6', fontWeight: 600 }}>
                Admin
              </Button>
            )}

            {!isMobile && !user && (
              <>
                <Button component={Link} to="/login"
                  sx={{ fontFamily: 'Outfit', fontWeight: 600, textTransform: 'none', borderRadius: '8px', px: 2, color: '#4B5563', '&:hover': { bgcolor: 'rgba(99,102,241,0.06)' } }}>
                  Sign In
                </Button>
                <Button component={Link} to="/register" variant="contained"
                  sx={{ fontFamily: 'Outfit', fontWeight: 600, textTransform: 'none', borderRadius: '10px', px: 2.5, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 4px 14px rgba(99,102,241,0.35)', '&:hover': { boxShadow: '0 6px 20px rgba(99,102,241,0.45)', transform: 'translateY(-1px)' }, transition: 'all 0.2s' }}>
                  Register
                </Button>
              </>
            )}

            {!isMobile && user && (
              <>
                <Avatar
                  onClick={e => setAnchorEl(e.currentTarget)}
                  sx={{ width: 36, height: 36, bgcolor: '#6366F1', fontFamily: 'Syne', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', border: '2px solid rgba(99,102,241,0.2)', '&:hover': { border: '2px solid #6366F1' }, transition: 'border 0.2s' }}
                >
                  {getInitials(user.name || user.email)}
                </Avatar>
                <Menu
                  anchorEl={anchorEl} open={userMenuOpen} onClose={() => setAnchorEl(null)}
                  PaperProps={{ sx: { borderRadius: '14px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', minWidth: 200, mt: 1, border: '1px solid #F1F5F9' } }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #F1F5F9' }}>
                    <Typography sx={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>{user.name || 'User'}</Typography>
                    <Typography sx={{ fontFamily: 'Outfit', fontSize: '0.78rem', color: '#9CA3AF' }}>{user.email}</Typography>
                  </Box>
                  <MenuItem component={Link} to="/profile" onClick={() => setAnchorEl(null)}
                    sx={{ fontFamily: 'Outfit', fontSize: '0.9rem', color: '#374151', py: 1.25, '&:hover': { bgcolor: 'rgba(99,102,241,0.06)', color: '#6366F1' } }}>
                    <PersonIcon sx={{ fontSize: 18, mr: 1.5, color: '#6366F1' }} /> My Profile
                  </MenuItem>
                  {isAdmin && (
                    <MenuItem component={Link} to="/admin" onClick={() => setAnchorEl(null)}
                      sx={{ fontFamily: 'Outfit', fontSize: '0.9rem', color: '#374151', py: 1.25, '&:hover': { bgcolor: 'rgba(139,92,246,0.06)', color: '#8B5CF6' } }}>
                      <BoltIcon sx={{ fontSize: 18, mr: 1.5, color: '#8B5CF6' }} /> Admin Panel
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem onClick={handleLogout}
                    sx={{ fontFamily: 'Outfit', fontSize: '0.9rem', color: '#EF4444', py: 1.25, '&:hover': { bgcolor: 'rgba(239,68,68,0.06)' } }}>
                    <LogoutIcon sx={{ fontSize: 18, mr: 1.5 }} /> Sign Out
                  </MenuItem>
                </Menu>
              </>
            )}

            {isMobile && (
              <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: onAuthPage ? '#F8FAFC' : '#111827' }}>
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Side-swipe Drawer Implementation for restricted viewports */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 288, p: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography sx={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem' }}>
            Event<span style={{ color: '#6366F1' }}>Zen</span>
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)}><CloseIcon /></IconButton>
        </Box>

        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: '#F8FAFC', borderRadius: '12px', mb: 2 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#6366F1', fontFamily: 'Syne', fontWeight: 700, fontSize: '0.75rem' }}>
              {getInitials(user.name || user.email)}
            </Avatar>
            <Box>
              <Typography sx={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: '0.88rem', color: '#111827' }}>{user.name}</Typography>
              <Typography sx={{ fontFamily: 'Outfit', fontSize: '0.75rem', color: '#9CA3AF' }}>{user.email}</Typography>
            </Box>
          </Box>
        )}

        <List disablePadding>
          {[
            ...navLinks,
            ...(isAdmin ? [{ label: 'Admin Panel', path: '/admin' }] : []),
            ...(user
              ? [{ label: 'My Profile', path: '/profile' }]
              : [{ label: 'Sign In', path: '/login' }, { label: 'Register', path: '/register' }]
            ),
          ].map(({ label, path }) => (
            <ListItem key={path} disablePadding>
              <ListItemButton component={Link} to={path} onClick={() => setDrawerOpen(false)}
                sx={{ borderRadius: '10px', mb: 0.5, background: isActive(path) ? 'rgba(99,102,241,0.08)' : 'transparent', color: isActive(path) ? '#6366F1' : '#374151' }}>
                <ListItemText primary={label} primaryTypographyProps={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500, fontSize: '0.95rem' }} />
              </ListItemButton>
            </ListItem>
          ))}
          {user && (
            <ListItem disablePadding>
              <ListItemButton onClick={() => { setDrawerOpen(false); handleLogout(); }}
                sx={{ borderRadius: '10px', color: '#EF4444', '&:hover': { bgcolor: 'rgba(239,68,68,0.06)' } }}>
                <LogoutIcon sx={{ fontSize: 18, mr: 1.5 }} />
                <ListItemText primary="Sign Out" primaryTypographyProps={{ fontFamily: 'Outfit', fontWeight: 500 }} />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Drawer>
    </>
  );
}
