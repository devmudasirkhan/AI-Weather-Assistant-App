export default function ToolCall({ toolName, args }: { toolName: string; args: any }) {
  return (
    <div className="mt-2 p-3.5 bg-gradient-to-br from-amber-900/30 to-yellow-900/30 border border-amber-700/40 rounded-xl text-gray-200 text-sm shadow-sm">
      <div className="font-semibold text-amber-400 mb-1.5 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>Tool Call: {toolName}</span>
      </div>
      <pre className="text-xs mt-1.5 bg-gray-900/60 p-2 rounded-lg border border-amber-800/30 overflow-x-auto text-gray-300">{JSON.stringify(args, null, 2)}</pre>
    </div>
  );
}
