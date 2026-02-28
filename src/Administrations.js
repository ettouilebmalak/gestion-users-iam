import { administrations } from "./data";

function Administrations(keycloak) {
  return (
    <table border="1" cellPadding="10">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nom</th>
        </tr>
      </thead>
      <tbody>
        {administrations.map((admin) => (
          <tr key={admin.administration_id}>
            <td>{admin.administration_id}</td>
            <td>{admin.title}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Administrations;