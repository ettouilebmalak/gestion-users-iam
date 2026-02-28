import React from "react";

function Header({ keycloak }) {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "70px",
        backgroundColor: "#0f172a",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between", 
        padding: "0 30px",
        boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
      }}
    >


      <h1
        style={{
          fontSize: "22px",
          margin: 0,
          fontWeight: "600",
          letterSpacing: "1px",
        }}
      >
        Idarati
      </h1>

      <button
        onClick={() =>
          keycloak.logout({
            redirectUri: window.location.origin,
          })
        }
        style={{
          backgroundColor: "transparent",
          color: "white",
          border: "1px solid white",
          padding: "8px 18px",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px",
          
        }}
      >
        Déconnexion 
      </button>

    </header>
  );
}

export default Header;