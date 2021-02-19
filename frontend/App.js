import { useStoreActions, useStoreState } from "easy-peasy";
import React, { useEffect } from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import Home from "./components/Home";
import Files from "./components/Files";
import { ClipLoader } from "react-spinners";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.min.css";
import "./styles/global";
import Navbar from "./components/Navbar";
import { Helmet } from "react-helmet";
import Upload from "./components/Upload";
import "regenerator-runtime/runtime";
import Users from "./components/Users";
import WhitelistedRoute from "./routes/WhitelistedRoute";
import AdminRoute from "./routes/AdminRoute";
import { ToastContainer } from "react-toastify";
import UserEdit from "./components/UserEdit";
import Tokens from "./components/Tokens";
import Settings from "./components/Settings";

export default () => {
  const loading = useStoreState((state) => state.loading);
  const setLoading = useStoreActions((actions) => actions.setLoading);
  const auth = useStoreState((state) => state.auth);
  const meta = useStoreState((state) => state.meta);
  const setAuth = useStoreActions((actions) => actions.setAuth);
  const setMeta = useStoreActions((actions) => actions.setMeta);
  useEffect(() => {
    Promise.all([
      fetch("/api/auth/session")
        .then((r) => r.json())
        .then((auth) => {
          setAuth(auth.error ? null : auth);
        }),
      fetch("/api/meta")
        .then((r) => r.json())
        .then((meta) => {
          setMeta(meta);
        }),
    ]).then(() => {
      setLoading(false);
    });
  }, []);
  if (loading) {
    return (
      <div id="loading">
        <ClipLoader loading={true} color={"#0dcaf0"} size={150} />
      </div>
    );
  }
  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
      </Helmet>
      <Router>
        {auth ? (
          <>
            <Navbar />
            <Switch>
              <Route path="/settings" exact component={Settings} />
              <Route path="/tokens" exact component={Tokens} />
              <WhitelistedRoute path="/" exact component={Files} />
              <WhitelistedRoute path="/upload" exact component={Upload} />
              <AdminRoute path="/admin/users/:id" component={UserEdit} />
              <AdminRoute path="/admin/users" exact component={Users} />
              <Route path="*" component={NotFound} />
            </Switch>
          </>
        ) : (
          <Home />
        )}
      </Router>
      <ToastContainer position="bottom-right" />
    </>
  );
};

function NotFound() {
  return (
    <>
      <div>Not Found</div>
    </>
  );
}
