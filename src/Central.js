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
      <div style={{ paddingTop: "60px", textAlign: "center" }}>
        <h1 style={{ color: "#1e3a8a" }}>Admin Central</h1>

        <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center", gap: "20px" }}>
          <button onClick={() => setView("list")}>Liste utilisateurs</button>
          <button onClick={() => setView("create")}>Créer utilisateur</button>
          <button onClick={() => setView("administrations")}>Administrations</button>
        </div>

        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {view === "list" && (
            <>
              <div style={{ marginBottom: "10px" }}>
                <label>Filtrer par rôle: </label>
                <select value={searchRole} onChange={e => setSearchRole(e.target.value)}>
                  <option value="">Tous</option>
                  <option value="admin_local">Admin Local</option>
                  <option value="commission">Commission</option>
                  <option value="referentiel">Référentiel</option>
                </select>
              </div>

              <table border="1" width="100%" style={{ marginTop: "10px", borderCollapse: "collapse" }}>
                <thead style={{ backgroundColor: "#1e3a8a", color: "white" }}>
                  <tr>
                    <th style={{ padding: "8px" }}>Nom</th>
                    <th style={{ padding: "8px" }}>Prénom</th>
                    <th style={{ padding: "8px" }}>Email</th>
                    <th style={{ padding: "8px" }}>Téléphone</th>
                    <th style={{ padding: "8px" }}>Rôle</th>
                    <th style={{ padding: "8px" }}>Administration</th>
                    <th style={{ padding: "8px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td style={{ padding: "6px" }}>{user.lastName}</td>
                      <td style={{ padding: "6px" }}>{user.firstName}</td>
                      <td style={{ padding: "6px" }}>{user.email}</td>
                      <td style={{ padding: "6px" }}>{user.attributes?.telephone?.[0] || "-"}</td>
                      <td style={{ padding: "6px" }}>{user.attributes?.idaratiRole?.join(", ") || "-"}</td>
                      <td style={{ padding: "6px" }}>
                        {user.attributes?.idaratiRole?.[0] === "admin_local" ? user.attributes?.admId?.[0] || "-" : "-"}
                      </td>
                      <td style={{ padding: "6px" }}>
                        <button onClick={() => handleDelete(user.id)}
                          style={{ backgroundColor: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}>
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {view === "create" && (
            <div style={{ maxWidth: "500px", margin: "20px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
              <h2 style={{ textAlign: "center", color: "#1e3a8a" }}>Créer un utilisateur</h2>
              <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <input name="nom" placeholder="Nom" required style={{ padding: "8px" }} />
                <input name="prenom" placeholder="Prénom" required style={{ padding: "8px" }} />
                <input name="email" type="email" placeholder="Email" required style={{ padding: "8px" }} />
                <input name="telephone" type="tel" placeholder="Téléphone" required style={{ padding: "8px" }} />

                <div>
                  <label>Rôle:</label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <label><input type="radio" name="role" value="admin_local" required onChange={e => setSelectedRole(e.target.value)} /> Admin Local</label>
                    <label><input type="radio" name="role" value="commission" onChange={e => setSelectedRole(e.target.value)} /> Commission</label>
                    <label><input type="radio" name="role" value="referentiel" onChange={e => setSelectedRole(e.target.value)} /> Référentiel</label>
                  </div>
                </div>

                {selectedRole === "admin_local" && (
                  <select name="administration" required style={{ padding: "8px" }}>
                    <option value="">-- Sélectionner --</option>
                    {administrations.map(admin => <option key={admin.administration_id} value={admin.title}>{admin.title}</option>)}
                  </select>
                )}

                <div style={{ display: "flex", gap: "10px" }}>
                  <button type="submit" style={{ flex: 1, backgroundColor: "#1e3a8a", color: "white", padding: "10px", cursor: "pointer" }}>Créer</button>
                  <button type="button" onClick={() => setView("list")} style={{ flex: 1, backgroundColor: "#ccc", padding: "10px", cursor: "pointer" }}>Annuler</button>
                </div>
              </form>
            </div>
          )}

          {view === "administrations" && <Administrations />}
        </div>
      </div>
    </>
  );
}

export default AdminCentral;