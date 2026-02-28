import './App.css';
import AdminLocal from './AdminLocal';
import AdminCentral from './Central';

function App({ keycloak }) {
  if (!keycloak?.tokenParsed) {
    return <h1>Chargement...</h1>;
  }

  const realmRoles = keycloak.tokenParsed?.realm_access?.roles || [];
 const clientRoles = keycloak.tokenParsed.resource_access?.['gestion-users-front']?.roles || [];

if (clientRoles.includes("admin-central")) return <AdminCentral keycloak={keycloak} />;
if (clientRoles.includes("admin-local")) return <AdminLocal keycloak={keycloak} />;

  console.log("Rôles realm :", realmRoles);
  console.log("Rôles client :", clientRoles);

  if (clientRoles.includes("admin-central")) {
    return <AdminCentral keycloak={keycloak} />;
  }

  if (clientRoles.includes("admin-local")) {
    return <AdminLocal keycloak={keycloak} />;
  }

  // Si aucun rôle ne correspond
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Accès refusé</h1>
      <button
        onClick={() =>
          keycloak.logout({
            redirectUri: window.location.origin,
          })
        }
      >
        Retour au login
      </button>
    </div>
  );
}

export default App;