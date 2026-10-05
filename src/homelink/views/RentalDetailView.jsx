import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import AvailabilityBadge from '../components/AvailabilityBadge';
import MarkAsRentedModal from '../components/MarkAsRentedModal';

export default function RentalDetailView() {
  const {
    routeParams,
    properties,
    currentUser,
    goBack,
    navigate,
    isPropertySaved,
    toggleSaveProperty,
    setReportModalOpen,
    setReportedTarget,
    isPropertyInCompare,
    addToCompare,
    removeFromCompare,
    reactivateProperty,
    markPropertyAsRented
  } = useApp();

  const propertyId = routeParams.propertyId || 'prop-1';
  const property = properties.find((p) => p.id === propertyId) || properties[0];

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [inquirySent, setInquirySent] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessage, setChatMessage] = useState('Hi, I am interested in this property. Is it still available?');
  const [chatSent, setChatSent] = useState(false);
  const [isRentedModalOpen, setIsRentedModalOpen] = useState(false);
  const touchStartX = useRef(null);

  const isOwner = currentUser?.ownedPropertyIds?.includes(property.id) || property.owner?.name === currentUser?.name;
  const status = property.availabilityStatus || 'available';
  const isAvailable = status === 'available';
  const isRented = status === 'rented';
  const isPaused = status === 'paused';
  const maintenanceAmount = Number(String(property.maintenance || '').replace(/[^\d.]/g, '')) || 0;
  const monthlyTotal = property.rent + maintenanceAmount;

  const saved = isPropertySaved(property.id);
  const inCompare = isPropertyInCompare(property.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this verified rental on HomeLink in Rewa: ${property.title} for ₹${property.rent}/mo.`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('Listing link copied to clipboard!');
    }
  };

  const handleBookVisit = () => {
    setInquirySent(true);
    setTimeout(() => {
      alert(`Visit requested! Owner ${property.owner?.name} has been notified via Rewa SafeNet. They typically respond within ${property.owner?.responseRate || '30 mins'}.`);
    }, 400);
  };

  const handleReport = () => {
    setReportedTarget({ type: 'Listing', id: property.id, title: property.title });
    setReportModalOpen(true);
  };

  const handleGalleryTouchStart = (event) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleGalleryTouchEnd = (event) => {
    if (touchStartX.current === null || !property.images?.length) return;
    const delta = event.changedTouches[0]?.clientX - touchStartX.current;
    if (Math.abs(delta) > 45) {
      setActivePhotoIdx((current) => (current + (delta < 0 ? 1 : -1) + property.images.length) % property.images.length);
    }
    touchStartX.current = null;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6 pb-[10.5rem] md:pb-16">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('dashboard')}
            className="w-10 h-10 rounded-2xl bg-[#00A88E] text-white flex items-center justify-center shadow-md shadow-[#00A88E]/25 hover:bg-[#006b5a] hover:-translate-y-0.5 transition-all cursor-pointer"
            title="Go to Home"
            aria-label="Go to Home"
          >
            <span className="material-symbols-outlined text-xl">home</span>
          </button>
          <button
          onClick={goBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span>Back</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Compare Button */}
          <button
            onClick={() => inCompare ? removeFromCompare(property.id) : addToCompare(property.id)}
            aria-label={inCompare ? 'Remove property from comparison' : 'Add property to comparison'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              inCompare
                ? 'bg-[#00A88E] text-white shadow-sm'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
            }`}
            title={inCompare ? '✓ In Comparison (Click to remove)' : 'Add to Compare'}
          >
            <span className="material-symbols-outlined text-base">
              {inCompare ? 'check' : 'compare_arrows'}
            </span>
            <span>{inCompare ? 'In Compare' : 'Compare'}</span>
          </button>

          <button
            onClick={handleShare}
            aria-label="Share this property"
            className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors cursor-pointer"
            title="Share"
          >
            <span className="material-symbols-outlined text-lg">share</span>
          </button>
          <button
            onClick={() => toggleSaveProperty(property.id)}
            aria-label={saved ? 'Remove property bookmark' : 'Bookmark this property'}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              saved ? 'bg-rose-500 text-white' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
            }`}
            title="Bookmark"
          >
            <span className={`material-symbols-outlined text-lg ${saved ? 'fill-current' : ''}`}>
              favorite
            </span>
          </button>
        </div>
      </div>

      {/* Availability Status Banner if Rented or Paused */}
      {isRented && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">cancel</span>
            </div>
            <div>
              <h4 className="font-black text-rose-800 text-sm">
                Property Marked as Rented
              </h4>
              <p className="text-rose-600 text-[11px] mt-0.5">
                This listing has been rented and is no longer appearing in search results or accepting new requests.
              </p>
            </div>
          </div>

          {isOwner && (
            <button
              onClick={() => reactivateProperty(property.id)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-xs cursor-pointer shrink-0 self-start sm:self-auto flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">replay</span>
              <span>Reactivate Listing</span>
            </button>
          )}
        </div>
      )}

      {isPaused && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">pause_circle</span>
            </div>
            <div>
              <h4 className="font-black text-amber-800 text-sm">
                Listing Temporarily Paused
              </h4>
              <p className="text-amber-700 text-[11px] mt-0.5">
                The owner has temporarily paused this listing. It is currently hidden from search results.
              </p>
            </div>
          </div>

          {isOwner && (
            <button
              onClick={() => reactivateProperty(property.id)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-xs cursor-pointer shrink-0 self-start sm:self-auto flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">replay</span>
              <span>Reactivate Listing</span>
            </button>
          )}
        </div>
      )}

      {/* Main Photo Gallery */}
      <div className="space-y-2">
        <div
          className="relative aspect-[16/9] md:aspect-[21/9] md:max-h-[440px] rounded-3xl overflow-hidden bg-surface-container-high border border-outline-variant/40 shadow-md touch-pan-y"
          onTouchStart={handleGalleryTouchStart}
          onTouchEnd={handleGalleryTouchEnd}
          aria-label="Property photo gallery. Swipe left or right to change photos."
        >
          <img
            src={property.images?.[activePhotoIdx] || property.images?.[0]}
            alt={property.title}
            className="w-full h-full object-cover transition-all duration-300"
          />

          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <AvailabilityBadge status={status} size="md" />
            <span className="px-3 py-1 rounded-full bg-emerald-950/85 backdrop-blur-md text-emerald-300 text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-1 border border-emerald-500/50">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              AI Verified Real
            </span>
            {property.isFeatured && (
              <span className="px-3 py-1 rounded-full bg-amber-500/90 text-white text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">star</span>
                Featured
              </span>
            )}
          </div>

          <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-xs font-semibold">
            {activePhotoIdx + 1} / {property.images?.length || 1} Photos
          </div>
        </div>

        {/* Thumbnail row */}
        {property.images && property.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {property.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoIdx(idx)}
                aria-label={`View property photo ${idx + 1}`}
                className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  activePhotoIdx === idx ? 'border-primary-container scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Pricing Strip matching Stitch Property Details */}
      <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-on-surface">
              ₹{property.rent.toLocaleString('en-IN')}
            </span>
            <span className="text-sm font-semibold text-outline">/ month</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-extrabold border border-emerald-500/20">
              Zero Brokerage Guarantee
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface text-xs font-bold">
              Deposit: ₹{property.deposit.toLocaleString('en-IN')}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-container/10 text-primary text-xs font-extrabold border border-primary-container/20">
              Est. ₹{monthlyTotal.toLocaleString('en-IN')}/mo total
            </span>
          </div>
        </div>

        <div className="sm:text-right flex flex-col sm:items-end gap-1">
          <span className="text-[11px] uppercase font-bold text-outline block">Status & Availability</span>
          <AvailabilityBadge status={status} size="md" />
        </div>
      </div>

      {/* Property Overview & Details */}
      <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/40 shadow-sm space-y-6">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap mb-2">
            <h1 className="text-2xl font-black text-on-surface">
              {property.title}
            </h1>
            <AvailabilityBadge status={status} size="sm" />
          </div>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-outline">
            <span className="material-symbols-outlined text-lg text-primary-container">location_on</span>
            <span>{property.locality}</span>
            {property.distance && <span>• ({property.distance})</span>}
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-surface-container/50 text-xs font-bold text-on-surface">
          <div className="p-2.5 bg-surface-container-lowest rounded-xl border border-outline-variant/30">
            <span className="text-[10px] text-outline font-semibold block uppercase">Type</span>
            <span>{property.propertyType}</span>
          </div>
          <div className="p-2.5 bg-surface-container-lowest rounded-xl border border-outline-variant/30">
            <span className="text-[10px] text-outline font-semibold block uppercase">Furnishing</span>
            <span>{property.furnished}</span>
          </div>
          <div className="p-2.5 bg-surface-container-lowest rounded-xl border border-outline-variant/30">
            <span className="text-[10px] text-outline font-semibold block uppercase">Preferred Tenant</span>
            <span>{property.preferredTenant}</span>
          </div>
          <div className="p-2.5 bg-surface-container-lowest rounded-xl border border-outline-variant/30">
            <span className="text-[10px] text-outline font-semibold block uppercase">Rating</span>
            <span className="flex items-center gap-1 text-amber-600">
              ★ {property.rating} ({property.reviewsCount} reviews)
            </span>
          </div>
        </div>

        {/* Exact listing details */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-extrabold text-on-surface">Property details</h3>
            <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary-container/10 px-2.5 py-1 rounded-full">Verified listing</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[
              ['Project', property.projectName || 'Sawariya Sethji'],
              ['Super built-up', property.superBuiltUpArea || '520 sqft'],
              ['Carpet area', property.carpetArea || '450 sqft'],
              ['Bathrooms', property.bathrooms || '1'],
              ['Listed by', property.listedBy || 'Dealer'],
              ['Bachelors allowed', property.bachelorsAllowed || 'Yes'],
              ['Facing', property.facing || 'East'],
              ['Floor', `${property.floorNo || '1'} of ${property.totalFloors || '3'}`],
              ['Car parking', property.carParking || '0'],
              ['Maintenance', property.maintenance || '₹0 / month']
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-outline-variant/30 bg-surface-container/50 p-3">
                <span className="block text-[10px] uppercase tracking-wide font-bold text-outline">{label}</span>
                <span className="block mt-1 text-xs font-extrabold text-on-surface">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-base font-extrabold text-on-surface mb-2">About this Property</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            {property.description}
          </p>
        </div>

        {/* Amenities */}
        <div>
          <h3 className="text-base font-extrabold text-on-surface mb-3">Amenities & Facilities</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {property.amenities?.map((amenity, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/30 text-xs font-semibold text-on-surface">
                <span className="material-symbols-outlined text-base text-primary-container">
                  check_circle
                </span>
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seller-set rules */}
      <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/40 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">Transparent living</p>
            <h2 className="text-lg font-black text-on-surface mt-1">House rules</h2>
          </div>
          <span className="material-symbols-outlined text-primary-container">gavel</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {(property.rules?.length ? property.rules : ['No smoking', 'No illegal activity', 'Keep premises clean']).map((rule, idx) => (
            <div key={idx} className="flex items-center gap-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/30 p-3 text-xs font-bold text-on-surface">
              <span className="material-symbols-outlined text-base text-emerald-600">check_circle</span>{rule}
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-outline">Rules are set by the seller and should be confirmed before scheduling a visit.</p>
      </div>

      {/* Same-location map */}
      <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/40 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">Location</p><h2 className="text-lg font-black text-on-surface mt-1">See it on the map</h2></div>
          <span className="material-symbols-outlined text-primary-container">map</span>
        </div>
        <p className="text-xs text-outline mb-3 flex items-center gap-1.5"><span className="material-symbols-outlined text-sm text-primary-container">location_on</span>{property.mapQuery || `${property.locality}, ${property.city || 'Rewa'}`}</p>
        <div className="overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container">
          <iframe title="Property location map" className="w-full h-64" loading="lazy" src={`https://www.google.com/maps?q=${encodeURIComponent(property.mapQuery || `${property.locality}, ${property.city || 'Rewa'}`)}&output=embed`} />
        </div>
        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.mapQuery || `${property.locality}, ${property.city || 'Rewa'}`)}`} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold text-primary hover:underline">Open in Google Maps <span className="material-symbols-outlined text-sm">arrow_outward</span></a>
      </div>

      {/* Host Card matching Stitch Details */}
      <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/40 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-lg">
              {property.owner?.name?.[0]}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-extrabold text-base text-on-surface">{property.owner?.name}</h3>
                  </div>
              <p className="text-xs text-outline font-medium">
                {property.owner?.type} • Direct contact
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-bold border border-emerald-500/20">
              Verified profile
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-surface-container-low text-xs text-outline space-y-1">
          <div className="flex justify-between">
            <span>Average Response Time:</span>
            <strong className="text-on-surface">{property.owner?.responseRate}</strong>
          </div>
          <div className="flex justify-between">
            <span>Direct Lease:</span>
            <strong className="text-emerald-700">100% Zero Brokerage</strong>
          </div>
          <div className="flex justify-between">
            <span>Contact Number:</span>
            <strong className="text-on-surface">{property.owner?.phoneMasked} (Protected)</strong>
          </div>
        </div>
      </div>

      {/* Trust & Safety Warning & Report */}
      <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-xl text-outline">verified_user</span>
          <span className="text-xs text-outline font-semibold">
            Never pay advance deposit before viewing the property physically.
          </span>
        </div>
        <button
          onClick={handleReport}
          className="text-xs font-bold text-error hover:underline cursor-pointer shrink-0"
        >
          Report Listing
        </button>
      </div>

      {/* Sticky Bottom Actions Bar */}
      <div className="hl-detail-actions fixed bottom-[4.5rem] md:bottom-0 left-0 right-0 p-2 md:p-4 bg-surface/95 backdrop-blur-md border-t border-outline-variant/30 z-30">
        <div className="hl-detail-actions-inner max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 md:gap-3">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div>
              <span className="text-xs text-outline font-semibold block">Total Rent</span>
              <span className="hl-detail-rent text-xl font-black text-on-surface">
                ₹{property.rent.toLocaleString('en-IN')}<span className="text-xs text-outline font-normal">/mo</span>
              </span>
            </div>
            <div className="sm:hidden">
              <AvailabilityBadge status={status} size="sm" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            {isRented ? (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-rose-500/10 text-rose-700 text-xs font-bold border border-rose-500/20 flex items-center justify-center gap-1.5">
                  <span className="material-symbols-outlined text-base">cancel</span>
                  <span>Property Rented • Inquiries Closed</span>
                </span>
                {isOwner && (
                  <button
                    onClick={() => reactivateProperty(property.id)}
                    className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-base">replay</span>
                    <span>Reactivate</span>
                  </button>
                )}
              </div>
            ) : isPaused ? (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-amber-500/10 text-amber-700 text-xs font-bold border border-amber-500/20 flex items-center justify-center gap-1.5">
                  <span className="material-symbols-outlined text-base">pause_circle</span>
                  <span>Listing Paused</span>
                </span>
                {isOwner && (
                  <button
                    onClick={() => reactivateProperty(property.id)}
                    className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-base">replay</span>
                    <span>Reactivate</span>
                  </button>
                )}
              </div>
            ) : (
              <>
                {isOwner && (
                  <button
                    onClick={() => setIsRentedModalOpen(true)}
                    className="hl-detail-owner-btn py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-700 hover:text-white border border-rose-500/20 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    <span className="hl-detail-owner-label">Mark as Rented</span>
                  </button>
                )}

                <button
                  onClick={() => setShowChatModal(true)}
                  className="hl-detail-action-btn px-3.5 py-2.5 rounded-xl bg-[#131b2e] hover:bg-[#273451] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                >
                  <span className="material-symbols-outlined text-base">chat_bubble</span>
                  <span className="hidden sm:inline">Chat with Seller</span>
                </button>

                <button
                  onClick={() => setShowCallModal(true)}
                  className="hl-detail-action-btn px-3.5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base text-primary-container">call</span>
                  <span className="hidden sm:inline">Call Host</span>
                </button>

                <button
                  onClick={handleBookVisit}
                  disabled={inquirySent}
                  className="hl-detail-visit-btn px-4 py-2.5 rounded-xl bg-primary-container hover:bg-primary text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-80"
                >
                  <span className="material-symbols-outlined text-base">calendar_month</span>
                  <span className="hl-detail-visit-label hl-visit-label-desktop">{inquirySent ? 'Visit Requested ✓' : 'Schedule Free Visit'}</span>
                  <span className="hl-visit-label-mobile">{inquirySent ? 'Visit Requested ✓' : 'Schedule Free Visit'}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal when owner marks as rented */}
      <MarkAsRentedModal
        isOpen={isRentedModalOpen}
        propertyTitle={property.title}
        onClose={() => setIsRentedModalOpen(false)}
        onConfirm={() => markPropertyAsRented(property.id)}
      />

      {/* Direct seller chat dialog */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-container-lowest p-6 rounded-3xl max-w-md w-full border border-outline-variant/40 shadow-2xl space-y-4">
            <div className="flex items-center gap-3"><div className="w-11 h-11 rounded-2xl bg-[#131b2e] text-white flex items-center justify-center"><span className="material-symbols-outlined">chat_bubble</span></div><div><h3 className="text-lg font-black text-on-surface">Chat with {property.owner?.name}</h3><p className="text-xs text-outline">Direct, zero-brokerage conversation</p></div></div>
            {chatSent ? <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm font-bold text-emerald-800">Message sent. The seller will reply in the HomeLink chat.</div> : <textarea value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} rows={4} className="w-full rounded-2xl border border-outline-variant/50 bg-surface-container/50 p-3 text-sm outline-none focus:border-primary-container resize-none" placeholder="Write your message..." />}
            <div className="flex gap-2"><button onClick={() => { setShowChatModal(false); setChatSent(false); }} className="flex-1 py-2.5 rounded-xl bg-surface-container text-xs font-bold text-on-surface cursor-pointer">Close</button>{!chatSent && <button onClick={() => setChatSent(true)} disabled={!chatMessage.trim()} className="flex-1 py-2.5 rounded-xl bg-primary-container text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50">Send message</button>}</div>
          </div>
        </div>
      )}

      {/* Call Dialog */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-container-lowest p-6 rounded-3xl max-w-sm w-full border border-outline-variant/40 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-container text-white flex items-center justify-center mx-auto shadow-md">
              <span className="material-symbols-outlined text-3xl">call</span>
            </div>
            <h3 className="text-lg font-black text-on-surface">Connect with {property.owner?.name}</h3>
            <p className="text-xs text-outline">
              For security, calls are routed through HomeLink Rewa SafeNet.
            </p>
            <div className="p-3 rounded-xl bg-surface-container font-mono text-sm font-bold text-on-surface">
              {property.owner?.phoneMasked}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCallModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-surface-container text-xs font-bold text-on-surface cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowCallModal(false);
                  alert('Dialing simulated: Connection initiated to verified owner.');
                }}
                className="flex-1 py-2.5 rounded-xl bg-primary-container text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Call Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
