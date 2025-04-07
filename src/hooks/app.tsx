import { useContext } from "react";
import { AppContext } from "../contexts/createContexts/app";

export const useApp = () => {
     const context = useContext(AppContext);
     if(!context){
          throw new Error("useApp must be used within an AppContextProvider");
     }
     return context;
}