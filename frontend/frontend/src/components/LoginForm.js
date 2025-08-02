import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginForm({ setUser }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/auth/token/login/", formData);
      const token = res.data.auth_token;

      const userRes = await axios.get("http://localhost:8000/auth/users/me/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const user = userRes.data;
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      navigate("/");
    } catch (err) {
      setMessage(
        "Ошибка входа: " +
          (err?.response?.data?.non_field_errors?.[0] || "Проверьте email и пароль.")
      );
    }
  };

  return (
    <div className="container mt-4">
      <h3>Вход</h3>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="form-control mb-2"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          className="form-control mb-2"
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn btn-primary">
          Войти
        </button>
      </form>
    </div>
  );
}

export default LoginForm;