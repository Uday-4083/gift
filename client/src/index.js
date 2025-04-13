import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Optional: Add this file for global styles
import App from "./App"; // Ensure App.js exists in the same directory
import "./utils/axiosConfig"; // Import axios configuration

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);