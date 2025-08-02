import React from "react";
import { FaHeart, FaShoppingCart, FaFacebook, FaInstagram, FaVk } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../css/Navbar.css";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/"); // Перенаправление после выхода
  };

  return (
    <header className="shadow-sm border-bottom">
      <div className="bg-light py-2 px-4 d-flex flex-wrap justify-content-between align-items-center small">
        <div className="d-flex flex-wrap gap-3">
          {[
            "О нас",
            "Оплата и доставка",
            "Как заказать",
            "Отзывы",
            "Руководство по цветам",
            "ЧаВо",
          ].map((label, index) => (
            <a
              key={index}
              href="#"
              className="text-secondary text-decoration-none hover-link"
            >
              {label}
            </a>
          ))}
        </div>

        {user ? (
          <div className="d-flex gap-3 align-items-center">
            <span className="text-success">Здравствуйте, {user.username}!</span>
            <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
              Выйти
            </button>
          </div>
        ) : (
          <a href="/register" className="text-secondary text-decoration-none">
            Войти / Зарегистрироваться
          </a>
        )}
      </div>

      {/* Остальная разметка меню и поиска */}
    </header>
  );
}
