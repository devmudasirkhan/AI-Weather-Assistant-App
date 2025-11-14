'use client';

import Conversation from '../components/Conversation';
import PromptInput from '../components/PromptInput';
import { useState, useEffect } from 'react';
import { UIMessage } from '@ai-sdk/react';

export default function Page() {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);


  useEffect(() => {
    const saved = localStorage.getItem('weather-chat-history');
    if (saved) {
      const parsed = JSON.parse(saved);
      const normalized = parsed.map((msg: any) => {
        if (msg.parts) return msg;
        if (msg.content) {
          return {
            id: msg.id || Date.now().toString(),
            role: msg.role,
            parts: msg.content.map((c: any) => ({
              type: 'text',
              text: c.text,
            })),
          };
        }
        return msg;
      });
      setMessages(normalized);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem('weather-chat-history', JSON.stringify(messages));
  }, [messages, loaded]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: UIMessage = {
      id: Date.now().toString(),
      role: 'user',
      parts: [{ type: 'text', text: input }],
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = JSON.parse(localStorage.getItem('weather-chat-history') || '[]');
      const messagesToSend = [...history, userMessage]
        .map((msg) => ({
          role: msg.role,
          content: msg.parts
            .filter((p: any) => p.type === 'text')
            .map((p: any) => p.text)
            .join(''),
        }))
        .filter((msg) => msg.content.trim() !== '');

      setIsTyping(true);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesToSend }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      setIsTyping(false);

      let assistantText = '';
      const assistantId = (Date.now() + 1).toString();
      const toolResults: any[] = [];

      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: 'assistant', parts: [{ type: 'text', text: '' }] },
      ]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const toolMatch = chunk.match(/__TOOL__(.+?)__TOOL__/g);

          if (toolMatch) {
            toolMatch.forEach((match) => {
              const toolData = JSON.parse(match.replace(/__TOOL__/g, ''));
              toolResults.push(toolData);
            });
            assistantText += chunk.replace(/__TOOL__.+?__TOOL__/g, '');
          } else {
            assistantText += chunk;
          }

          const parts: any[] = [];
          if (assistantText) parts.push({ type: 'text', text: assistantText });

          toolResults.forEach((tool) => {
            parts.push({
              type: 'tool-result',
              toolName: tool.toolName,
              result: tool.result,
            });
          });

          setMessages((prev) => {
            const updated = prev.slice(0, -1);
            return [...updated, { id: assistantId, role: 'assistant', parts }];
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-white">

      <header className="p-4 border-b text-center text-lg font-semibold text-gray-800 shadow-sm shrink-0">
        Gemini Weather Assistant
      </header>

      <Conversation messages={messages} isTyping={isTyping} />

      <PromptInput
        input={input}
        isLoading={isLoading}
        handleInputChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
