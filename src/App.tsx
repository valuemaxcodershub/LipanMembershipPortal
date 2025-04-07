// import { DarkThemeToggle } from "flowbite-react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./Routes";
import { ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <main className="min-h-screen">
      <Router>
        <AppRoutes />
      </Router>
      <ToastContainer/>
    </main>
  );
}

export default App;
