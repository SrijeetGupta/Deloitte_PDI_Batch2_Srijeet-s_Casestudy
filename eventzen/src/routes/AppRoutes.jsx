import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

// Standard Pages
import Home from '../pages/Home';
import EventList from '../pages/EventList';
import VenueList from '../pages/VenueList';
import BookingPage from '../pages/BookingPage';
import MyBookings from '../pages/MyBookings';
import AttendeePage from '../pages/AttendeePage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import UserProfile from '../pages/UserProfile';

// Administrative Dashboard Overlays
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageEvents from '../pages/admin/ManageEvents';
import ManageVenues from '../pages/admin/ManageVenues';
import ManageBookings from '../pages/admin/ManageBookings';
import ManageVendors from '../pages/admin/ManageVendors';
import ManageAvailability from '../pages/admin/ManageAvailability';
import AdminUsers from '../pages/admin/AdminUsers';

/**
 * Wrapper component orchestrating subtle fade-and-slide motion graphics 
 * across full-view page transitions.
 */
const Page = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

/**
 * Gatekeeper Route Component.
 * Implements strict navigational lock-outs depending on the user's current valid session token
 * and internal role designations.
 */
const Protected = ({ children, adminOnly = false }) => {
  const { user, isAdmin } = useAuth();
  
  // Eject entirely unauthenticated guests
  if (!user) return <Navigate to="/login" replace />;
  // Eject users attempting to traverse admin-exclusive domains
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  
  return children;
};

/**
 * Primary React Router DOM switchboard configuring URLs globally.
 */
export default function AppRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* Unrestricted Public Routes */}
        <Route path="/" element={<Page><Home /></Page>} />
        <Route path="/events" element={<Page><EventList /></Page>} />
        <Route path="/venues" element={<Page><VenueList /></Page>} />
        <Route path="/login" element={<Page><Login /></Page>} />
        <Route path="/register" element={<Page><Register /></Page>} />

        {/* Authenticated User Level Routes */}
        <Route path="/booking/:eventId" element={<Protected><Page><BookingPage /></Page></Protected>} />
        <Route path="/bookings" element={<Protected><Page><MyBookings /></Page></Protected>} />
        <Route path="/attendees/:bookingId" element={<Protected><Page><AttendeePage /></Page></Protected>} />
        <Route path="/profile" element={<Protected><Page><UserProfile /></Page></Protected>} />

        {/* System Administration Tier Routes */}
        <Route path="/admin" element={<Protected adminOnly><Page><AdminDashboard /></Page></Protected>} />
        <Route path="/admin/events" element={<Protected adminOnly><Page><ManageEvents /></Page></Protected>} />
        <Route path="/admin/venues" element={<Protected adminOnly><Page><ManageVenues /></Page></Protected>} />
        <Route path="/admin/bookings" element={<Protected adminOnly><Page><ManageBookings /></Page></Protected>} />
        <Route path="/admin/vendors" element={<Protected adminOnly><Page><ManageVendors /></Page></Protected>} />
        <Route path="/admin/availability" element={<Protected adminOnly><Page><ManageAvailability /></Page></Protected>} />
        <Route path="/admin/users" element={<Protected adminOnly><Page><AdminUsers /></Page></Protected>} />

        {/* Fallback Redirector */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
