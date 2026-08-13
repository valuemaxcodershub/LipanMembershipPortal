import React from "react";
import NavigationBar from "../components/UI/MainSiteNav";
import { Outlet } from "react-router-dom";

function ConferenceLayout() {
  return (
    <div className="ms-form-page min-h-screen">
      <div className="fixed flex justify-center top-5 w-full z-50 xl:px-32">
        <NavigationBar />
      </div>
      <Outlet />
    </div>
  );
}

export default ConferenceLayout;
