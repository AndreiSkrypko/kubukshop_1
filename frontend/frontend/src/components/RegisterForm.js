import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterForm({ setUser }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/auth/users/", formData);
      setMessage("Регистрация прошла успешно. Теперь вы можете войти.");
      navigate("/login");
    } catch (err) {
      const errorMsg =
        err?.response?.data?.email?.[0] ||
        err?.response?.data?.password?.[0] ||
        err?.response?.data?.non_field_errors?.[0] ||
        "Произошла ошибка. Попробуйте ещё раз.";
      setMessage("Ошибка: " + errorMsg);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Регистрация</h3>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Имя пользователя"
          className="form-control mb-2"
          onChange={handleChange}
          required
        />
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
        <button type="submit" className="btn btn-success">
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
