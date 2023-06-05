import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import GlobalProvider from "./contexts/index.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </React.StrictMode>
);
