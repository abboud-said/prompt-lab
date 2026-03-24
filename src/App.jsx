import { useReducer } from "react";
import { initialState, promptReducer } from "./promptReducer";
import { Sparkles, History, Settings, Send } from "lucide-react";
import { runAI } from "./gemini";
import { useEffect } from "react";

function App() {
  // 1. Initialize the reducer
  const [state, dispatch] = useReducer(promptReducer, initialState);

// EFFECT: Sync history to LocalStorage whenever it changes
useEffect(() => {
  localStorage.setItem("ai_history", JSON.stringify(state.history));
}, [state.history]); // This "Dependency Array" is key!

  const handleRun = async () => {
  if (!state.promptInput.trim()) return;

  // 1. Tell the brain to start loading
  dispatch({ type: "START_RUN" });

  try {
    // 2. Call the AI service with our prompt and temperature
    const aiResponse = await runAI(state.promptInput, state.config.temperature);

    // 3. Tell the brain we finished and send the answer
    dispatch({ type: "FINISH_RUN", payload: aiResponse });
  } catch (error) {
    // 4. If the internet fails or the key is wrong
    dispatch({ type: "SET_ERROR" });
    console.error(error);
  }
};

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8 font-sans">
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-4">
          AI Prompt Lab
        </h1>
        <p className="text-zinc-400">Master the art of AI communication</p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Controls & Input */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <label className="flex items-center gap-2 text-sm font-medium mb-4 text-blue-400">
              <Sparkles size={18} /> Enter Your Prompt
            </label>
            <textarea
              className="w-full h-40 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="e.g., Explain the useReducer hook like I'm 5..."
              value={state.promptInput}
              onChange={(e) => dispatch({ type: "SET_INPUT", payload: e.target.value })}
            />
           <button 
  onClick={handleRun}
  className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
  disabled={state.status === "loading"}
>
  {state.status === "loading" ? (
    <>
      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      <span>Processing...</span>
    </>
  ) : (
    <>
      <Send size={18} />
      <span>Run Experiment</span>
    </>
  )}
</button>

          </div>
          {/* Loading Skeleton */}
{state.status === "loading" && (
  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 animate-pulse">
    <div className="h-4 bg-zinc-800 rounded w-1/4 mb-4"></div>
    <div className="space-y-3">
      <div className="h-3 bg-zinc-800 rounded w-full"></div>
      <div className="h-3 bg-zinc-800 rounded w-5/6"></div>
      <div className="h-3 bg-zinc-800 rounded w-4/6"></div>
    </div>
  </div>
)}

          {/* Result Display */}
          {state.result && (
            <div className="bg-zinc-900 border border-emerald-900/30 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-emerald-400 font-bold mb-2">AI Response:</h3>
              <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{state.result}</p>
            </div>
          )}
        </div>

        {/* Right Column: Settings & History */}
        <div className="space-y-6">
          {/* Settings Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="flex items-center gap-2 font-bold mb-4">
              <Settings size={18} /> Settings
            </h3>
            <label className="text-sm text-zinc-400 block mb-2">
              Temperature: {state.config.temperature}
            </label>
            <input 
              type="range" min="0" max="1" step="0.1"
              className="w-full accent-blue-500"
              value={state.config.temperature}
              onChange={(e) => dispatch({ type: "SET_CONFIG", payload: { temperature: parseFloat(e.target.value) } })}
            />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
              <span>Precise</span>
              <span>Creative</span>
            </div>
          </div>

          {/* History Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="flex items-center gap-2 font-bold mb-4">
              <History size={18} /> History
            </h3>
            <div className="space-y-3">
              {state.history.length === 0 && <p className="text-xs text-zinc-600 italic">No experiments yet...</p>}
              {state.history.map((item, index) => (
                <div key={index} className="p-2 bg-zinc-950 rounded border border-zinc-800 text-xs truncate text-zinc-400">
                  {item.prompt}
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;