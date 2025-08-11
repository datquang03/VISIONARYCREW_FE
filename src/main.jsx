import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";


createRoot(document.getElementById("root")).render(
  // <StrictMode> - Commented out để tránh duplicate API calls trong development
    <Provider store={store}>
      <App />
    </Provider>
  // </StrictMode>
);
