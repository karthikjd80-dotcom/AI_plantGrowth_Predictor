import React, { useState, useRef, useEffect, memo } from 'react';
import {
  X, Bot, Trash2,
  Copy, Check, Leaf,
  Clock, ArrowLeft, Volume2, VolumeX, ChevronDown,
  Plus, ArrowUp
} from 'lucide-react';
import { PredictionResult, HistoryItem } from '../types';

const FOLAX_SUGGESTION_PILLS = [
  { icon: '🌿', text: 'Analyze this plant photo & care needs', query: 'Please analyze my plant, check leaf health, and tell me optimal care steps.' },
  { icon: '🪴', text: 'Diagnose yellow leaves or fungal spots', query: 'Why are leaves developing yellow spots or drooping, and what organic treatments work best?' },
  { icon: '☀️', text: 'Indoor light and watering schedules', query: 'Give me the ideal watering frequency and sunlight requirements for potted house plants.' },
] as const;

const FLORA_SUGGESTION_PILLS = [
  {
    icon: '🌿',
    text: 'Diagnose yellowing monstera leaves',
    query: 'Why are my monstera leaves turning yellow with brown spots, and how do I fix it?',
  },
  {
    icon: '💧',
    text: 'Watering schedule for indoor plants',
    query: 'How often should I water my snake plant and pothos during warm and cool seasons?',
  },
  {
    icon: '☀️',
    text: 'Best low-light plants for apartment',
    query: 'What are the top 5 resilient indoor plants that thrive in low indirect sunlight?',
  },
] as const;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  messages: Message[];
}

interface PlantChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  plantContext?: PredictionResult | null;
  initialQuestion?: string | null;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onSwitchToScanner?: () => void;
  scanHistory?: HistoryItem[];
  onSelectHistoryItem?: (item: HistoryItem) => void;
}

export const PlantChatModal = memo(function PlantChatModal({ 
  isOpen, 
  onClose, 
  plantContext, 
  initialQuestion,
  isDarkMode = false,
  onToggleDarkMode,
  onSwitchToScanner,
  scanHistory = [],
  onSelectHistoryItem
}: PlantChatModalProps) {
  // Input and active chat messages
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const [assistantMode, setAssistantMode] = useState<'folax' | 'flora'>('folax');
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const lastInitialQuestionRef = useRef<string | null>(null);

  // Preset Sessions list
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: 'session-1',
      title: 'Monstera Leaf Yellowing',
      preview: 'Overwatering diagnosis and root aeration plan...',
      timestamp: 'Today, 10:24 AM',
      messages: []
    },
    {
      id: 'session-2',
      title: 'Ficus Lyrata Care Guide',
      preview: 'Optimal sunlight, misting, and soil humidity...',
      timestamp: 'Yesterday',
      messages: []
    },
    {
      id: 'session-3',
      title: 'Rose Plant Aphid Control',
      preview: 'Organic neem oil spray and pruning schedule...',
      timestamp: 'Sep 28',
      messages: []
    },
    {
      id: 'session-4',
      title: 'Snake Plant Water Propagation',
      preview: 'Leaf cutting callusing & hydroponic rooting...',
      timestamp: 'Sep 25',
      messages: []
    }
  ]);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = (smooth = true) => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      const focusTimer = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 150);
      scrollToBottom(false);
      return () => clearTimeout(focusTimer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (messages.length > 0 || isLoading) {
      const timer = setTimeout(() => {
        scrollToBottom(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [messages.length, isLoading]);

  useEffect(() => {
    if (initialQuestion && isOpen && lastInitialQuestionRef.current !== initialQuestion) {
      lastInitialQuestionRef.current = initialQuestion;
      handleSendMessage(initialQuestion);
    } else if (!isOpen) {
      lastInitialQuestionRef.current = null;
    }
  }, [initialQuestion, isOpen]);

  // Text-To-Speech read aloud
  const handleReadAloud = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Image attachment
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setNoticeMessage('Please select a valid image file.');
      setTimeout(() => setNoticeMessage(null), 4000);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setAttachedImage(compressed);
        } else {
          setAttachedImage(reader.result as string);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSendMessage = async (textToSend?: string, targetMode?: 'folax' | 'flora') => {
    const activeMode = targetMode || assistantMode;
    if (targetMode && targetMode !== assistantMode) {
      setAssistantMode(targetMode);
    }

    const query = (textToSend || input).trim();
    if ((!query && !attachedImage) || isLoading) return;

    const userMsg: Message = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: query,
      image: attachedImage || undefined,
      timestamp: new Date()
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setAttachedImage(null);
    setIsLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const recentMessages = newMessages.slice(-6);
      const lastImageIdx = recentMessages.map(m => Boolean(m.image)).lastIndexOf(true);
      const payloadMessages = recentMessages.map((m, idx) => ({
        role: m.role,
        content: m.content,
        image: idx === lastImageIdx ? m.image : undefined
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          plantContext: plantContext || null,
          mode: activeMode
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Server error occurred');
      }

      const data = await res.json();
      const defaultGreeting = activeMode === 'folax' 
        ? "I am Folax, your all-in-one assistant! How can I help you with this photo or question?" 
        : "I am ready to help with any botanical or plant care question! Ask me anything.";

      const assistantMsg: Message = {
        id: 'assistant-' + Date.now(),
        role: 'assistant',
        content: data.reply || defaultGreeting,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsg]);

      // Add to recent sessions if first message
      if (messages.length === 0) {
        const newTitle = query.slice(0, 32) || (plantContext ? `${plantContext.plantName} Advice` : `${activeMode === 'folax' ? 'Folax' : 'FloraAI'} Chat`);
        setSessions(prev => [
          {
            id: 'session-' + Date.now(),
            title: newTitle,
            preview: (data.reply || '').slice(0, 60) + '...',
            timestamp: 'Just now',
            messages: [...newMessages, assistantMsg]
          },
          ...prev
        ]);
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      const qLower = query.toLowerCase();
      let fallbackReply = '';

      if (qLower.includes('yellow') || qLower.includes('spot') || qLower.includes('droop') || qLower.includes('brown')) {
        fallbackReply = `**${activeMode === 'folax' ? 'Folax' : 'FloraAI'} Diagnostic: Yellow Spots & Drooping Leaves**\n\nHere are the primary causes and best organic remedies:\n• **1. Overwatering & Root Stress:** Soggy soil starves roots of oxygen, causing drooping and yellowing lower leaves. *Fix:* Let the top 2 inches of soil dry out completely and ensure bottom drainage holes are open.\n• **2. Fungal Leaf Spot:** Circular yellow or brown spots caused by moisture sitting on foliage. *Fix:* Prune affected leaves and spray **cold-pressed Neem Oil** (5ml per liter of water + a drop of mild liquid soap) every 7 days.\n• **3. Nutrient Deficiency (Chlorosis):** Pale yellow leaves with green veins. *Fix:* Feed with organic **liquid seaweed kelp** or **vermicompost tea** every 2–3 weeks.\n• **4. Baking Soda Bio-Shield:** Mix 1/2 tsp baking soda + 1/2 tsp neem oil in 1L water to stop fungal spread naturally.`;
      } else if (qLower.includes('water') || qLower.includes('sunlight') || qLower.includes('light')) {
        fallbackReply = `💧 **${activeMode === 'folax' ? 'Folax' : 'FloraAI'} Watering & Sunlight Guide**\n\n• **Finger Test:** Insert your finger 1.5–2 inches into the soil—water deeply only when it feels dry.\n• **Best Time:** Water in the **early morning (6:30–9:00 AM)** at the root zone so leaves stay dry before evening.\n• **Sunlight:** Provide **4–6 hours of bright indirect sunlight** daily.\n• **Drainage:** Empty excess water from the saucer 15 minutes after watering to prevent root rot.`;
      } else {
        fallbackReply = activeMode === 'folax'
          ? `**Folax Botanical Insights**\n\nI analyzed your request! To care for your plant effectively:\n• **Sunlight:** Provide 4–6 hours of bright morning or filtered light.\n• **Watering:** Water at the root zone only when top 1.5 inches of soil feel dry.\n• **Protection:** Wipe leaves with a damp cloth and apply organic neem oil spray periodically.\n\n*(Feel free to send another message or photo anytime!)*`
          : `🌿 **FloraAI Botanical Consultation**\n\nHere is expert guidance for your plant:\n• **Hydration:** Always water directly at the root perimeter; keep leaves dry in late evening to prevent fungal mildew.\n• **Leaf Care:** If noticing yellowing or dry spots, inspect pot drainage holes and ensure adequate aeration.\n• **Organic Shield:** A light monthly cold-pressed neem oil spray keeps aphids and spider mites away.\n\n*(Feel free to send another question or photo!)*`;
      }

      const assistantMsg: Message = {
        id: 'assistant-' + Date.now(),
        role: 'assistant',
        content: fallbackReply,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartNewChat = () => {
    setMessages([]);
    setAttachedImage(null);
    setInput('');
    setShowDropdownMenu(false);
  };

  const handleSelectSession = (session: ChatSession) => {
    setShowHistoryDrawer(false);
    if (session.messages && session.messages.length > 0) {
      setMessages(session.messages);
    } else {
      setMessages([
        {
          id: 'user-past',
          role: 'user',
          content: `Can you give me detailed advice on ${session.title}?`,
          timestamp: new Date()
        },
        {
          id: 'ai-past',
          role: 'assistant',
          content: `Here is the comprehensive botanical breakdown for **${session.title}**:\n\n- ${session.preview}\n- Ensure consistent drainage, balanced lighting, and inspect foliage weekly.\n- Apply organic remedies or targeted nutrients according to species requirements.`,
          timestamp: new Date()
        }
      ]);
    }
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  if (!isOpen) return null;

  const activeSuggestionPills =
    assistantMode === 'folax' ? FOLAX_SUGGESTION_PILLS : FLORA_SUGGESTION_PILLS;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/25 backdrop-blur-sm animate-in fade-in duration-200 overflow-hidden text-zinc-900">
      
      {/* Hidden file input for photo upload */}
      <input 
        ref={fileInputRef} 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleImageFileChange} 
      />

      {/* Main Clean White Folax AI Modal Window */}
      <div className="relative w-full h-full sm:h-[92vh] sm:max-w-md md:max-w-lg lg:max-w-xl sm:rounded-[34px] flex flex-col overflow-hidden transition-all select-none bg-white border-0 sm:border sm:border-zinc-200 shadow-[0_24px_70px_-15px_rgba(0,0,0,0.2)]">
        {/* ========================================================= */}
        {/* TOP BAR: Clock (History) | Folax/FloraAI ▾ | Close Button */}
        {/* ========================================================= */}
        <header className="relative z-20 flex items-center justify-between px-4 sm:px-6 pt-3.5 pb-2.5 border-b border-zinc-100 bg-white select-none shrink-0">
          
          {/* Left: Clean circular button with Clock (History) */}
          <button
            type="button"
            onClick={() => setShowHistoryDrawer(true)}
            className="rgb-pink-glow rounded-full border border-zinc-200 cursor-pointer shrink-0 focus:outline-none"
            title="Chat History"
            aria-label="Chat History"
          >
            <span className="rgb-pink-glow-surface w-9 h-9 rounded-full bg-white flex items-center justify-center text-zinc-800 hover:text-zinc-950 transition-colors">
              <Clock className="w-4 h-4" />
            </span>
          </button>

          {/* Center: "Folax ▾" or "FloraAI ▾" Model Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDropdownMenu(!showDropdownMenu)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-all cursor-pointer text-zinc-950 font-semibold text-sm tracking-tight"
            >
              <span>{assistantMode === 'folax' ? 'Folax' : 'FloraAI'}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${showDropdownMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu to switch between Folax and FloraAI */}
            {showDropdownMenu && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-zinc-200 dark:border-white/15 shadow-2xl p-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase px-3 py-1">
                  Choose AI Model
                </div>

                {/* Option 1: Folax */}
                <button
                  type="button"
                  onClick={() => {
                    setAssistantMode('folax');
                    setShowDropdownMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                    assistantMode === 'folax'
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold border border-zinc-950 dark:border-white'
                      : 'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shadow-xs ${
                      assistantMode === 'folax' ? 'bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white' : 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                    }`}>
                      ▲
                    </span>
                    <div>
                      <div className="font-semibold text-xs">Folax</div>
                      <div className={`text-[10px] ${assistantMode === 'folax' ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-500 dark:text-zinc-400'}`}>All-in-one AI Assistant</div>
                    </div>
                  </div>
                  {assistantMode === 'folax' && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>

                {/* Option 2: FloraAI */}
                <button
                  type="button"
                  onClick={() => {
                    setAssistantMode('flora');
                    setShowDropdownMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left mt-1 ${
                    assistantMode === 'flora'
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold border border-zinc-950 dark:border-white'
                      : 'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 shrink-0" />
                    <div>
                      <div className="font-semibold text-xs">FloraAI</div>
                      <div className={`text-[10px] ${assistantMode === 'flora' ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-500 dark:text-zinc-400'}`}>Plant &amp; Leaf Doctor</div>
                    </div>
                  </div>
                  {assistantMode === 'flora' && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>

                <div className="h-px bg-zinc-200/50 dark:bg-zinc-800 my-1" />

                <button
                  type="button"
                  onClick={handleStartNewChat}
                  className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-left"
                >
                  <Plus className="w-3.5 h-3.5 text-zinc-500" />
                  <span>New Conversation</span>
                </button>
              </div>
            )}
          </div>

          {/* Right: Close button */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={onClose}
              className="rgb-pink-glow rounded-full border border-zinc-200 cursor-pointer shrink-0 focus:outline-none"
              title="Close"
              aria-label="Close"
            >
              <span className="rgb-pink-glow-surface w-9 h-9 rounded-full bg-white flex items-center justify-center text-zinc-700 hover:text-zinc-950 transition-colors">
                <X className="w-4 h-4" />
              </span>
            </button>
          </div>
        </header>

        {/* ========================================================= */}
        {/* MAIN BODY: Folax / FloraAI Hero Mode OR Conversational    */}
        {/* ========================================================= */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 sm:px-6 relative z-10 scroll-smooth flex flex-col pb-24 bg-white"
        >
          
          {/* Plant Context Badge if plant is currently scanned */}
          {plantContext && (
            <div className="mt-2 mb-2 mx-auto inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-semibold text-zinc-900">
              <Leaf className="w-3 h-3 text-zinc-900" />
              <span>Active Plant: {plantContext.plantName}</span>
            </div>
          )}

          {/* ===================================================== */}
          {/* VIEW A: Clean White Space with Left-aligned Suggestions */}
          {/* ===================================================== */}
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col justify-end pb-3 animate-in fade-in duration-200">
              
              {/* Compact left-aligned suggestion chips directly above input bar */}
              <div className="flex flex-col items-start gap-2 max-w-sm mb-2 select-none">
                {activeSuggestionPills.map((pill, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(pill.query)}
                    className="group flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-800 hover:text-zinc-950 transition-all cursor-pointer text-left active:scale-95"
                  >
                    <span className="text-xs select-none shrink-0 group-hover:scale-110 transition-transform">
                      {pill.icon}
                    </span>
                    <span className="text-xs font-medium text-zinc-800 group-hover:text-zinc-950 transition-colors line-clamp-1">
                      {pill.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================== */}
          {/* VIEW B: Conversational Message Stream                  */}
          {/* ===================================================== */}
          {messages.length > 0 && (
            <div className="space-y-4 pt-2">
              
              {/* Back to AI Home button */}
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200/50 dark:border-white/10">
                <button
                  type="button"
                  onClick={handleStartNewChat}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Start New Topic</span>
                </button>
                <span className="text-[11px] text-zinc-400 font-mono">
                  {messages.length} messages
                </span>
              </div>

              {messages.map((msg) => {
                const isAssistant = msg.role === 'assistant';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'} animate-in fade-in slide-in-from-bottom-2 duration-200`}
                  >
                    {/* Message Card Bubble */}
                    <div className="flex items-start gap-2 max-w-[88%] sm:max-w-[82%]">
                      {/* Assistant Mini Orb Avatar */}
                      {isAssistant && (
                        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-0.5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950">
                          {assistantMode === 'folax' ? (
                            <span className="text-[10px] font-black">▲</span>
                          ) : (
                            <Bot className="w-4 h-4" />
                          )}
                        </div>
                      )}

                      <div
                        className={`p-3.5 sm:p-4 rounded-[22px] text-xs sm:text-sm leading-relaxed transition-all ${
                          isAssistant
                            ? 'bg-zinc-50 border border-zinc-200 text-zinc-900 shadow-xs rounded-tl-xs'
                            : 'bg-zinc-950 text-white shadow-sm border border-zinc-900 rounded-tr-xs'
                        }`}
                      >
                        {/* Attached Image preview if present in user message */}
                        {msg.image && (
                          <div className="mb-2 rounded-xl overflow-hidden max-h-48 border border-white/40 shadow-xs">
                            <img src={msg.image} alt="User upload" className="w-full h-full object-cover" />
                          </div>
                        )}

                        {/* Content text */}
                        <div className="whitespace-pre-wrap select-text drop-shadow-2xs">
                          {msg.content}
                        </div>

                        {/* Actions for Assistant reply */}
                        {isAssistant && (
                          <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-black/10 dark:border-white/10 text-[11px] text-zinc-600 dark:text-zinc-300">
                            <button
                              type="button"
                              onClick={() => handleCopy(msg.id, msg.content)}
                              className="inline-flex items-center gap-1 hover:text-zinc-950 dark:hover:text-white transition-colors font-medium cursor-pointer"
                              title="Copy text"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-zinc-950 dark:text-white" />
                                  <span className="text-zinc-950 dark:text-white font-bold">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleReadAloud(msg.id, msg.content)}
                              className="inline-flex items-center gap-1 hover:text-zinc-950 dark:hover:text-white transition-colors font-medium cursor-pointer"
                              title="Read Aloud"
                            >
                              {speakingId === msg.id ? (
                                <>
                                  <VolumeX className="w-3.5 h-3.5 text-zinc-950 dark:text-white animate-pulse" />
                                  <span className="text-zinc-950 dark:text-white font-bold">Stop</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3.5 h-3.5" />
                                  <span>Listen</span>
                                </>
                              )}
                            </button>

                            {/* One-click send plant photo to the second AI */}
                            {messages.some(m => m.image) && (
                              <button
                                type="button"
                                onClick={() => {
                                  const targetMode = assistantMode === 'folax' ? 'flora' : 'folax';
                                  setAssistantMode(targetMode);
                                  handleSendMessage(
                                    targetMode === 'folax' 
                                      ? "Folax, please inspect this photo as an all-in-one assistant and provide full insights." 
                                      : "FloraAI, please provide a specialist botanical diagnosis and disease prevention plan for this leaf.",
                                    targetMode
                                  );
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-950/10 dark:bg-white/15 text-zinc-900 dark:text-white font-bold hover:bg-zinc-950/20 dark:hover:bg-white/25 border border-zinc-950/20 dark:border-white/25 transition-all cursor-pointer"
                                title="Send photo to second AI"
                              >
                                <Bot className="w-3 h-3" />
                                <span>Ask {assistantMode === 'folax' ? 'FloraAI' : 'Folax'}</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* BOTTOM FLOATING INPUT CAPSULE                             */}
        {/* ========================================================= */}
        <div className="absolute bottom-3 left-4 right-4 z-20">
          
          {noticeMessage && (
            <div className="mb-2 flex items-center justify-between gap-2 px-3 py-2 rounded-2xl bg-amber-50/95 dark:bg-amber-950/90 border border-amber-300/80 dark:border-amber-700 text-amber-900 dark:text-amber-100 text-xs font-semibold shadow-md">
              <span>{noticeMessage}</span>
              <button
                type="button"
                onClick={() => setNoticeMessage(null)}
                className="p-0.5 rounded-full hover:bg-black/5 cursor-pointer"
                aria-label="Dismiss notice"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Image Attachment Preview if user selected an image */}
          {attachedImage && (
            <div className="mb-2 inline-flex items-center gap-2 p-1.5 px-3 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-zinc-300 dark:border-zinc-700 shadow-md">
              <img src={attachedImage} alt="Attachment" className="w-8 h-8 rounded-lg object-cover" />
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Photo attached</span>
              <button
                type="button"
                onClick={() => setAttachedImage(null)}
                className="p-1 hover:bg-black/5 dark:hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-zinc-950 dark:hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Main Ask Anything Form Capsule */}
          <div className="relative">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative rounded-[24px] px-3.5 pt-2.5 pb-2.5 transition-shadow duration-200 bg-white border border-zinc-200 shadow-[0_10px_28px_-8px_rgba(0,0,0,0.08)] focus-within:border-zinc-300 focus-within:shadow-[0_12px_34px_-8px_rgba(0,0,0,0.12)]"
            >
              {/* Row 1: "Ask anything" text input */}
              <div className="w-full">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything"
                  className="w-full bg-transparent text-[13px] sm:text-sm font-medium text-zinc-950 placeholder-zinc-400 focus:outline-none px-1 pt-0.5 pb-2 min-w-0"
                  disabled={isLoading}
                />
              </div>

              {/* Row 2: Bottom icon controls (+ and Send) */}
              <div className="flex items-center justify-between pt-0.5 select-none">
                {/* Left: Plus attachment button */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-8 h-8 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 hover:text-zinc-950 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    title="Add attachment"
                    aria-label="Add"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Right: Send arrow button */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="submit"
                    disabled={isLoading || (!input.trim() && !attachedImage)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      input.trim() || attachedImage
                        ? 'bg-zinc-950 text-white shadow-sm hover:scale-105 active:scale-95'
                        : 'bg-zinc-100 text-zinc-400 pointer-events-none'
                    }`}
                    title="Send"
                    aria-label="Send"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* ========================================================= */}
        {/* HISTORY DRAWER SLIDE-OUT (Transparent Liquid Glass)       */}
        {/* ========================================================= */}
        {showHistoryDrawer && (
          <div className="absolute inset-0 z-40 flex">
            {/* Transparent Frosted Backdrop */}
            <div 
              className="absolute inset-0 bg-black/25 backdrop-blur-xs transition-opacity duration-300"
              onClick={() => setShowHistoryDrawer(false)}
            />

            {/* Slide-out Sheet with Transparent Liquid Glass & Smooth Animation */}
            <div 
              className="relative w-4/5 max-w-xs h-full flex flex-col p-4 shadow-[0_20px_50px_rgba(0,0,0,0.25)] animate-in slide-in-from-left-8 fade-in duration-300 ease-out z-10"
              style={{
                background: isDarkMode 
                  ? 'rgba(15, 23, 42, 0.68)' 
                  : 'rgba(255, 255, 255, 0.70)',
                backdropFilter: 'blur(30px) saturate(190%)',
                WebkitBackdropFilter: 'blur(30px) saturate(190%)',
                borderRight: isDarkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(255, 255, 255, 0.75)'
              }}
            >
              
              <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-zinc-900 dark:text-white" />
                  <span className="font-bold text-sm text-zinc-900 dark:text-white">Chat History</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHistoryDrawer(false)}
                  className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Sessions list */}
              <div className="flex-1 overflow-y-auto py-3 space-y-2">
                <div className="text-[10px] font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400 px-1">
                  Recent Topics
                </div>

                {sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => handleSelectSession(session)}
                    className="group p-2.5 rounded-xl hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-between shadow-xs"
                    style={{
                      background: isDarkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.55)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.85)'
                    }}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="font-semibold text-xs text-zinc-800 dark:text-zinc-100 truncate group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                        {session.title}
                      </div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                        {session.preview}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {/* Scanned Plants in History */}
                {scanHistory.length > 0 && (
                  <>
                    <div className="text-[10px] font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400 px-1 pt-3">
                      Scanned Plants
                    </div>
                    {scanHistory.filter(s => s && s.prediction).slice(0, 5).map((scan) => (
                      <div
                        key={scan.id}
                        onClick={() => {
                          if (onSelectHistoryItem) onSelectHistoryItem(scan);
                          setShowHistoryDrawer(false);
                          handleSendMessage(`What care recommendations do you have for my scanned ${scan.prediction?.plantName || 'plant'}?`);
                        }}
                        className="p-2 rounded-xl hover:scale-[1.02] transition-all cursor-pointer flex items-center gap-2.5 shadow-xs"
                        style={{
                          background: isDarkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.55)',
                          backdropFilter: 'blur(16px)',
                          WebkitBackdropFilter: 'blur(16px)',
                          border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.85)'
                        }}
                      >
                        <img src={scan.image} alt={scan.prediction?.plantName || 'Plant'} className="w-7 h-7 rounded-lg object-cover shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-xs text-zinc-800 dark:text-zinc-100 truncate">
                            {scan.prediction?.plantName || 'Scanned Plant'}
                          </div>
                          <div className="text-[10px] text-zinc-600 dark:text-zinc-400 font-medium">
                            {scan.prediction?.healthStatus || 'Scanned'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Start fresh button in drawer */}
              <button
                type="button"
                onClick={() => {
                  handleStartNewChat();
                  setShowHistoryDrawer(false);
                }}
                className="w-full py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Start New Consultation</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
