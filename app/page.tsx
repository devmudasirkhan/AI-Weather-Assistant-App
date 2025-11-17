'use client';

import Conversation from '../components/Conversation';
import PromptInput from '../components/PromptInput';
import LoginScreen from '../components/LoginScreen';
import { useState, useEffect } from 'react';
import { UIMessage } from '@ai-sdk/react';

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('weather-assistant-auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setCheckingAuth(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

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
  }, [isAuthenticated]);

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
      let toolCalls: any[] = [];
      let toolResults: any[] = [];

      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: 'assistant', parts: [{ type: 'text', text: '' }] },
      ]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });

          console.log(chunk, "streamchunk");

          const toolCallMatches = [...chunk.matchAll(/__TOOLCALL__(.*?)__TOOLCALL__/gs)];
          toolCallMatches.forEach((m) => {
            try {
              const json = JSON.parse(m[1]);
              toolCalls.push(json);
            } catch { }
          });

          const toolResultMatches = [...chunk.matchAll(/__TOOLRESULT__(.*?)__TOOLRESULT__/gs)];
          toolResultMatches.forEach((m) => {
            try {
              const json = JSON.parse(m[1]);
              toolResults.push(json);
            } catch { }
          });

          const cleanedText = chunk
            .replace(/__TOOLCALL__.*?__TOOLCALL__/gs, '')
            .replace(/__TOOLRESULT__.*?__TOOLRESULT__/gs, '');

          assistantText += cleanedText;

          const parts: any[] = [];
          if (assistantText.trim() !== '') {
            parts.push({ type: 'text', text: assistantText });
          }

          toolCalls.forEach((call) => {
            parts.push({
              type: "tool-call",
              toolName: call.toolName,
              args: call.args,
            });
          });

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

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950">
      <header className="p-5 border-b border-gray-700/50 bg-gray-800/80 backdrop-blur-xl shadow-lg shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Gemini Weather Assistant
          </h1>
        </div>
      </header>

      <Conversation messages={messages} isTyping={isTyping} />

      <PromptInput
        input={input}
        isLoading={isLoading}
        handleInputChange={(e: any) => setInput(e.target.value)}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
