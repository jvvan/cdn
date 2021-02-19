import { useStoreState } from "easy-peasy";
import React from "react";

export default function Home() {
  const meta = useStoreState((state) => state.meta);
  return (
    <div className="container">
      <br />
      <h3 className="text-center">{meta.name}</h3>
      <br />
      <br />
      <div className="home">
        <a className="btn btn-info btn-block my-4" href="/api/auth/login">
          Login with Discord
        </a>
      </div>
    </div>
  );
}
