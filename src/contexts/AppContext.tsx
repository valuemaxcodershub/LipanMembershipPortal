import { ReactNode, useEffect, useReducer, useState } from "react";
import { AppContext } from "./createContexts/app";
import axios from "../config/axios";

// --- Define State & Action Types ---
type AppState = {
  areasOfInterest: any[];
  levelOfLearners: any[];
};

type AppAction =
  | { type: "SET_INTERESTS"; payload: any[] }
  | { type: "SET_LEVELS"; payload: any[] };

// --- Initial State ---
const initialState: AppState = {
  areasOfInterest: [],
  levelOfLearners: [],
};

// --- Reducer Function ---
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_INTERESTS":
      return { ...state, areasOfInterest: action.payload };
    case "SET_LEVELS":
      return { ...state, levelOfLearners: action.payload };
    default:
      return state;
  }
}

// --- Provider Component ---
const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const htmlElement = document.documentElement;

    // Function to check if the "dark" class is present
    const checkDarkMode = () => {
      setIsDarkMode(htmlElement.classList.contains("dark"));
    };

    // Create a MutationObserver to watch for class changes
    const observer = new MutationObserver(() => {
      checkDarkMode();
    });

    // Start observing the `class` attribute of the `html` tag
    observer.observe(htmlElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Initial check
    checkDarkMode();

    // Cleanup observer on component unmount
    return () => {
      observer.disconnect();
    };
  }, []);


  useEffect(() => {
    async function getData() {
      try {
        const { data: interests } = await axios.get("/interests/");
        const { data: levels } = await axios.get("/levels/");
        console.log(interests, levels);

        dispatch({ type: "SET_INTERESTS", payload: interests });
        dispatch({ type: "SET_LEVELS", payload: levels });
      } catch (error) {
        console.error("Failed to fetch app context data:", error);
      }
    }

    getData();

    // If needed for live updates, uncomment below
    // const intervalId = setInterval(getData, 60000);
    // return () => clearInterval(intervalId);
  }, []);

  return (
    <AppContext.Provider value={{ ...state, isDarkMode }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
