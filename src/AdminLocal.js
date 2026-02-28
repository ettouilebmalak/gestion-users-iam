import React, { useState, useEffect } from "react";
import Header from "./header";

function AdminLocal({ keycloak }) {
  const [view, setView] = useState("list");
  const [searchRole, setSearchRole] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");

  // Charger les utilisateurs depuis Keycloak
  const loadUsers = () => {
    if (!keycloak?.token) return;

    fetch("http://localhost:8080/admin/realms/gestion-comptes/users", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const normalizedUsers = data.map((u) => ({
          id: u.id,
          nom: u.lastName || "",
          prenom: u.firstName || "",
          email: u.email || "",
          telephone: u.attributes?.telephone?.[0] || "-",
          role: u.attributes?.idaratiRole?.[0] || "-",
          active: u.enabled ?? true,
        }));
        setUsers(normalizedUsers);
      })
      .catch((err) => console.error(err));
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
      },
      credentials: [{ type: "password", value: "123456", temporary: false }],
    };

    fetch("http://localhost:8080/admin/realms/gestion-comptes/users", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then(() => {
        loadUsers();
        setView("list");
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const toggleActive = (id) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, active: !user.active } : user
      )
    );
  };

  const filteredUsers = users.filter((user) =>
    searchRole ? user.role === searchRole : true
  );

  return (
    <>
      <Header keycloak={keycloak} />
      <div style={{ paddingTop: "60px", textAlign: "center" }}>
        <h1 style={{ color: "#1e3a8a" }}>Admin Local</h1>

        <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center", gap: "20px" }}>
          <button
            onClick={() => setView("list")}
            style={{ background: "none", border: "none", color: "#1e3a8a", cursor: "pointer", textDecoration: view === "list" ? "underline" : "none" }}
          >
            Liste utilisateurs
          </button>
          <button
            onClick={() => setView("create")}
            style={{ background: "none", border: "none", color: "#1e3a8a", cursor: "pointer", textDecoration: view === "create" ? "underline" : "none" }}
          >
            Créer utilisateur
          </button>
        </div>

        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {view === "list" && (
            <>
              <div style={{ marginBottom: "10px" }}>
                <label>Filtrer par rôle: </label>
                <select value={searchRole} onChange={e => setSearchRole(e.target.value)}>
                  <option value="">Tous</option>
                  <option value="transcription">Transcription</option>
                  <option value="e-service">E-service</option>
                  <option value="referentiel-local">Référentiel local</option>
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
                    <th style={{ padding: "8px" }}>Statut</th>
                    <th style={{ padding: "8px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td style={{ padding: "6px" }}>{user.nom}</td>
                      <td style={{ padding: "6px" }}>{user.prenom}</td>
                      <td style={{ padding: "6px" }}>{user.email}</td>
                      <td style={{ padding: "6px" }}>{user.telephone}</td>
                      <td style={{ padding: "6px" }}>{user.role}</td>
                      <td style={{ padding: "6px" }}>{user.active ? "Actif" : "Inactif"}</td>
                      <td style={{ padding: "6px" }}>
                        <button onClick={() => handleDelete(user.id)} style={{ backgroundColor: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer", marginRight: "5px" }}>
                          Supprimer
                        </button>
                        <button onClick={() => toggleActive(user.id)} style={{ backgroundColor: user.active ? "gray" : "green", color: "white", border: "none", padding: "5px 10px" }}>
                          {user.active ? "Désactiver" : "Activer"}
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
                    <label><input type="radio" name="role" value="transcription" required onChange={e => setSelectedRole(e.target.value)} /> Transcription</label>
                    <label><input type="radio" name="role" value="e-service" onChange={e => setSelectedRole(e.target.value)} /> E-service</label>
                    <label><input type="radio" name="role" value="referentiel-local" onChange={e => setSelectedRole(e.target.value)} /> Référentiel local</label>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button type="submit" style={{ flex: 1, backgroundColor: "#1e3a8a", color: "white", padding: "10px", cursor: "pointer" }}>Créer</button>
                  <button type="button" onClick={() => setView("list")} style={{ flex: 1, backgroundColor: "#ccc", padding: "10px", cursor: "pointer" }}>Annuler</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminLocal;