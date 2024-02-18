import axios from "axios";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useStoreActions, useStoreState } from "./store";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Navbar } from "./components/ui/navbar";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { SettingsPage } from "./pages/SettingsPage";
import { TokensPage } from "./pages/TokensPage";
import { UploadPage } from "./pages/UploadPage";
import { UsersPage } from "./pages/UsersPage";
import { WhitelistedOnly } from "./routes/WhitelistedOnly";
import { LoadingPage } from "./pages/LoadingPage";

function App() {
  const loading = useStoreState((state) => state.loading);
  const meta = useStoreState((state) => state.meta);
  const auth = useStoreState((state) => state.auth);

  const setLoading = useStoreActions((actions) => actions.setLoading);
  const setMeta = useStoreActions((actions) => actions.setMeta);
  const setAuth = useStoreActions((actions) => actions.setAuth);

  useEffect(() => {
    Promise.allSettled([
      axios.get("/api/meta").then((res) => setMeta(res.data)),
      axios
        .get("/api/auth/session")
        .then((res) => setAuth(res.data))
        .catch(() => setAuth(null)),
    ]).then(() => setLoading(false));
  }, [setLoading, setMeta, setAuth]);

  if (loading || !meta) {
    return <LoadingPage />;
  }

  return (
    <>
      <Helmet>
        <title>{meta?.title}</title>
      </Helmet>

      <div className="w-full h-full bg-background">
        {auth ? (
          <>
            <BrowserRouter>
              <Navbar />
              <Routes>
                <Route path="/settings" Component={SettingsPage} />
                <Route path="/tokens" Component={TokensPage} />
                <Route path="/" Component={WhitelistedOnly(HomePage)} />
                <Route path="/upload" Component={WhitelistedOnly(UploadPage)} />
                <Route path="/users" Component={WhitelistedOnly(UsersPage)} />
              </Routes>
            </BrowserRouter>
          </>
        ) : (
          <LoginPage />
        )}
      </div>
    </>
  );
}

export default App;
