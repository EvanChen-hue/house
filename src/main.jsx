import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AntdProvider from "@/app/providers/AntdProvider.jsx";
import App from "@/app/App.jsx";
import "antd/dist/reset.css";
import "@/styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AntdProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AntdProvider>
  </React.StrictMode>
);
