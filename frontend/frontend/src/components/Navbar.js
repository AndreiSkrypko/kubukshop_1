import React, { useState, useEffect } from "react";
import { FaHeart, FaShoppingCart, FaSearch, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import "../css/Navbar.css";

export default function Navbar({ user, setUser, openCart }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Здесь можно добавить логику поиска
      console.log("Searching for:", searchQuery);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinks = [
    { label: "О нас", path: "/about" },
    { label: "Магазин LEGO", path: "/lego-shop" },
    { label: "Оплата и доставка", path: "#" },
    { label: "Как заказать", path: "#" },
    // { label: "Отзывы", path: "#" }, // Убрано по вашему запросу
    // { label: "Руководство по цветам", path: "#" }, // Убрано по вашему запросу
    // { label: "ЧаВо", path: "#" }, // Убрано по вашему запросу
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Логотип */}
        <div className="navbar-brand">
          <Link to="/" className="brand-link" onClick={closeMenu}>
            <div className="brand-logo">
              <span className="brand-icon">🧱</span>
            </div>
            <span className="brand-text">KubukShop</span>
          </Link>
        </div>

        {/* Поиск */}
        <div className="navbar-search">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <button type="submit" className="search-button">
              Найти
            </button>
          </form>
        </div>

        {/* Навигационные ссылки */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-nav">
            {navLinks.map((link, index) => (
              <li key={index} className="nav-item">
                <Link className="nav-link" to={link.path} onClick={closeMenu}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Правая часть навбара */}
        <div className="navbar-actions">
          {/* Избранное */}
          {user && (
            <div className="action-item">
              <button className="action-button favorite-btn">
                <FaHeart className="action-icon" />
                <span className="action-text">Избранное</span>
              </button>
            </div>
          )}

          {/* Корзина */}
          {user && (
            <div className="action-item">
              <button className="action-button cart-btn" onClick={openCart}>
                <FaShoppingCart className="action-icon" />
                <span className="action-text">Корзина</span>
                <span className="cart-badge">0</span>
              </button>
            </div>
          )}

          {/* Пользователь */}
          {user ? (
            <div className="action-item user-dropdown">
              <button className="action-button user-btn">
                <FaUser className="action-icon" />
                <span className="action-text">{user.username || user.email}</span>
              </button>
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item" onClick={closeMenu}>Личный кабинет</Link>
                <Link to="/orders" className="dropdown-item" onClick={closeMenu}>Мои заказы</Link>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={handleLogout}>
                  Выйти
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="auth-btn login-btn" onClick={closeMenu}>Войти</Link>
              <Link to="/register" className="auth-btn register-btn" onClick={closeMenu}>Регистрация</Link>
            </div>
          )}
        </div>

        {/* Мобильное меню */}
        <button 
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
}
