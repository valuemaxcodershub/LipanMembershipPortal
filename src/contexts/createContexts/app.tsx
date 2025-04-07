import { createContext } from "react";

type AppContextType = {
     areasOfInterest: any[];
     levelOfLearners: any[];
}

export const AppContext = createContext<AppContextType | undefined>(undefined);