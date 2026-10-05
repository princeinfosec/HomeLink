import React, { useState } from 'react';
import { Bot, Loader2, MessageCircle, Send, Sparkles, X } from 'lucide-react';

const suggestions = ['How does HomeLink work?', 'Find a room under ₹5,000', 'How do I list my property?'];

export default function FloatingGeminiAgent() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Hi! I am HomeLink Agent. Ask me anything about rentals, roommates, listings, safety or using this website.' }]);
  const [loading, setLoading] = useState(false);

  const ask = async (text = message) => {
    const question = text.trim();
    if (!question || loading) return;
    setMessage('');
    setMessages((items) => [...items, { role: 'user', text: question }]);
    setLoading(true);
    try {
      const response = await fetch('/api/gemini', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: question }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Agent is temporarily unavailable.');
      setMessages((items) => [...items, { role: 'assistant', text: data.text || 'I could not find an answer. Please try again.' }]);
    } catch (error) {
      setMessages((items) => [...items, { role: 'assistant', text: error.message || 'Agent is temporarily unavailable. You can still use all HomeLink features.' }]);
    } finally { setLoading(false); }
  };

  return <>
    {open && <section className="fixed z-[70] bottom-40 sm:bottom-24 right-4 sm:right-6 w-[min(390px,calc(100vw-2rem))] rounded-3xl border border-primary-container/20 bg-surface-container-lowest shadow-2xl overflow-hidden" aria-label="HomeLink AI Agent">
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary-container to-primary text-white"><div className="flex items-center gap-2"><span className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center"><Sparkles size={18} /></span><div><strong className="block text-sm">HomeLink Agent</strong><span className="text-[10px] opacity-80">Website help powered by Gemini</span></div></div><button onClick={() => setOpen(false)} className="p-1 rounded-full hover:bg-white/20" aria-label="Close agent"><X size={17} /></button></div>
      <div className="h-72 overflow-y-auto p-3 space-y-2.5 bg-surface-container-low/40">{messages.map((item, index) => <div key={`${item.role}-${index}`} className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[88%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${item.role === 'user' ? 'bg-primary-container text-white rounded-br-sm' : 'bg-surface-container-lowest border border-outline-variant/40 text-on-surface rounded-bl-sm'}`}>{item.text}</div></div>)}{loading && <div className="flex items-center gap-2 text-xs text-outline"><Loader2 size={14} className="animate-spin" />Thinking…</div>}</div>
      <div className="px-3 pt-2 flex gap-1.5 overflow-x-auto">{suggestions.map((item) => <button key={item} onClick={() => ask(item)} className="shrink-0 rounded-full border border-primary-container/30 px-2.5 py-1 text-[10px] font-semibold text-primary-container hover:bg-primary-container/10">{item}</button>)}</div>
      <form onSubmit={(event) => { event.preventDefault(); ask(); }} className="p-3 flex gap-2"><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask about HomeLink…" className="min-w-0 flex-1 rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2 text-xs focus:outline-none focus:border-primary-container" /><button disabled={loading || !message.trim()} className="w-10 rounded-xl bg-primary-container text-white flex items-center justify-center disabled:opacity-50" aria-label="Send question"><Send size={16} /></button></form>
    </section>}
    <button onClick={() => setOpen((value) => !value)} className="fixed z-[69] bottom-24 sm:bottom-8 right-4 sm:right-6 w-14 h-14 rounded-full bg-primary-container text-white shadow-xl shadow-primary-container/30 flex items-center justify-center hover:scale-105 transition-transform" aria-label={open ? 'Close HomeLink Agent' : 'Open HomeLink Agent'}>{open ? <X size={22} /> : <><Bot size={22} /><span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-background" /></>}</button>
  </>;
}
