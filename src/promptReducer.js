// This is the starting point for our app's data
// Function to safely get data from storage on startup
const getSavedHistory = () => {
  const saved = localStorage.getItem("ai_history");
  return saved ? JSON.parse(saved) : [];
};

export const initialState = {
  promptInput: "",
  result: "",
  status: "idle",
  history: getSavedHistory(), // Now it loads from the browser!
  config: {
    temperature: 0.7,
  }
};

export function promptReducer(state, action) {
  // Think of 'action.type' as the "command" we send to the brain
  switch (action.type) {
    case "SET_INPUT":
      return { ...state, promptInput: action.payload };
    
    case "START_RUN":
      return { ...state, status: "loading", result: "" };

    case "FINISH_RUN":
      return { 
        ...state, 
        status: "success", 
        result: action.payload,
        // Add the new result to the start of the history array
        history: [{ prompt: state.promptInput, response: action.payload }, ...state.history]
      };

    case "SET_CONFIG":
      return { ...state, config: { ...state.config, ...action.payload } };

    case "SET_ERROR":
      return { ...state, status: "error", result: "Something went wrong..." };

    default:
      return state;
  }
}