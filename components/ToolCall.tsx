export default function ToolCall({ toolName, args }: { toolName: string; args: any }) {
  return (
    <div className="mt-2 p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-gray-800 text-sm">
      <div className="font-semibold">Tool Call: {toolName}</div>
      <pre className="text-xs mt-1">{JSON.stringify(args, null, 2)}</pre>
    </div>
  );
}
