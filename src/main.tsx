import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app/App";
import "./styles/global.css";

// Add platform CSS class to <html> for platform-aware styling
// so CSS rules can target Windows vs macOS without runtime overhead.
const ua = navigator.userAgent;
if (/Windows/i.test(ua)) {
  document.documentElement.classList.add("os-windows");
} else if (/Mac/i.test(ua)) {
  document.documentElement.classList.add("os-mac");
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
