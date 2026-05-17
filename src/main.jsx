import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"

import "./index.css"

import { Toaster } from "react-hot-toast"

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>

    <App />

    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "#090909",
          color: "#39ff14",
          border: "1px solid #222"
        }
      }}
    />

  </React.StrictMode>
)