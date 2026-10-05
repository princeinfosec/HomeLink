import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import DemoBadge from '../components/DemoBadge';

export default function ChatView() {
  const {
    chats,
    activeChatUserId,
    setActiveChatUserId,
    sendMessage,
    roommates,
    goBack,
    routeParams,
    setReportModalOpen,
    setReportedTarget
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [mobileListOpen, setMobileListOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const menuRef = useRef(null);

  const connectedRoommates = roommates.filter(r => r.requestStatus === 'connected');
  const targetUser = roommates.find(r => r.id === activeChatUserId) || null; // nothing opens until the user picks a conversation
  const activeMessages = targetUser ? (chats[targetUser.id] || []) : [];

  // Conversation list: everyone with a thread or an accepted connection
  const conversations = useMemo(() => {
    const list = roommates.filter(
      r => r.requestStatus === 'connected' || (chats[r.id] && chats[r.id].length > 0)
    );
    return list;
  }, [roommates, chats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [activeMessages.length, targetUser?.id]);

  useEffect(() => {
    const onDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!targetUser || !inputVal.trim()) return;
    sendMessage(targetUser.id, inputVal);
    setInputVal('');
  };

  const handleReport = () => {
    setShowMenu(false);
    setReportedTarget({ type: 'Chat User', id: targetUser.id, title: targetUser.name });
    setReportModalOpen(true);
  };

  const handleBlock = () => {
    setShowMenu(false);
    alert(`${targetUser.name} has been blocked and removed from your conversations.`);
  };

  const openChat = (id) => {
    setActiveChatUserId(id);
    setMobileListOpen(false);
  };

  const handleThreadBack = () => {
    if (routeParams?.roommateId) {
      goBack();
      return;
    }
    setActiveChatUserId(null);
    setMobileListOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-0 lg:px-8 lg:py-6">
      {/* Fixed-height chat shell: viewport minus header (4rem) and, on mobile, bottom nav */}
      <div className="flex h-[calc(100dvh-4rem-4.75rem)] lg:h-[calc(100dvh-4rem-3rem)] lg:min-h-[520px] lg:max-h-[860px] bg-surface-container-lowest lg:rounded-3xl lg:border border-outline-variant/40 lg:shadow-sm overflow-hidden">

        {/* ───────── Conversation list ───────── */}
        <aside
          className={`${mobileListOpen || !targetUser ? 'flex' : 'hidden'} lg:flex flex-col w-full lg:w-[340px] shrink-0 lg:border-r border-outline-variant/40 bg-surface-container-lowest`}
        >
          <div className="px-4 py-3.5 border-b border-outline-variant/30 flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-base font-extrabold text-on-surface leading-tight">Chats</h2>
              <p className="text-[11px] text-outline font-medium">{conversations.length} conversation{conversations.length === 1 ? '' : 's'}</p>
            </div>
            <button
              onClick={() => setMobileListOpen(false)}
              className={`${targetUser ? 'lg:hidden' : 'hidden'} w-9 h-9 rounded-full hover:bg-surface-container flex items-center justify-center text-outline cursor-pointer`}
              aria-label="Close conversations"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <div className="hl-scroll flex-1 overflow-y-auto">
            {conversations.length === 0 && (
              <div className="p-8 text-center text-xs font-semibold text-outline">
                <span className="material-symbols-outlined text-4xl block mb-2 text-outline/50">forum</span>
                No conversations yet. Connect with a roommate or contact an owner to start chatting.
              </div>
            )}
            {conversations.map((rm) => {
              const thread = chats[rm.id] || [];
              const last = thread[thread.length - 1];
              const isActive = rm.id === targetUser?.id;
              return (
                <button
                  key={rm.id}
                  onClick={() => openChat(rm.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer border-l-[3px] ${
                    isActive
                      ? 'bg-primary-container/10 border-primary-container'
                      : 'border-transparent hover:bg-surface-container-low'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img src={rm.avatar} alt={rm.name} className="w-11 h-11 rounded-xl object-cover bg-surface-container" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-extrabold text-on-surface truncate">{rm.name}</span>
                      {last && <span className="text-[10px] font-semibold text-outline shrink-0">{last.timestamp}</span>}
                    </div>
                    <p className="text-xs text-outline truncate mt-0.5">
                      {last ? `${last.isMe ? 'You: ' : ''}${last.text}` : 'Say hello 👋'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* ───────── Active thread ───────── */}
        {!targetUser && (
          <section className="hidden lg:flex flex-col flex-1 min-w-0 items-center justify-center text-center p-8 bg-surface-container-low/40">
            <div className="w-16 h-16 rounded-2xl bg-primary-container/10 text-primary-container flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-4xl">chat</span>
            </div>
            <h3 className="text-base font-extrabold text-on-surface">Select a conversation</h3>
            <p className="text-xs text-outline font-medium mt-1 max-w-xs">Choose someone from the list to open your chat.</p>
          </section>
        )}
        {targetUser && (
        <section className={`${mobileListOpen ? 'hidden' : 'flex'} lg:flex flex-col flex-1 min-w-0`}>
          {/* Thread header */}
          <div className="flex items-center justify-between gap-3 px-3 sm:px-5 py-3 border-b border-outline-variant/30 shrink-0 bg-surface-container-lowest">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={handleThreadBack}
                className="lg:hidden w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface cursor-pointer shrink-0"
                aria-label="Go back"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
              </button>

              <div className="relative shrink-0">
                <img
                  src={targetUser.avatar}
                  alt={targetUser.name}
                  className="w-10 h-10 rounded-xl object-cover border border-primary-container bg-surface-container"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-extrabold text-sm text-on-surface truncate">{targetUser.name}</h3>
                  <DemoBadge size="sm" />
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-500/10 px-1.5 py-0.5 rounded whitespace-nowrap">
                    {targetUser.matchScore}% Match
                  </span>
                </div>
                <p className="text-[11px] text-outline truncate">{targetUser.occupation}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setMobileListOpen(true)}
                className="lg:hidden w-9 h-9 rounded-full hover:bg-surface-container flex items-center justify-center text-outline hover:text-on-surface cursor-pointer"
                aria-label="All conversations"
              >
                <span className="material-symbols-outlined text-xl">forum</span>
              </button>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="w-9 h-9 rounded-full hover:bg-surface-container flex items-center justify-center text-outline hover:text-on-surface cursor-pointer"
                  aria-label="Chat options"
                >
                  <span className="material-symbols-outlined text-xl">more_vert</span>
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-11 w-44 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-xl py-1.5 z-30">
                    <button
                      onClick={handleReport}
                      className="w-full px-3.5 py-2 text-left text-xs font-bold text-error hover:bg-surface-container flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">flag</span>
                      <span>Report User</span>
                    </button>
                    <button
                      onClick={handleBlock}
                      className="w-full px-3.5 py-2 text-left text-xs font-bold text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">block</span>
                      <span>Block User</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Demo disclaimer */}
          <div className="px-3 sm:px-5 py-2 bg-surface-container/60 border-b border-outline-variant/30 flex items-center gap-2 text-[11px] text-outline font-medium shrink-0">
            <span className="material-symbols-outlined text-base text-primary-container shrink-0">lock</span>
            <span>Simulated demo conversation. Real tenant & roommate messaging unlocks after HomeLink launch.</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 space-y-3 bg-surface/60">
            {activeMessages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2.5 text-[13px] md:text-sm shadow-sm break-words ${
                    msg.isMe
                      ? 'bg-primary-container text-white rounded-br-md'
                      : 'bg-surface-container-lowest text-on-surface rounded-bl-md border border-outline-variant/30'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
                <span className="text-[10px] font-semibold text-outline/80 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Composer */}
          <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-outline-variant/30 bg-surface-container-lowest shrink-0">
            <div className="flex items-center gap-2 bg-surface-container-low p-1.5 pl-2 rounded-2xl border border-outline-variant/50 focus-within:border-primary-container focus-within:bg-surface-container-lowest transition-all">
              <button
                type="button"
                onClick={() => alert('Media attachments enabled for camera room photos in verified conversations.')}
                className="w-9 h-9 flex items-center justify-center text-outline hover:text-on-surface cursor-pointer shrink-0"
                title="Attach image"
              >
                <span className="material-symbols-outlined text-xl">attach_file</span>
              </button>

              <input
                type="text"
                placeholder={`Message ${targetUser.name}...`}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="flex-1 min-w-0 text-sm font-semibold text-on-surface bg-transparent focus:outline-none"
              />

              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="w-10 h-10 rounded-xl bg-primary-container text-white flex items-center justify-center hover:bg-primary shadow-sm transition-all cursor-pointer disabled:opacity-40 shrink-0"
                aria-label="Send message"
              >
                <span className="material-symbols-outlined text-xl">send</span>
              </button>
            </div>
          </form>
        </section>
        )}
      </div>
    </div>
  );
}
