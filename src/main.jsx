import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import "./index.scss";
import store from "./redux/store.js";
import routes from "./routes/routes.jsx";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <Provider store={store}>
      <Toaster />
      <RouterProvider router={routes} />
    </Provider>
  // </React.StrictMode>
);
