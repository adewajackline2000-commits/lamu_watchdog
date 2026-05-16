import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Bot, User, Loader2 } from "lucide-react";
import { ChatMessage } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface ChatInterfaceProps {
  onAsk: (question: string) => Promise<string>;
  disabled: boolean;
}

export default function ChatInterface({ onAsk, disabled }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || disabled) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const answer = await onAsk(userMessage);
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm sorry, I couldn't process that question right now." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-[600px] border border-line rounded-2xl bg-white overflow-hidden shadow-lg">
      <div className="p-4 border-b border-line bg-zinc-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-ink text-bg rounded-lg">
            <MessageSquare size={18} />
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase tracking-tight">Citizen Watchdog Assistant</h3>
            <p className="text-[10px] opacity-50 font-medium">Powered by Gemini AI • PDF Contextual Search</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none">
            <Bot size={48} className="mb-4" />
            <p className="font-medium italic">Ask anything about the uploaded budget...</p>
            <p className="text-xs px-12">"Which department gets the most money?" "Are there any health projects in Mpeketoni?"</p>
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`
                p-2 rounded-lg h-fit
                ${msg.role === "user" ? "bg-ink text-bg" : "bg-zinc-100 text-ink"}
              `}>
                {msg.role === "user" ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={`
                max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed
                ${msg.role === "user" ? "bg-zinc-50 border border-line" : "bg-white border border-line"}
              `}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex gap-4">
            <div className="p-2 rounded-lg h-fit bg-zinc-100 text-ink">
              <Bot size={18} />
            </div>
            <div className="p-4 rounded-2xl bg-white border border-line flex items-center gap-2">
              <Loader2 size={16} className="animate-spin opacity-50" />
              <span className="text-xs opacity-50 animate-pulse">Consulting document...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-zinc-50 border-t border-line">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={disabled || isLoading}
            placeholder={disabled ? "Upload a PDF first to ask questions" : "Ask about allocations, wards or specific projects..."}
            className="w-full bg-white border border-line rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-ink transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || disabled}
            className="absolute right-2 p-2 bg-ink text-bg rounded-lg hover:opacity-90 disabled:opacity-20 transition-all"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
