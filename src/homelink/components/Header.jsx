import React, { useEffect, useRef, useState } from 'react';
import { Bell, Bookmark, ChevronDown, Home, LogIn, LogOut, Menu, MessageCircle, Moon, Plus, Repeat2, Search, Sun, UserRound, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import LocationPicker from './LocationPicker';

export default function Header() {
  const { currentRoute, navigate, currentUser, logoutUser, setAuthModalOpen, unreadNotificationsCount, selectedCity } = useApp();
  const [isDark, setIsDark] = useState(() => localStorage.getItem('homelink_theme') === 'dark');
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef(null);
  const isAuthenticated = currentUser && currentUser.name !== 'Guest User' && currentUser.trustLevel !== 'Unverified Guest';

  useEffect(() => { document.documentElement.classList.toggle('dark', isDark); localStorage.setItem('homelink_theme', isDark ? 'dark' : 'light'); }, [isDark]);
  useEffect(() => { const close = (event) => { if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false); }; document.addEventListener('mousedown', close); return () => document.removeEventListener('mousedown', close); }, []);

  const nav = [{ id: 'dashboard', label: 'Home' }, { id: 'rentals', label: 'Find a home' }, { id: 'roommates', label: 'Find a flatmate' }, { id: 'chat', label: 'Chats' }];
  const openChat = () => { if (isAuthenticated) navigate('chat'); else setAuthModalOpen(true); };
  const isActive = (id) => currentRoute === id || (id === 'rentals' && ['rental-detail', 'rental-filters', 'compare'].includes(currentRoute)) || (id === 'roommates' && ['roommate-detail', 'connections'].includes(currentRoute));

  return <header className="hl-header"><div className="hl-container hl-header-inner">
    <button className="hl-brand" onClick={() => navigate('dashboard')} aria-label="HomeLink home"><span className="hl-brand-mark"><Home size={17} fill="currentColor" /></span><span>Home<span>Link</span><small>VERIFIED HOUSING</small></span></button>
    <div className="hl-header-location"><LocationPicker variant="pill" /><span className="hl-location-divider" /> <span>{selectedCity && selectedCity !== 'All Cities' ? selectedCity : 'Across India'}</span></div>
    <nav className="hl-desktop-nav">{nav.map((item) => <button key={item.id} className={isActive(item.id) ? 'is-active' : ''} onClick={() => item.id === 'chat' ? openChat() : navigate(item.id)}>{item.label}</button>)}{isAuthenticated && <button className="hl-nav-cta" onClick={() => navigate('list-property')}><Plus size={15} /> List your place</button>}</nav>
    <div className="hl-header-actions"><button className="hl-header-icon" onClick={() => setIsDark((value) => !value)} aria-label="Toggle theme">{isDark ? <Sun size={17} /> : <Moon size={17} />}</button><button className="hl-header-icon hl-notification" onClick={() => navigate('notifications')} aria-label="Notifications"><Bell size={17} />{unreadNotificationsCount > 0 && <i>{unreadNotificationsCount}</i>}</button><button className="hl-header-icon" onClick={() => navigate('saved')} aria-label="Saved homes"><Bookmark size={17} /></button>{isAuthenticated ? <div className="hl-account-wrap" ref={menuRef}><button className="hl-account" onClick={() => setMenuOpen((v) => !v)}><span>{currentUser.name?.[0] || 'U'}</span><ChevronDown size={14} /></button>{menuOpen && <div className="hl-account-menu"><strong>{currentUser.name}</strong><small>{currentUser.role || 'Verified member'}</small><button onClick={() => { setMenuOpen(false); navigate('profile'); }}><UserRound size={15} /> My profile</button><button onClick={() => { setMenuOpen(false); navigate('owner-dashboard'); }}><Home size={15} /> Owner dashboard</button><button onClick={() => { setMenuOpen(false); logoutUser(); setAuthModalOpen(true); }}><Repeat2 size={15} /> Switch account</button><button className="hl-account-danger" onClick={() => { setMenuOpen(false); logoutUser(); }}><LogOut size={15} /> Logout</button></div>}</div> : <button className="hl-sign-in" onClick={() => setAuthModalOpen(true)}><LogIn size={15} /><span>Sign in</span></button>}</div>
    <button className="hl-mobile-menu" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu">{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button>
  </div>{mobileOpen && <div className="hl-mobile-panel"><button onClick={() => { navigate('dashboard'); setMobileOpen(false); }}><Search size={16} /> Home</button><button onClick={() => { navigate('rentals'); setMobileOpen(false); }}>Find a home</button><button onClick={() => { navigate('roommates'); setMobileOpen(false); }}>Find a flatmate</button><button onClick={() => { openChat(); setMobileOpen(false); }}><MessageCircle size={16} /> Chats</button><button onClick={() => { navigate('safety'); setMobileOpen(false); }}>Trust & safety</button>{isAuthenticated ? <><button onClick={() => { navigate('profile'); setMobileOpen(false); }}><UserRound size={16} /> My profile</button><button onClick={() => { setMobileOpen(false); logoutUser(); setAuthModalOpen(true); }}><Repeat2 size={16} /> Switch account</button><button className="hl-mobile-logout" onClick={() => { setMobileOpen(false); logoutUser(); }}><LogOut size={16} /> Logout</button></> : <button onClick={() => { setMobileOpen(false); setAuthModalOpen(true); }}><LogIn size={16} /> Sign in</button>}</div>}</header>;
}
