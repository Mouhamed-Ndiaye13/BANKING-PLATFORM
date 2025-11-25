import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser, updateUser, setToken } from "../services/api";

function EditUser() {
  const { id } = useParams();
  const [user, setUser] = useState({ name: "", email: "", role: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setToken(token);

    getUser(id)
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(id, user);
      navigate(`/user/${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h1>Modifier utilisateur</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom</label>
          <input name="name" value={user.name} onChange={handleChange} />
        </div>
        <div>
          <label>Email</label>
          <input name="email" value={user.email} onChange={handleChange} />
        </div>
        <div>
          <label>Rôle</label>
          <select name="role" value={user.role} onChange={handleChange}>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
        <button type="submit">Enregistrer</button>
      </form>
    </div>
  );
}

export default EditUser;
