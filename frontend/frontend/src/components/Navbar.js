import React from "react";
import { FaHeart, FaShoppingCart, FaFacebook, FaInstagram, FaVk } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import "../css/Navbar.css";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const navLinks = [
    { label: "О нас", path: "/about" },
    { label: "Оплата и доставка", path: "#" },
    { label: "Как заказать", path: "#" },
    { label: "Отзывы", path: "#" },
    { label: "Руководство по цветам", path: "#" },
    { label: "ЧаВо", path: "#" },
  ];

  return (
    <header className="shadow-sm border-bottom">
      <div className="bg-light py-2 px-4 d-flex flex-wrap justify-content-between align-items-center small">
        <div className="d-flex flex-wrap gap-3">
          {navLinks.map((item, index) =>
            item.path === "#" ? (
              <span
                key={index}
                className="text-secondary text-decoration-none hover-link"
                style={{ cursor: "not-allowed", opacity: 0.6 }}
              >
                {item.label}
              </span>
            ) : (
              <Link
                key={index}
                to={item.path}
                className="text-secondary text-decoration-none hover-link"
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        {user ? (
          <div className="d-flex gap-3 align-items-center">
            <span className="text-success">
              Здравствуйте, {user.username || user.email}!
            </span>
            <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
              Выйти
            </button>
          </div>
        ) : (
          <div className="d-flex gap-2">
            <Link to="/login" className="text-secondary text-decoration-none">
              Войти
            </Link>
            <span className="text-secondary">|</span>
            <Link to="/register" className="text-secondary text-decoration-none">
              Зарегистрироваться
            </Link>
          </div>
        )}
      </div>

      {/* Остальная часть навбара (поиск, иконки и т.д.) — сюда можно добавить позже */}
    </header>
  );
}
