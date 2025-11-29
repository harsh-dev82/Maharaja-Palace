import axios from 'axios';

const API_BASE_URL = 'https://maharaja-palace.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  getAllUsers: () => api.get('/auth/users'),
};

// Room APIs
export const roomAPI = {
  getRoomTypes: () => api.get('/rooms/room-types'),
  getAvailableRooms: (params) => api.get('/rooms/available', { params }),
  getAllRooms: () => api.get('/rooms'),
  getRoomById: (id) => api.get(`/rooms/${id}`),
  createRoom: (data) => api.post('/rooms', data),
  updateRoomStatus: (id, status) => api.put(`/rooms/${id}/status`, { status }),
};

// Booking APIs
export const bookingAPI = {
  createBooking: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/me'),
  getBookingDetails: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
};

// Banquet APIs
export const banquetAPI = {
  getAllHalls: () => api.get('/banquet/halls'),
  getHallById: (id) => api.get(`/banquet/halls/${id}`),
  createHall: (data) => api.post('/banquet/halls', data),
  createBooking: (data) => api.post('/banquet/bookings', data),
  getAllBookings: () => api.get('/banquet/bookings'),
  getMyBookings: () => api.get('/banquet/bookings/me'),
};

// Restaurant APIs
export const restaurantAPI = {
  getAllTables: () => api.get('/restaurant/tables'),
  getTableById: (id) => api.get(`/restaurant/tables/${id}`),
  createTable: (data) => api.post('/restaurant/tables', data),
  createBooking: (data) => api.post('/restaurant/bookings', data),
  getAllBookings: () => api.get('/restaurant/bookings'),
  getMyBookings: () => api.get('/restaurant/bookings/me'),
};

export default api;
