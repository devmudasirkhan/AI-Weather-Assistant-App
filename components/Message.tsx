import React from 'react';
import WeatherCard from './WeatherCard';
import ToolCall from './ToolCall';
import { UIMessage } from '@ai-sdk/react';

export default function Message({ message }: { message: UIMessage }) {
  const { role, parts } = message;

  const textContent = parts
    .filter((p: any) => p.type === 'text')
    .map((p: any) => p.text)
    .join('');

  const toolCalls = parts.filter((p: any) => p.type === 'tool-call');
  const toolResults = parts.filter((p: any) => p.type === 'tool-result');

  const isUser = role === 'user';

  return (
   <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] md:max-w-[75%] px-5 py-3.5 rounded-2xl shadow-lg
        ${isUser 
          ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-br-sm shadow-indigo-500/30' 
          : 'bg-gray-800 text-gray-100 border border-gray-700/50 rounded-bl-sm shadow-gray-900/50'
        }`}
      >
        {/* Normal Text */}
        {textContent && (
          <p className={`whitespace-pre-wrap text-[15px] leading-relaxed ${isUser ? 'text-white' : 'text-gray-100'}`}>
            {textContent}
          </p>
        )}

        {toolCalls.length > 0 && (
          <div className="mt-3">
            {toolCalls.map((tc: any, i) => (
              <ToolCall key={i} toolName={tc.toolName} args={tc.args} />
            ))}
          </div>
        )}

        {toolResults.length > 0 && (
          <div className="mt-4 space-y-3">
            {toolResults.map((toolRes: any, i) => {
              if (toolRes.toolName === 'get_current_weather') {
                return <WeatherCard key={i} {...toolRes.result} />;
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
}
