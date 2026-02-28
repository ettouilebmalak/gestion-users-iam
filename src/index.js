// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import keycloak from "./keycloak";

keycloak.init({ onLoad: "login-required" }).then(authenticated => {
  if (authenticated) {
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<App keycloak={keycloak} />);
  } else {
    window.location.reload();
  }
}).catch(err => {
  console.error("Keycloak init error:", err);
});