// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import Router from "./utils/Router/Router.jsx";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { Provider, useSelector } from "react-redux";
import store from "./stateManagement/store/store.js";
import RootModal from "./components/Modals/RootModal.jsx";



createRoot(document.getElementById("root")).render(
  <Provider store={store}> {/* Wrap with Provider */}
    <RouterProvider router={Router} />
    <ToastContainer />
    <RootModal />
  </Provider>
);
