import { createContext } from "react";

type AppContextType = {
     areasOfInterest: any[];
     levelOfLearners: any[];
     isDarkMode: boolean;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);