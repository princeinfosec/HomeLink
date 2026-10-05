import React, { useMemo, useState } from 'react';
import { ArrowRight, BadgeCheck, BedDouble, Building2, ChevronRight, Heart, Home, MapPin, MessageCircle, Search, ShieldCheck, SlidersHorizontal, Sparkles, Users, WalletCards } from 'lucide-react';
import { useApp } from '../context/AppContext';
import LocationPicker from '../components/LocationPicker';

const formatRent = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

function QuickAction({ icon: Icon, eyebrow, title, description, tone = 'coral', onClick }) {
  return (
    <button className={`hl-quick-action hl-tone-${tone}`} onClick={onClick}>
      <span className="hl-quick-icon"><Icon size={18} strokeWidth={2.1} /></span>
      <span className="hl-quick-copy"><span className="hl-eyebrow">{eyebrow}</span><strong>{title}</strong><small>{description}</small></span>
      <ChevronRight size={16} className="hl-quick-arrow" />
    </button>
  );
}

function ListingCard({ property, onOpen, onSave }) {
  const [saved, setSaved] = useState(false);
  const image = property.images?.[0];
  const available = property.availabilityStatus !== 'rented';
  const toggleSave = (event) => {
    event.stopPropagation();
    setSaved((value) => !value);
    onSave?.(property.id);
  };

  return (
    <article className="hl-listing" onClick={() => onOpen(property)}>
      <div className="hl-listing-media">
        <img src={image} alt={property.title} loading="lazy" />
        <span className={`hl-status ${available ? 'is-available' : 'is-muted'}`}>{available ? 'Available now' : 'Recently rented'}</span>
        <button className={`hl-save ${saved ? 'is-saved' : ''}`} onClick={toggleSave} aria-label={saved ? 'Remove saved listing' : 'Save listing'}><Heart size={17} fill={saved ? 'currentColor' : 'none'} /></button>
        {property.isVerified && <span className="hl-verified"><BadgeCheck size={14} /> Verified</span>}
      </div>
      <div className="hl-listing-body">
        <div className="hl-listing-topline"><span>{property.propertyType || property.bhk}</span><span className="hl-rating">★ {property.rating || '4.8'}</span></div>
        <h3>{property.title}</h3>
        <p className="hl-listing-place"><MapPin size={14} /> {property.locality}</p>
        <div className="hl-listing-bottom"><strong>{formatRent(property.rent)}<small>/month</small></strong><span>{property.furnished || 'Ready to move'}</span></div>
      </div>
    </article>
  );
}

function RoommateRow({ roommate, onOpen }) {
  return (
    <button className="hl-roommate-row" onClick={() => onOpen(roommate)}>
      <img src={roommate.avatar} alt={roommate.name} />
      <span className="hl-roommate-info"><strong>{roommate.name}, {roommate.age}</strong><small>{roommate.occupation} · {roommate.locality}</small><span><WalletCards size={13} /> {roommate.budgetRange || roommate.budget}</span></span>
      <ArrowRight size={16} className="hl-row-arrow" />
    </button>
  );
}

export default function DashboardView() {
  const { currentUser, properties, roommates, navigate, rentalFilters, setRentalFilters, toggleSaveProperty } = useApp();
  const [intent, setIntent] = useState('rentals');
  const featuredProperties = useMemo(() => properties.filter((p) => p.isFeatured && p.availabilityStatus !== 'rented').slice(0, 3), [properties]);
  const activeRoommates = useMemo(() => roommates.filter((r) => r.availabilityStatus !== 'matched').slice(0, 3), [roommates]);

  const submitSearch = (event) => {
    event.preventDefault();
    navigate(intent === 'roommates' ? 'roommates' : 'rentals');
  };

  return (
    <div className="hl-page">
      <div className="hl-container">
        <section className="hl-welcome-row">
          <div>
            <p className="hl-kicker">{currentUser?.name && currentUser.name !== 'Guest User' ? `Good morning, ${currentUser.name.split(' ')[0]}` : 'A better way to move'}</p>
            <h1>Find a place that <em>fits your life.</em></h1>
          </div>
          <div className="hl-trust-note"><ShieldCheck size={18} /><span><strong>HomeLink SafeNet</strong><small>Verified homes · Direct owners · ₹0 brokerage</small></span></div>
        </section>

        <section className="hl-search-stage">
          <div className="hl-search-tabs" role="tablist" aria-label="Search category">
            <button className={intent === 'rentals' ? 'is-active' : ''} onClick={() => setIntent('rentals')}><Home size={15} /> Find a home</button>
            <button className={intent === 'roommates' ? 'is-active' : ''} onClick={() => setIntent('roommates')}><Users size={15} /> Find a flatmate</button>
          </div>
          <form className="hl-search-form" onSubmit={submitSearch}>
            <Search size={19} className="hl-search-icon" />
            <input value={rentalFilters.searchQuery} onChange={(e) => setRentalFilters((prev) => ({ ...prev, searchQuery: e.target.value }))} placeholder={intent === 'rentals' ? 'Search by area, landmark or college' : 'Search for a compatible flatmate'} aria-label="Search HomeLink" />
            <button type="button" className="hl-search-filter" onClick={() => navigate('rental-filters')}><SlidersHorizontal size={17} /><span>Filters</span></button>
            <button type="submit" className="hl-search-submit">Search <ArrowRight size={16} /></button>
          </form>
          <div className="hl-search-meta"><LocationPicker variant="field" className="hl-location-inline" /><span className="hl-search-tip"><Sparkles size={14} /> Try “furnished room near APSU under ₹5,000”</span></div>
        </section>

        <section className="hl-quick-grid" aria-label="HomeLink shortcuts">
          <QuickAction icon={Building2} eyebrow="Explore" title="Verified rentals" description="Homes with direct contact" onClick={() => navigate('rentals')} />
          <QuickAction icon={Users} eyebrow="Connect" title="Compatible flatmates" description="People looking for a room" tone="sage" onClick={() => navigate('roommates')} />
          <QuickAction icon={BedDouble} eyebrow="List free" title="Rent your room" description="No brokerage, no hassle" tone="ink" onClick={() => navigate('list-property')} />
        </section>

        <div className="hl-content-grid">
          <section className="hl-section-block">
            <div className="hl-section-heading"><div><p className="hl-kicker">Curated for you</p><h2>Stays worth a look</h2></div><button className="hl-text-button" onClick={() => navigate('rentals')}>View all <ArrowRight size={15} /></button></div>
            <div className="hl-listing-grid">{featuredProperties.map((property) => <ListingCard key={property.id} property={property} onOpen={(item) => navigate('rental-detail', { propertyId: item.id })} onSave={toggleSaveProperty} />)}</div>
          </section>

          <aside className="hl-side-rail">
            <div className="hl-rail-card hl-rail-card-dark"><div className="hl-rail-icon"><MessageCircle size={18} /></div><p className="hl-kicker">Need a second opinion?</p><h3>Compare your top stays before you decide.</h3><button onClick={() => navigate('rentals')}>Browse homes <ArrowRight size={15} /></button></div>
            <div className="hl-rail-card"><div className="hl-section-heading"><div><p className="hl-kicker">People like you</p><h3>Flatmate matches</h3></div><button className="hl-icon-button" onClick={() => navigate('roommates')} aria-label="View all flatmates"><ArrowRight size={16} /></button></div><div className="hl-roommate-list">{activeRoommates.map((roommate) => <RoommateRow key={roommate.id} roommate={roommate} onOpen={(item) => navigate('roommate-detail', { roommateId: item.id })} />)}</div><button className="hl-rail-link" onClick={() => navigate('roommates')}>See all flatmate profiles <ArrowRight size={14} /></button></div>
          </aside>
        </div>

        <section className="hl-bottom-banner"><div className="hl-bottom-mark"><BadgeCheck size={22} /></div><div><p className="hl-kicker">The HomeLink promise</p><h2>Move with more clarity.</h2><p>Every listing is built for direct conversations, transparent rent and a safer way to find your next address.</p></div><button onClick={() => navigate('safety')}>How we keep it safe <ArrowRight size={15} /></button></section>
      </div>
    </div>
  );
}
