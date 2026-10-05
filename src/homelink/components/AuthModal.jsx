import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INDIA_LOCATIONS } from '../data/indiaLocations';
import { api } from '../services';

export default function AuthModal() {
  const { isAuthModalOpen, setAuthModalOpen, loginUser, navigate } = useApp();
  const [mode, setMode] = useState('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Renter & Seeker');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;
  const close = () => { setAuthModalOpen(false); setError(''); setLoading(false); };
  const finish = (res) => {
    if (!res?.user) throw new Error('Unable to load your account.');
    loginUser(res.user, res.token);
    close();
    navigate(res.user.role === 'Host / Owner' ? 'owner-dashboard' : 'dashboard');
  };
  const handleLogin = async (event) => {
    event.preventDefault(); setError('');
    if (!identifier.trim() || !password) { setError('Please enter your email/mobile and password.'); return; }
    setLoading(true);
    try { finish(await api.auth.login(identifier.includes('@') ? { email: identifier.trim(), password } : { phone: identifier.trim(), password })); }
    catch (err) { setError(err.message || 'Login failed.'); }
    finally { setLoading(false); }
  };
  const handleRegister = async (event) => {
    event.preventDefault(); setError('');
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (!name.trim()) { setError('Please enter your full name.'); return; }
    if (!cleanPhone && !email.trim()) { setError('Please enter an email or mobile number.'); return; }
    if (!state) { setError('Please select your state first.'); return; }
    if (!city) { setError('Please select a city from the selected state.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters long.'); return; }
    if (!agreeTerms) { setError('Please accept the HomeLink community guidelines.'); return; }
    setLoading(true);
    try { finish(await api.auth.register({ name, phone: cleanPhone, email, password, role, state, city })); }
    catch (err) { setError(err.message || 'Could not create account.'); }
    finally { setLoading(false); }
  };
  const inputClass = 'mt-1 w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-xs font-semibold focus:outline-none focus:border-primary-container';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={close}>
      <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full border border-outline-variant/40 shadow-2xl overflow-hidden p-6 sm:p-7 relative max-h-[92vh] overflow-y-auto" onClick={(event) => event.stopPropagation()}>
        <button onClick={close} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-container text-on-surface flex items-center justify-center cursor-pointer"><span className="material-symbols-outlined text-lg">close</span></button>
        <div className="flex items-center gap-3 mb-5"><div className="w-11 h-11 rounded-2xl bg-primary-container text-white flex items-center justify-center"><span className="material-symbols-outlined text-2xl">roofing</span></div><div><div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Local JSON Database</div><h2 className="text-xl font-black text-on-surface">HomeLink Account</h2></div></div>
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-surface-container mb-5"><button type="button" onClick={() => { setMode('login'); setError(''); }} className={`py-2 rounded-xl text-xs font-extrabold ${mode === 'login' ? 'bg-surface-container-lowest text-on-surface shadow-xs' : 'text-outline'}`}>Sign In</button><button type="button" onClick={() => { setMode('register'); setError(''); }} className={`py-2 rounded-xl text-xs font-extrabold ${mode === 'register' ? 'bg-surface-container-lowest text-on-surface shadow-xs' : 'text-outline'}`}>Create Account</button></div>
        {error && <div className="mb-4 p-3 rounded-xl bg-error/10 border border-error/25 text-error text-xs font-semibold">{error}</div>}
        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-3.5">
            <label className="block text-xs font-bold text-on-surface">Email or Mobile Number<input autoFocus value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="name@example.com or 98261 00000" className={inputClass} /></label>
            <label className="block text-xs font-bold text-on-surface">Password<div className="relative"><input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className={`${inputClass} pr-10`} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-outline"><span className="material-symbols-outlined text-base">{showPassword ? 'visibility_off' : 'visibility'}</span></button></div></label>
            <button disabled={loading} className="w-full py-3 rounded-xl bg-primary-container text-white font-bold text-xs disabled:opacity-60">{loading ? 'Signing in…' : 'Sign In to Account'}</button>
            <p className="text-[11px] text-center text-outline">New here? <button type="button" onClick={() => setMode('register')} className="font-bold text-primary-container">Create an account</button>.</p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div><label className="block text-xs font-bold text-on-surface mb-1">I want to join as</label><div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => setRole('Renter & Seeker')} className={`p-2.5 rounded-xl border text-xs font-bold ${role === 'Renter & Seeker' ? 'border-primary-container bg-primary-container/10 text-primary-container' : 'border-outline-variant text-outline'}`}>Room Seeker</button><button type="button" onClick={() => setRole('Host / Owner')} className={`p-2.5 rounded-xl border text-xs font-bold ${role === 'Host / Owner' ? 'border-secondary bg-secondary-container/20 text-secondary' : 'border-outline-variant text-outline'}`}>Property Host</button></div></div>
            <label className="block text-xs font-bold text-on-surface">Full Name<input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className={inputClass} /></label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"><label className="block text-xs font-bold text-on-surface">Mobile Number<input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={10} placeholder="98261 00000" className={inputClass} /></label><label className="block text-xs font-bold text-on-surface">Email Address<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className={inputClass} /></label></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"><label className="block text-xs font-bold text-on-surface">State<select required value={state} onChange={(e) => { setState(e.target.value); setCity(''); }} className={`${inputClass} h-11`}><option value="">Select state first</option>{INDIA_LOCATIONS.map((group) => <option key={group.state} value={group.state}>{group.state}</option>)}</select></label><label className="block text-xs font-bold text-on-surface">City<select required disabled={!state} value={city} onChange={(e) => setCity(e.target.value)} className={`${inputClass} h-11 disabled:opacity-50`}><option value="">{state ? 'Select city' : 'Select state first'}</option>{INDIA_LOCATIONS.find((group) => group.state === state)?.cities.map((item) => <option key={item} value={item}>{item}</option>)}</select></label></div>
            <label className="block text-xs font-bold text-on-surface">Create Password<input required minLength={6} type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className={inputClass} /></label>
            <label className="flex items-start gap-2 text-[11px] text-outline"><input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="mt-0.5 accent-primary-container" />I agree to the HomeLink 0% Brokerage Pledge and Community Guidelines.</label>
            <button disabled={loading} className="w-full py-3 rounded-xl bg-primary-container text-white font-bold text-xs disabled:opacity-60">{loading ? 'Creating account…' : 'Create Free Account'}</button>
          </form>
        )}
      </div>
    </div>
  );
}
