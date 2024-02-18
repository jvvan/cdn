import { StoreProvider } from "easy-peasy";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { store } from "./store.ts";
import { Toaster } from "./components/ui/sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StoreProvider store={store}>
    <App />
    <Toaster duration={3000} expand />
  </StoreProvider>
);
