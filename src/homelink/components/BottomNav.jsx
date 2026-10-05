import React from 'react';
import { Bookmark, Home, MessageCircle, Plus, UserRound, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function BottomNav() {
  const { currentRoute, navigate, currentUser, setAuthModalOpen } = useApp();
  const authenticated = currentUser && currentUser.name !== 'Guest User' && currentUser.trustLevel !== 'Unverified Guest';
  const items = [{ id: 'dashboard', label: 'Home', icon: Home }, { id: 'rentals', label: 'Rooms', icon: Bookmark }, { id: 'list-property', label: 'List', icon: Plus }, { id: 'roommates', label: 'Flatmates', icon: Users }, { id: 'chat', label: 'Chats', icon: MessageCircle }, { id: 'profile', label: 'Profile', icon: UserRound }];
  return <nav className="hl-bottom-nav">{items.map(({ id, label, icon: Icon }) => { const active = currentRoute === id || (id === 'rentals' && ['rental-detail', 'rental-filters'].includes(currentRoute)) || (id === 'roommates' && currentRoute === 'roommate-detail'); return <button key={id} className={active ? 'is-active' : ''} onClick={() => { if ((id === 'list-property' || id === 'chat') && !authenticated) setAuthModalOpen(true); else navigate(id); }}><span><Icon size={id === 'list-property' ? 20 : 18} /></span><small>{label}</small></button>; })}</nav>;
}
