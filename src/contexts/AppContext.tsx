import { ReactNode, useEffect, useState } from "react";
import { AppContext } from "./createContexts/app";
import axios from "../config/axios";

const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [areasOfInterest, setAreasOfInterest] = useState<any>([]);
  const [levelOfLearners, setLevelOfLearners] = useState<any>([]);

  useEffect(() => {
    async function getData(){
      try {
        const { data } = await axios.get("/interests/");
        const { data: levelOfLearners } = await axios.get("/levels/");
        console.log(data, levelOfLearners);
        setAreasOfInterest(data);
        setLevelOfLearners(levelOfLearners);
      } catch (error) {
        console.error(error);
      }
    }
    getData();
    // const intervalId = setInterval(getData, 60000)
    // return ()=> clearInterval(intervalId)
  }, []);
  return (
    <AppContext.Provider value={{ areasOfInterest, levelOfLearners }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;