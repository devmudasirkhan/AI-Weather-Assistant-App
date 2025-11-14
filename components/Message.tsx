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
   <div className={`flex w-full px-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[78%] px-5 py-3 rounded-2xl shadow-md 
        ${isUser 
          ? 'bg-indigo-600 text-white rounded-br-none' 
          : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
        }`}
      >
        {/* Normal Text */}
        {textContent && <p className="whitespace-pre-wrap text-[15px]">{textContent}</p>}

        {/* Tool Call UI */}
        {toolCalls.length > 0 && (
          <div className="mt-3">
            {toolCalls.map((tc: any, i) => (
              <ToolCall key={i} toolName={tc.toolName} args={tc.args} />
            ))}
          </div>
        )}

        {/* Tool Results */}
        {toolResults.length > 0 && (
          <div className="mt-3 space-y-3">
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
