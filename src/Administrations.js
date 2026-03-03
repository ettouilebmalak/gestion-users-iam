import { administrations } from "./data";

function Administrations() {
  return (
    <div style={{ maxWidth: "600px", margin: "30px auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#1e3a8a" }}>Administrations</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ backgroundColor: "#1e3a8a", color: "white" }}>
          <tr>
            <th style={{ padding: "10px" }}>ID</th>
            <th style={{ padding: "10px" }}>Nom</th>
          </tr>
        </thead>
        <tbody>
          {administrations.map((admin, index) => (
            <tr key={admin.administration_id} style={{ backgroundColor: index % 2 === 0 ? "#f8fafc" : "white" }}>
              <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>{admin.administration_id}</td>
              <td style={{ padding: "10px", border: "1px solid #e2e8f0" }}>{admin.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Administrations;