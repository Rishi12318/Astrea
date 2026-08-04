import { useState, useRef, useEffect } from 'react';
import { chatWithAssistant } from '../services/api';
import type { ChatbotResponse } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! 👋 I\'m your AI Beauty Assistant. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  async function handleSend() {
    const text = input.trim();
    if (!text || busy) return;

    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setBusy(true);

    try {
      const reply: ChatbotResponse = await chatWithAssistant(text);

      const words = reply.answer.split(' ');
      let current = '';
      for (let i = 0; i < words.length; i++) {
        current += (i > 0 ? ' ' : '') + words[i];
        setTyping(current);
        await new Promise((r) => setTimeout(r, 30));
      }
      setTyping('');
      setMessages((prev) => [...prev, { role: 'assistant', content: reply.answer, citations: reply.citations }]);
    } catch {
      setTyping('');
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="mb-4">
        <h1 className="font-serif italic text-3xl font-semibold text-[#1a1a1a]">AI Beauty Assistant</h1>
        <p className="mt-1 text-sm text-[#5A4F43]/55">Chat with our AI for personalized beauty advice.</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-[#E5DDD3] bg-white p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#550000] text-sm text-white">🤖</div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#550000] text-white'
                  : 'bg-[#F0EBE3]/50 text-[#1a1a1a]'
              }`}>
                <p>{msg.content}</p>
                {msg.citations && msg.citations.length > 0 && (
                  <p className="mt-2 border-t border-[#E5DDD3] pt-2 text-xs text-[#5A4F43]/40">Sources: {msg.citations.join(', ')}</p>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E5DDD3] text-sm">🙂</div>
              )}
            </div>
          ))}

          {typing && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#550000] text-sm text-white">🤖</div>
              <div className="max-w-[80%] rounded-2xl bg-[#F0EBE3]/50 px-4 py-3 text-sm leading-relaxed text-[#1a1a1a]">
                <p>{typing}<span className="animate-pulse">|</span></p>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="mt-4">
        <div className="mx-auto max-w-3xl flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask about makeup, skin care, recommendations..."
            className="flex-1 rounded-xl border border-[#E5DDD3] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#550000] focus:ring-2 focus:ring-[#550000]/10"
          />
          <button
            disabled={busy || !input.trim()}
            onClick={handleSend}
            className="rounded-xl bg-[#550000] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#450000] disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
