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
      <div style={{ paddingTop: "60px", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
        <h1 style={{ color: "#1e3a8a", marginBottom: "25px", fontWeight: "700" }}>Admin Local</h1>

        {/* Navigation */}
        <div style={{ marginBottom: "25px", display: "flex", justifyContent: "center", gap: "20px" }}>
          <button
            onClick={() => setView("list")}
            style={{
              background: "none",
              border: "none",
              color: "#1e3a8a",
              cursor: "pointer",
              fontWeight: view === "list" ? "700" : "500",
              textDecoration: view === "list" ? "underline" : "none",
              padding: "5px 10px",
              transition: "0.3s"
            }}
          >
            Liste utilisateurs
          </button>
          <button
            onClick={() => setView("create")}
            style={{
              background: "none",
              border: "none",
              color: "#1e3a8a",
              cursor: "pointer",
              fontWeight: view === "create" ? "700" : "500",
              textDecoration: view === "create" ? "underline" : "none",
              padding: "5px 10px",
              transition: "0.3s"
            }}
          >
            Créer utilisateur
          </button>
        </div>

        {/* Filtre */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ marginRight: "10px", fontWeight: "500" }}>Filtrer par rôle:</label>
          <select
            value={searchRole}
            onChange={(e) => setSearchRole(e.target.value)}
            style={{ padding: "6px 10px", borderRadius: "5px", border: "1px solid #cbd5e1" }}
          >
            <option value="">Tous</option>
            <option value="transcription">Transcription</option>
            <option value="e-service">E-service</option>
            <option value="referentiel-local">Référentiel local</option>
          </select>
        </div>

        {/* Tableau */}
        {view === "list" && (
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            maxWidth: "1000px",
            margin: "0 auto",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            borderRadius: "8px",
            overflow: "hidden"
          }}>
            <thead style={{ backgroundColor: "#1e3a8a", color: "white" }}>
              <tr>
                <th style={{ padding: "12px" }}>Nom</th>
                <th style={{ padding: "12px" }}>Prénom</th>
                <th style={{ padding: "12px" }}>Email</th>
                <th style={{ padding: "12px" }}>Téléphone</th>
                <th style={{ padding: "12px" }}>Rôle</th>
                <th style={{ padding: "12px" }}>Statut</th>
                <th style={{ padding: "12px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr
                  key={user.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f8fafc" : "white",
                    transition: "background 0.3s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e0e7ff"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#f8fafc" : "white"}
                >
                  <td style={{ padding: "10px", borderBottom: "1px solid #cbd5e1" }}>{user.nom}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #cbd5e1" }}>{user.prenom}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #cbd5e1" }}>{user.email}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #cbd5e1" }}>{user.telephone}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #cbd5e1" }}>{user.role}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #cbd5e1" }}>{user.active ? "Actif" : "Inactif"}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #cbd5e1" }}>
                    <button
                      onClick={() => handleDelete(user.id)}
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        cursor: "pointer",
                        marginRight: "5px",
                        borderRadius: "5px",
                        transition: "0.3s"
                      }}
                    >
                      Supprimer
                    </button>
                    <button
                      onClick={() => toggleActive(user.id)}
                      style={{
                        backgroundColor: user.active ? "gray" : "green",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        transition: "0.3s"
                      }}
                    >
                      {user.active ? "Désactiver" : "Activer"}
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
            margin: "30px auto",
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#f9f9f9",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
          }}>
            <h2 style={{ textAlign: "center", color: "#1e3a8a", marginBottom: "20px" }}>Créer un utilisateur</h2>
            <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <input name="nom" placeholder="Nom" required style={{ padding: "10px", borderRadius: "5px", border: "1px solid #cbd5e1" }} />
              <input name="prenom" placeholder="Prénom" required style={{ padding: "10px", borderRadius: "5px", border: "1px solid #cbd5e1" }} />
              <input name="email" type="email" placeholder="Email" required style={{ padding: "10px", borderRadius: "5px", border: "1px solid #cbd5e1" }} />
              <input name="telephone" type="tel" placeholder="Téléphone" required style={{ padding: "10px", borderRadius: "5px", border: "1px solid #cbd5e1" }} />

              <div style={{ display: "flex", gap: "10px" }}>
                <label><input type="radio" name="role" value="transcription" required onChange={e => setSelectedRole(e.target.value)} /> Transcription</label>
                <label><input type="radio" name="role" value="e-service" onChange={e => setSelectedRole(e.target.value)} /> E-service</label>
                <label><input type="radio" name="role" value="referentiel-local" onChange={e => setSelectedRole(e.target.value)} /> Référentiel local</label>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" style={{ flex: 1, backgroundColor: "#1e3a8a", color: "white", padding: "10px", borderRadius: "5px", cursor: "pointer" }}>Créer</button>
                <button type="button" onClick={() => setView("list")} style={{ flex: 1, backgroundColor: "#ccc", padding: "10px", borderRadius: "5px", cursor: "pointer" }}>Annuler</button>
              </div>
            </form>
          </div>
        )}

      </div>
    </>
  );
}

export default AdminLocal;