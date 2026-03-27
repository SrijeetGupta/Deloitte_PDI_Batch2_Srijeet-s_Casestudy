import axios from 'axios';

/**
 * Standard user-facing API client.
 * Connects directly to the User Backend module running on port 8080.
 */
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Administrative-level API client.
 * Routes traffic to the dedicated Admin Backend module operating on port 8081.
 */
const adminApi = axios.create({
  baseURL: 'http://localhost:8081',
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Global request interceptor for standard API.
 * Automatically injects the JWT token from localStorage into the Authorization header.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Global request interceptor for admin-level API.
 * Identical authentication enforcement ensuring secure backend transactions.
 */
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- AUTHENTICATION ---
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const logout = () => api.post('/auth/logout');

// --- USER MANAGEMENT ---
export const getAllUsers = () => adminApi.get('/users');
export const getUserById = (id) => api.get(`/users/${id}`);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const makeUserAdmin = (id) => adminApi.put(`/users/${id}/admin`);

// --- EVENT MANAGEMENT ---
export const getAllEvents = () => api.get('/events');
export const getEventById = (id) => api.get(`/events/${id}`);
export const createEvent = (data) => api.post('/events', data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);

// --- BOOKING OPERATIONS ---
export const createBooking = (data) => api.post('/bookings', data);
export const getUserBookings = () => api.get('/bookings');
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`);

// --- ADMIN BOOKING MANAGEMENT ---
export const getAllBookingsAdmin = () => api.get('/admin/bookings');
export const approveBooking = (id) => api.put(`/admin/bookings/${id}/approve`);
export const rejectBooking = (id) => api.put(`/admin/bookings/${id}/reject`);

// --- VENUE MANAGEMENT ---
export const getAllVenues = (params) => api.get('/venues', { params });
export const getVenueById = (id) => api.get(`/venues/${id}`);
export const createVenue = (data) => adminApi.post('/venues', data);
export const updateVenue = (id, data) => api.put(`/venues/${id}`, data);
export const deleteVenue = (id) => api.delete(`/venues/${id}`);

// --- VENUE AVAILABILITY ---
export const getAvailability = (venueId, date) =>
  api.get(`/venues/${venueId}/availability`, { params: date ? { date } : {} });
export const updateAvailability = (venueId, date, status) =>
  api.put(`/venues/${venueId}/availability`, null, { params: { date, status } });

// --- VENDOR MANAGEMENT ---
export const createVendor = (venueId, data) => api.post('/vendors', data, { params: { venueId } });
export const getVendors = (venueId) => api.get('/vendors', { params: { venueId } });
export const getVendorById = (id) => api.get(`/vendors/${id}`);
export const updateVendor = (id, data, venueId) => api.put(`/vendors/${id}`, data, { params: venueId ? { venueId } : {} });
export const deleteVendor = (id) => api.delete(`/vendors/${id}`);

// --- ATTENDEE MANAGEMENT ---
export const addAttendee = (bookingId, data) => api.post('/attendees', data, { params: { bookingId } });
export const getAttendees = (bookingId) => api.get('/attendees', { params: { bookingId } });
export const getAttendeeById = (id) => api.get(`/attendees/${id}`);
export const deleteAttendee = (id) => api.delete(`/attendees/${id}`);

export default api;
