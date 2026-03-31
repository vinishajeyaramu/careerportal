import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import JobPost from "./context/JobDescription.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <JobPost>
        <App />
      </JobPost>
    </AuthProvider>
  </StrictMode>
);
