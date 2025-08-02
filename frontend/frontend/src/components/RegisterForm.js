import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterForm({ setUser }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    re_password: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Проверка совпадения паролей
    if (formData.password !== formData.re_password) {
      setMessage("Ошибка: Пароли не совпадают");
      setIsLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:8000/auth/users/", formData);
      setMessage("Регистрация прошла успешно! Теперь вы можете войти.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const errorData = err?.response?.data;
      let errorMsg = "Произошла ошибка. Попробуйте ещё раз.";
      
      if (errorData) {
        if (errorData.email) errorMsg = `Email: ${errorData.email[0]}`;
        else if (errorData.username) errorMsg = `Имя пользователя: ${errorData.username[0]}`;
        else if (errorData.password) errorMsg = `Пароль: ${errorData.password[0]}`;
        else if (errorData.re_password) errorMsg = `Подтверждение пароля: ${errorData.re_password[0]}`;
        else if (errorData.non_field_errors) errorMsg = errorData.non_field_errors[0];
      }
      
      setMessage("Ошибка: " + errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Регистрация</h3>
              {message && (
                <div className={`alert ${message.includes('успешно') ? 'alert-success' : 'alert-danger'}`}>
                  {message}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    name="username"
                    placeholder="Имя пользователя"
                    className="form-control"
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>
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
                <div className="mb-3">
                  <input
                    type="password"
                    name="re_password"
                    placeholder="Подтвердите пароль"
                    className="form-control"
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-success w-100"
                  disabled={isLoading}
                >
                  {isLoading ? "Регистрация..." : "Зарегистрироваться"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
