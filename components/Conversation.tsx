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
    <div className="flex items-center gap-1 bg-white px-4 py-2 rounded-xl shadow border border-gray-200 w-fit">
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
    </div>
  );
}

export default function Conversation({ messages, isTyping }: ConversationProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

return (
  <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 w-full scrollbar-none">
    {messages.length === 0 ? (
      <div className="flex items-center justify-center h-full text-gray-400 text-lg">
        Start a conversation 👋
      </div>
    ) : (
      messages.map((msg) => (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Message message={msg} />
        </motion.div>
      ))
    )}

    {isTyping && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-start"
      >
        <TypingDots />
      </motion.div>
    )}

    <div ref={bottomRef} />
  </div>
);

}
