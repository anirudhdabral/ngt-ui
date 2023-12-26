import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { AppRoutes } from "./routes/AppRoutes";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick
        pauseOnHover={false}
        theme="light"
      />
    </BrowserRouter>
  </React.StrictMode>
);
