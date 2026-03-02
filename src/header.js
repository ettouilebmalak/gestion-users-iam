import React from "react";

function Header({ keycloak }) {
  const username = keycloak.tokenParsed?.preferred_username;

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "80px",
        background: "linear-gradient(90deg, #0f172a, #1e3a8a)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 50px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
        zIndex: 1000,
      }}
    >
      {/* Partie gauche : Logo + Nom */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span
          style={{
            fontSize: "22px",
            fontWeight: "700",
            letterSpacing: "1px",
          }}
        >
          IDARATI
        </span>
        <span
          style={{
            fontSize: "13px",
            opacity: 0.8,
          }}
        >
          Ministère de la Transition Numérique
        </span>
      </div>

      {/* Partie droite : Utilisateur + Logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
        <span
          style={{
            fontSize: "14px",
            fontWeight: "500",
            backgroundColor: "rgba(255,255,255,0.1)",
            padding: "8px 15px",
            borderRadius: "20px",
          }}
        >
          👤 {username}
        </span>

        <button
          onClick={() =>
            keycloak.logout({
              redirectUri: window.location.origin,
            })
          }
          style={{
            backgroundColor: "#dc2626",
            color: "white",
            border: "none",
            padding: "10px 22px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            transition: "0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#b91c1c")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#dc2626")}
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
}

export default Header;