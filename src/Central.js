import React, { useState, useEffect } from "react";
import Header from "./header";
import Administrations from "./Administrations";
import { administrations } from "./data";

function AdminCentral({ keycloak }) {
  const [view, setView] = useState("list");
  const [searchRole, setSearchRole] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [users, setUsers] = useState([]);

  const loadUsers = () => {
    if (!keycloak?.token) return;
    fetch("http://localhost:8080/admin/realms/gestion-comptes/users", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => setUsers(data.map(u => ({ ...u, attributes: u.attributes || {} }))))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadUsers();
  }, [keycloak]);

  const handleCreateUser = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const formObject = Object.fromEntries(form.entries());

    const newUser = {
      username: formObject.email,
      email: formObject.email,
      enabled: true,
      firstName: formObject.prenom,
      lastName: formObject.nom,
      attributes: {
        telephone: [formObject.telephone ?? ""],
        idaratiRole: [formObject.role],
        admId: formObject.administration ? [formObject.administration] : []
      },
      credentials: [
        { type: "password", value: "123456", temporary: false }
      ]
    };

    fetch("http://localhost:8080/admin/realms/gestion-comptes/users", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newUser)
    }).then(() => { loadUsers(); setView("list"); })
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/admin/realms/gestion-comptes/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${keycloak.token}` }
    }).then(() => loadUsers())
      .catch(err => console.error(err));
  };

  const filteredUsers = searchRole
    ? users.filter(u => u.attributes?.idaratiRole?.[0] === searchRole)
    : users;

  return (
    <>
      <Header keycloak={keycloak} />
      <div style={{
        paddingTop: "110px",
        textAlign: "center",
        backgroundColor: "#f1f5f9",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif"
      }}>
        <h1 style={{ color: "#1e3a8a", marginBottom: "30px" }}>Admin Central</h1>

        {/* Navigation boutons */}
        <div style={{ marginBottom: "30px", display: "flex", justifyContent: "center", gap: "15px" }}>
          <button style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            backgroundColor: view === "list" ? "#1e3a8a" : "#e2e8f0",
            color: view === "list" ? "white" : "#1e293b",
            fontWeight: "600",
            transition: "0.3s"
          }} onClick={() => setView("list")}>Liste utilisateurs</button>

          <button style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            backgroundColor: view === "create" ? "#1e3a8a" : "#e2e8f0",
            color: view === "create" ? "white" : "#1e293b",
            fontWeight: "600",
            transition: "0.3s"
          }} onClick={() => setView("create")}>Créer utilisateur</button>

          <button style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            backgroundColor: view === "administrations" ? "#1e3a8a" : "#e2e8f0",
            color: view === "administrations" ? "white" : "#1e293b",
            fontWeight: "600",
            transition: "0.3s"
          }} onClick={() => setView("administrations")}>Administrations</button>
        </div>

        {/* Filtre */}
        {view === "list" && (
          <div style={{ marginBottom: "20px" }}>
            <label style={{ marginRight: "10px", fontWeight: "500" }}>Filtrer par rôle:</label>
            <select value={searchRole} onChange={e => setSearchRole(e.target.value)} style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              backgroundColor: "#f8fafc",
              cursor: "pointer",
              minWidth: "200px"
            }}>
              <option value="">Tous</option>
              <option value="admin_local">Admin Local</option>
              <option value="commission">Commission</option>
              <option value="referentiel">Référentiel</option>
            </select>
          </div>
        )}

        {/* Tableau */}
        {view === "list" && (
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            fontSize: "14px",
            backgroundColor: "white",
            borderRadius: "8px",
            overflow: "hidden"
          }}>
            <thead style={{ backgroundColor: "#1e3a8a", color: "white", textAlign: "left" }}>
              <tr>
                <th style={{ padding: "12px" }}>Nom</th>
                <th style={{ padding: "12px" }}>Prénom</th>
                <th style={{ padding: "12px" }}>Email</th>
                <th style={{ padding: "12px" }}>Téléphone</th>
                <th style={{ padding: "12px" }}>Rôle</th>
                <th style={{ padding: "12px" }}>Administration</th>
                <th style={{ padding: "12px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, i) => (
                <tr key={user.id} style={{ backgroundColor: i % 2 === 0 ? "#f8fafc" : "white" }}>
                  <td style={{ padding: "10px" }}>{user.lastName}</td>
                  <td style={{ padding: "10px" }}>{user.firstName}</td>
                  <td style={{ padding: "10px" }}>{user.email}</td>
                  <td style={{ padding: "10px" }}>{user.attributes?.telephone?.[0] || "-"}</td>
                  <td style={{ padding: "10px" }}>{user.attributes?.idaratiRole?.join(", ") || "-"}</td>
                  <td style={{ padding: "10px" }}>
                    {user.attributes?.idaratiRole?.[0] === "admin_local" ? user.attributes?.admId?.[0] || "-" : "-"}
                  </td>
                  <td style={{ padding: "10px" }}>
                    <button style={{
                      backgroundColor: "#dc2626",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "0.2s"
                    }}
                    onMouseOver={e => e.target.style.backgroundColor="#b91c1c"}
                    onMouseOut={e => e.target.style.backgroundColor="#dc2626"}
                    onClick={() => handleDelete(user.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Formulaire création */}
        {view === "create" && (
          <div style={{
            maxWidth: "500px",
            margin: "20px auto",
            padding: "25px",
            borderRadius: "12px",
            backgroundColor: "white",
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)"
          }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#1e3a8a" }}>Créer un utilisateur</h2>
            <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <input name="nom" placeholder="Nom" required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
              <input name="prenom" placeholder="Prénom" required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
              <input name="email" type="email" placeholder="Email" required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
              <input name="telephone" type="tel" placeholder="Téléphone" required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />

              <select name="role" required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", backgroundColor: "#f8fafc" }} onChange={e => setSelectedRole(e.target.value)}>
                <option value="">Sélectionner un rôle</option>
                <option value="admin_local">Admin Local</option>
                <option value="commission">Commission</option>
                <option value="referentiel">Référentiel</option>
              </select>

              {selectedRole === "admin_local" && (
                <select name="administration" required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", backgroundColor: "#f8fafc" }}>
                  <option value="">Sélectionner administration</option>
                  {administrations.map(a => <option key={a.administration_id} value={a.title}>{a.title}</option>)}
                </select>
              )}

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "none", backgroundColor: "#1e3a8a", color: "white", cursor: "pointer", fontWeight: "600" }}>Créer</button>
                <button type="button" onClick={() => setView("list")} style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "none", backgroundColor: "#ccc", cursor: "pointer" }}>Annuler</button>
              </div>
            </form>
          </div>
        )}

        {view === "administrations" && <Administrations />}
      </div>
    </>
  );
}

export default AdminCentral;