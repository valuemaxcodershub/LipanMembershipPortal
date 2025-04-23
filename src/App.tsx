// import { DarkThemeToggle } from "flowbite-react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./Routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useApp } from "./hooks/app";
function App() {
  const { isDarkMode } = useApp();
  return (
    <>
      <Router>
        <AppRoutes />
      </Router>
      <ToastContainer
        theme={isDarkMode ? "dark" : "light"}
        autoClose={10_000}
        stacked
      />
    </>
  );
}

export default App;
