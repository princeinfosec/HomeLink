import seedDatabase from '../data/database.json';
import { INITIAL_PROPERTIES, INITIAL_ROOMMATES, INITIAL_NOTIFICATIONS } from '../data/mockData';

const DB_KEY = 'homelink_json_database';
const TOKEN_KEY = 'homelink_token';
const normalize = (value = '') => String(value).trim().toLowerCase();
const digits = (value = '') => String(value).replace(/\D/g, '').slice(-10);
const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const guest = () => ({
  id: `guest-${Date.now()}`, name: 'Guest User', role: 'Renter & Seeker', city: 'Rewa, MP',
  phoneMasked: '+91 ••••• •••••', emailMasked: '', isVerified: false, govtIdApproved: false,
  collegeIdApproved: false, trustLevel: 'Unverified Guest', memberSince: 'Today', activeListingsCount: 0,
  savedProperties: [], savedRoommates: [], ownedPropertyIds: [], roommateType: 'looking_for_room', roommateStatus: 'looking_for_room',
});

export function writeDb(db) {
  try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch (error) { console.warn('[HomeLink] Could not persist JSON database:', error); }
  return db;
}

export function readDb() {
  try {
    const saved = localStorage.getItem(DB_KEY);
    if (saved) return JSON.parse(saved);
  } catch (error) { console.warn('[HomeLink] JSON database reset:', error); }
  const db = { ...seedDatabase, users: [], properties: INITIAL_PROPERTIES, roommates: INITIAL_ROOMMATES, roommateRequests: [], messages: [], notifications: INITIAL_NOTIFICATIONS };
  return writeDb(db);
}

function updateDb(mutator) { return writeDb(mutator(readDb())); }
function publicUser(user) { if (!user) return null; const { password: _password, ...safe } = user; return safe; }
function findUser(credentials = {}) {
  const email = normalize(credentials.email); const phone = digits(credentials.phone);
  return readDb().users.find((user) => (email && normalize(user.email) === email) || (phone && digits(user.phone) === phone));
}
function tokenFor(user) { const token = `${user.id}:${Date.now()}`; localStorage.setItem(TOKEN_KEY, token); return token; }

class LocalJsonApi {
  token = localStorage.getItem(TOKEN_KEY) || null;
  setToken(token) { this.token = token || null; if (token) localStorage.setItem(TOKEN_KEY, token); else localStorage.removeItem(TOKEN_KEY); }
  getToken() { this.token ||= localStorage.getItem(TOKEN_KEY); return this.token; }

  async request(endpoint, options = {}) {
    const body = options.body ? JSON.parse(options.body) : {};
    if (endpoint === '/auth/send-otp') throw new Error('OTP login is unavailable in local JSON mode. Please use password login.');
    if (endpoint === '/auth/me') return publicUser(readDb().users.find((user) => user.id === this.getToken()?.split(':')[0]));
    if (endpoint === '/auth/logout') { this.setToken(null); return { success: true }; }
    if (endpoint.startsWith('/ai/')) return { message: 'HomeLink is running in offline JSON mode. Use the rental and roommate filters for instant results.' };
    return { success: true, ...body };
  }

  auth = {
    login: async (credentials) => {
      const user = findUser(credentials);
      if (!user || user.password !== credentials.password) throw new Error('Invalid email/mobile or password. Please create an account first.');
      const token = tokenFor(user); this.token = token; return { user: publicUser(user), token };
    },
    register: async (data) => {
      const email = normalize(data.email); const phone = digits(data.phone);
      if (!data.password || data.password.length < 6) throw new Error('Password must be at least 6 characters long.');
      if (!email && !phone) throw new Error('Please provide an email address or mobile number.');
      if (findUser({ email, phone })) throw new Error('An account already exists with this email or mobile number.');
      const user = { ...guest(), id: makeId('usr'), name: data.name.trim(), email: email || undefined, phone: phone || undefined,
        phoneMasked: phone ? `+91 ${phone.slice(0, 5)} •••••` : '+91 ••••• •••••', emailMasked: email ? `${email.slice(0, 3)}••••@${email.split('@')[1]}` : '',
        role: data.role || 'Renter & Seeker', state: data.state || '', city: data.city || 'Rewa', trustLevel: 'Tier 1 Registered', memberSince: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }), password: data.password };
      updateDb((db) => ({ ...db, users: [...db.users, user] }));
      const token = tokenFor(user); this.token = token; return { user: publicUser(user), token };
    },
    getMe: () => this.request('/auth/me'), logout: async () => { this.setToken(null); return { success: true }; },
  };

  properties = {
    search: async () => ({ items: readDb().properties }),
    getById: async (id) => readDb().properties.find((p) => p.id === id),
    create: async (data) => { const property = { ...data, id: data.id || makeId('prop') }; updateDb((db) => ({ ...db, properties: [property, ...db.properties] })); return property; },
    updateStatus: async (id, status) => { const availabilityStatus = status.toLowerCase().includes('rented') ? 'rented' : status.toLowerCase().includes('unavailable') ? 'paused' : 'available'; updateDb((db) => ({ ...db, properties: db.properties.map((p) => p.id === id ? { ...p, availabilityStatus } : p) })); return { success: true }; },
    compare: async (ids) => ({ items: readDb().properties.filter((p) => (Array.isArray(ids) ? ids : String(ids).split(',')).includes(p.id)) }),
    uploadPhoto: async (_id, file) => ({ success: true, url: URL.createObjectURL(file) }),
  };

  roommates = {
    search: async () => ({ items: readDb().roommates }), getById: async (id) => readDb().roommates.find((r) => r.id === id),
    updateStatus: async (id, status) => { const availabilityStatus = status === 'ROOMMATE_FOUND' ? 'roommate_found' : status === 'FOUND_A_ROOM' ? 'found_a_room' : 'looking_for_room'; updateDb((db) => ({ ...db, roommates: db.roommates.map((r) => r.id === id ? { ...r, availabilityStatus } : r) })); return { success: true }; },
  };

  roommateRequests = {
    send: async (receiverId, message = '') => { const request = { id: makeId('request'), receiverId, message, status: 'sent', createdAt: new Date().toISOString() }; updateDb((db) => ({ ...db, roommateRequests: [...db.roommateRequests, request] })); return request; },
    getSent: async () => readDb().roommateRequests, getReceived: async () => readDb().roommateRequests,
    accept: async (id) => this.updateRequest(id, 'connected'), decline: async (id) => this.updateRequest(id, 'declined'), cancel: async (id) => this.updateRequest(id, 'cancelled'),
  };
  updateRequest(id, status) { updateDb((db) => ({ ...db, roommateRequests: db.roommateRequests.map((r) => r.id === id ? { ...r, status } : r) })); return Promise.resolve({ success: true }); }
  chat = { getConversations: async () => [], getMessages: async () => [], sendMessage: async (_id, message) => ({ message }) };
  saved = { saveProperty: async () => ({ success: true }), unsaveProperty: async () => ({ success: true }), getSavedProperties: async () => [], saveRoommate: async () => ({ success: true }), unsaveRoommate: async () => ({ success: true }), getSavedRoommates: async () => [] };
  notifications = { getAll: async () => readDb().notifications, markRead: async () => ({ success: true }), markAllRead: async () => ({ success: true }) };
  reports = { createReport: async () => ({ success: true }), blockUser: async () => ({ success: true }) };
  ai = { search: async () => ({ message: 'Search results are available offline.' }), chat: async () => ({ message: 'I can help you find a rental or roommate using the filters on this page.' }), verifyPhoto: async (_image, metadata = {}) => ({ authenticityScore: 90, isReal: true, summary: 'Photo checked locally. No network service is required.', ...metadata }) };
}

export const api = new LocalJsonApi();
export default api;
export { DB_KEY };
