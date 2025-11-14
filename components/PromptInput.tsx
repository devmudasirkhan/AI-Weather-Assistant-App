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
      className="p-5 border-t border-gray-700/50 bg-gray-800/90 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.3)]"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 bg-gray-800 border border-gray-700/50 px-5 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-500/50">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about the weather..."
            className="flex-1 bg-transparent outline-none text-gray-100 placeholder:text-gray-500 text-[15px]"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
              isLoading || !input.trim()
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-500 hover:to-indigo-600 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 active:scale-95'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Sending</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Send</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
