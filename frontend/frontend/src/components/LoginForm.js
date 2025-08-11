import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Auth.css";

function LoginForm({ setUser }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:8000/auth/token/login/", formData);
      const token = res.data.auth_token;

      const userRes = await axios.get("http://localhost:8000/auth/users/me/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const user = userRes.data;
      
      // Сохраняем в localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      
      // Обновляем состояние в App.js
      setUser(user);

      navigate("/");
    } catch (err) {
      const errorData = err?.response?.data;
      let errorMsg = "Проверьте email и пароль.";
      
      if (errorData) {
        if (errorData.non_field_errors) {
          errorMsg = errorData.non_field_errors[0];
        } else if (errorData.email) {
          errorMsg = `Email: ${errorData.email[0]}`;
        } else if (errorData.password) {
          errorMsg = `Пароль: ${errorData.password[0]}`;
        }
      }
      
      setMessage("Ошибка входа: " + errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title text-center mb-4">Вход в систему</h3>
                {message && (
                  <div className="alert alert-danger">
                    {message}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="form-control"
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      name="password"
                      placeholder="Пароль"
                      className="form-control"
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={isLoading}
                  >
                    {isLoading ? "Вход..." : "Войти"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;