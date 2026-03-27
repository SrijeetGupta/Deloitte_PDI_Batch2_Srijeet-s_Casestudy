import { createContext, useContext, useState, useEffect } from 'react';
import { getAllEvents, getAllVenues, getUserBookings, getAllBookingsAdmin } from '../api/api';

/**
 * Application Context designed to store and distribute global application data.
 * It caches Events, Venues, and Bookings so components don't repeatedly fetch them.
 */
const AppContext = createContext();

/**
 * Provider component that pre-fetches and maintains the core data state of the application.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components wrapped in the context
 */
export const AppProvider = ({ children }) => {
  // Global data storage arrays
  const [events,        setEvents]        = useState([]);
  const [venues,        setVenues]        = useState([]);
  const [bookings,      setBookings]      = useState([]);
  const [adminBookings, setAdminBookings] = useState([]);
  
  // Loading indicators for major data entities to show UI skeletons or spinners
  const [loading, setLoading] = useState({ events: false, venues: false, bookings: false });

  /**
   * Fetches the master list of all available events from the backend API.
   */
  const fetchEvents = async () => {
    setLoading(l => ({ ...l, events: true }));
    try { 
      const r = await getAllEvents(); 
      setEvents(r.data); 
    } catch (e) { 
      console.error('fetchEvents', e); 
    } finally { 
      setLoading(l => ({ ...l, events: false })); 
    }
  };

  /**
   * Fetches the complete list of venues, potentially scoped by URL params.
   * 
   * @param {Object} params - Optional query parameters (e.g. search, pagination)
   */
  const fetchVenues = async (params) => {
    setLoading(l => ({ ...l, venues: true }));
    try { 
      const r = await getAllVenues(params); 
      setVenues(r.data); 
    } catch (e) { 
      console.error('fetchVenues', e); 
    } finally { 
      setLoading(l => ({ ...l, venues: false })); 
    }
  };

  /**
   * Fetches only the bookings which belong directly to the currently authenticated user.
   */
  const fetchBookings = async () => {
    setLoading(l => ({ ...l, bookings: true }));
    try { 
      const r = await getUserBookings(); 
      setBookings(r.data); 
    } catch (e) { 
      console.error('fetchBookings', e); 
    } finally { 
      setLoading(l => ({ ...l, bookings: false })); 
    }
  };

  /**
   * Fetches every single booking systematically across the entire application.
   * Restricted strictly to users with Admin roles.
   */
  const fetchAdminBookings = async () => {
    try { 
      const r = await getAllBookingsAdmin(); 
      setAdminBookings(r.data); 
    } catch (e) { 
      console.error('fetchAdminBookings', e); 
    }
  };

  // Pre-load essential data immediately when the application launches
  useEffect(() => {
    fetchEvents();
    fetchVenues();
    fetchBookings();
  }, []);

  return (
    <AppContext.Provider value={{
      events, setEvents, fetchEvents,
      venues, setVenues, fetchVenues,
      bookings, setBookings, fetchBookings,
      adminBookings, setAdminBookings, fetchAdminBookings,
      loading,
    }}>
      {children}
    </AppContext.Provider>
  );
};

/**
 * Custom React Hook to consume the AppContext efficiently.
 * 
 * @returns {Object} Complete payload containing state arrays, loading flags, and fetch functions.
 */
export const useApp = () => useContext(AppContext);
