import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import AuthContextProvider from "./contexts/AuthContext.tsx";
import PaymentProvider from "./contexts/PaymentContext.tsx";
import AppContextProvider from "./contexts/AppContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppContextProvider>
      <AuthContextProvider>
        <PaymentProvider>
          <App />
        </PaymentProvider>
      </AuthContextProvider>
    </AppContextProvider>
  </React.StrictMode>
);
