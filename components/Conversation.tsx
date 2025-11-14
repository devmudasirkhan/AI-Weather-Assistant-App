import Message from './Message';
import { motion } from 'framer-motion';
import { UIMessage } from '@ai-sdk/react';
import { useEffect, useRef } from 'react';

interface ConversationProps {
  messages: UIMessage[];
  isTyping: boolean;
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 bg-gray-800 px-5 py-3 rounded-2xl shadow-lg border border-gray-700/50 w-fit backdrop-blur-sm">
      <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
      <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
      <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
    </div>
  );
}

export default function Conversation({ messages, isTyping }: ConversationProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

return (
  <div className="flex-1 overflow-y-auto px-4 md:px-6 py-8 space-y-5 w-full max-w-4xl mx-auto scrollbar-none">
    {messages.length === 0 ? (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20 border border-indigo-500/30">
          <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p className="text-gray-300 text-lg font-medium">Start a conversation</p>
        <p className="text-gray-400 text-sm mt-1">Ask me about the weather anywhere in the world!</p>
      </div>
    ) : (
      messages.map((msg) => (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Message message={msg} />
        </motion.div>
      ))
    )}

    {isTyping && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex justify-start"
      >
        <TypingDots />
      </motion.div>
    )}

    <div ref={bottomRef} />
  </div>
);

}
