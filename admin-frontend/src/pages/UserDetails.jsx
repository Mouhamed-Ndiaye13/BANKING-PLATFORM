import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser, setToken } from "../services/api";

function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setToken(token);

    getUser(id)
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!user) return <div>Chargement...</div>;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h1>Détails utilisateur</h1>
      <p><b>Nom :</b> {user.name}</p>
      <p><b>Email :</b> {user.email}</p>
      <p><b>Rôle :</b> {user.role}</p>
      <button onClick={() => navigate("/users")}>Retour</button>
    </div>
  );
}

export default UserDetails;
