import React from "react";
import { useStoreState } from "easy-peasy";
import AccessDenied from "../components/AccessDenied";

export default function WhitelistedRoute({ component: Component }) {
  const auth = useStoreState((state) => state.auth);
  if (auth?.whitelisted) return <Component />;
  return <AccessDenied text="You are not whitelisted!" />;
}
