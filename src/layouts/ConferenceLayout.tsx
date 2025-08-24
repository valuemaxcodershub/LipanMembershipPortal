import React from "react";
import NavigationBar from "../components/UI/MainSiteNav";
import { Outlet } from "react-router-dom";

function ConferenceLayout() {
  return (
    <>
      <div className="fixed flex justify-center top-5 w-full z-50 xl:px-32">
        <NavigationBar />
      </div>
      <Outlet />
    </>
  );
}

export default ConferenceLayout;
