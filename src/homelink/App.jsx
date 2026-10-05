import React, { Suspense, lazy, useEffect } from 'react';
import { useApp } from './context/AppContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import AuthModal from './components/AuthModal';
import ReportModal from './components/ReportModal';
import CompareToast from './components/CompareToast';
import DashboardView from './views/DashboardView';

const WelcomeView = lazy(() => import('./views/WelcomeView'));
const RentalsView = lazy(() => import('./views/RentalsView'));
const RentalFiltersView = lazy(() => import('./views/RentalFiltersView'));
const RentalDetailView = lazy(() => import('./views/RentalDetailView'));
const CompareView = lazy(() => import('./views/CompareView'));
const ListPropertyWizardView = lazy(() => import('./views/ListPropertyWizardView'));
const OwnerDashboardView = lazy(() => import('./views/OwnerDashboardView'));
const FeaturedListingView = lazy(() => import('./views/FeaturedListingView'));
const RoommatesView = lazy(() => import('./views/RoommatesView'));
const RoommateDetailView = lazy(() => import('./views/RoommateDetailView'));
const RoommateRequestsView = lazy(() => import('./views/RoommateRequestsView'));
const ChatView = lazy(() => import('./views/ChatView'));
const SavedView = lazy(() => import('./views/SavedView'));
const NotificationsView = lazy(() => import('./views/NotificationsView'));
const ProfileView = lazy(() => import('./views/ProfileView'));
const SafetyView = lazy(() => import('./views/SafetyView'));

function Loading() { return <div className="hl-loading"><span className="hl-brand-mark"><span>⌂</span></span><p>Loading HomeLink…</p></div>; }

export default function App() {
  const { currentRoute, currentUser, navigate } = useApp();
  const authenticated = currentUser && currentUser.name !== 'Guest User' && currentUser.trustLevel !== 'Unverified Guest';
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [currentRoute]);
  useEffect(() => {
    try {
      const key = 'homelink_traffic';
      const events = JSON.parse(localStorage.getItem(key) || '[]');
      events.push({ path: `/${currentRoute}`, at: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(events.slice(-500)));
    } catch {}
  }, [currentRoute]);
  useEffect(() => {
    if (!authenticated && currentRoute === 'chat') {
      navigate('welcome');
    } else if (!authenticated && ['owner-dashboard', 'list-property', 'featured-plans'].includes(currentRoute)) {
      navigate('dashboard');
    }
  }, [currentRoute, authenticated]);
  const views = { welcome: WelcomeView, rentals: RentalsView, 'rental-filters': RentalFiltersView, 'rental-detail': RentalDetailView, compare: CompareView, 'list-property': ListPropertyWizardView, 'owner-dashboard': OwnerDashboardView, 'featured-plans': FeaturedListingView, roommates: RoommatesView, 'roommate-detail': RoommateDetailView, connections: RoommateRequestsView, 'roommate-requests': RoommateRequestsView, chat: ChatView, saved: SavedView, notifications: NotificationsView, profile: ProfileView, safety: SafetyView };
  const View = currentRoute === 'dashboard' ? DashboardView : (views[currentRoute] || DashboardView);
  return <div className="hl-app"><Header /><main className="hl-main"><Suspense fallback={<Loading />}><View /></Suspense></main><BottomNav /><CompareToast /><AuthModal /><ReportModal /></div>;
}
