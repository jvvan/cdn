import React from "react";
import { useStoreState } from "easy-peasy";
import AccessDenied from "../components/AccessDenied";

export default function AdminRoute({ component: Component }) {
  const auth = useStoreState((state) => state.auth);
  if (auth?.admin) return <Component />;
  return <AccessDenied text="You are not admin!" />;
}
