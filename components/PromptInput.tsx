'use client';

export default function PromptInput({
  input,
  isLoading,
  handleInputChange,
  handleSubmit,
}: any) {
  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t bg-white/80 backdrop-blur-lg shadow-lg"
    >
      <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full shadow-sm">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Send a message..."
          className="flex-1 bg-transparent outline-none text-gray-700"
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
            isLoading
              ? 'bg-gray-300 text-gray-500'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          Send
        </button>
      </div>
    </form>
  );
}
