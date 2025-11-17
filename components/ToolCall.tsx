import React from 'react';

export default function ToolCallUI({
  toolName,
  params,
  loading,
}: {
  toolName: string;
  params: any;
  loading: boolean;
}) {

  return (
    <div className="border border-gray-700 bg-gray-900 rounded-xl p-3 text-white">
      <div className="font-bold text-blue-400 text-sm">
        🔧 Tool Call: {toolName}
      </div>

      <div className="text-sm mt-2">
        <div className="font-semibold">Parameters:</div>
        <pre className="bg-black/40 p-2 rounded text-green-300 text-xs">
          {Object.entries(params).map(([key, value]) => (
            <div key={key}>
              {key}: {String(value)}
            </div>
          ))}
        </pre>
      </div>

      <div className="mt-2 text-yellow-300 text-xs">
        {loading ? '⏳ Running…' : '✅ Completed'}
      </div>
    </div>
  );
}
