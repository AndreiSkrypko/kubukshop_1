import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Auth.css";

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

    // Проверка минимальной длины пароля
    if (formData.password.length < 6) {
      setMessage("Ошибка: Пароль должен содержать минимум 6 символов");
      setIsLoading(false);
      return;
    }

    try {
      // Регистрация пользователя
      await axios.post("http://localhost:8000/auth/users/", formData);
      
      // Автоматический вход после регистрации
      const loginData = {
        email: formData.email,
        password: formData.password
      };
      
      const loginRes = await axios.post("http://localhost:8000/auth/token/login/", loginData);
      const token = loginRes.data.auth_token;

      // Получение данных пользователя
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

      setMessage("Регистрация прошла успешно! Вы автоматически вошли в систему.");
      setTimeout(() => {
        navigate("/");
      }, 2000);
      
    } catch (err) {
      const errorData = err?.response?.data;
      let errorMsg = "Произошла ошибка. Попробуйте ещё раз.";
      
      if (errorData) {
        if (errorData.email) {
          errorMsg = `Email: ${errorData.email[0]}`;
        } else if (errorData.username) {
          errorMsg = `Имя пользователя: ${errorData.username[0]}`;
        } else if (errorData.password) {
          // Улучшенная обработка ошибок пароля
          const passwordError = errorData.password[0];
          if (passwordError.includes("too similar")) {
            errorMsg = "Пароль не должен быть похож на email или имя пользователя";
          } else if (passwordError.includes("too short")) {
            errorMsg = "Пароль должен содержать минимум 6 символов";
          } else if (passwordError.includes("too common")) {
            errorMsg = "Пароль слишком простой. Выберите более сложный пароль";
          } else {
            errorMsg = `Пароль: ${passwordError}`;
          }
        } else if (errorData.re_password) {
          errorMsg = `Подтверждение пароля: ${errorData.re_password[0]}`;
        } else if (errorData.non_field_errors) {
          errorMsg = errorData.non_field_errors[0];
        }
      }
      
      setMessage("Ошибка: " + errorMsg);
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
                      placeholder="Пароль (минимум 6 символов)"
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
    </div>
  );
}

export default RegisterForm;
