import React, { useState, useEffect } from "react";
import { FaHeart, FaSearch, FaUser } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import "../css/Navbar.css";

export default function Navbar({ user, setUser, openCart, favoritesCount }) {
  const navigate = useNavigate();
  // Состояние мобильного меню убрано - все на одной линии
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);



  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Поиск в реальном времени
  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const response = await fetch(`http://localhost:8000/api/products/search/?q=${encodeURIComponent(searchQuery.trim())}`);
          if (response.ok) {
            const data = await response.json();
            setSearchResults(data.results || data);
            setShowSearchResults(true);
          }
        } catch (error) {
          console.error('Ошибка поиска:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    };

    const timeoutId = setTimeout(searchProducts, 300); // Задержка 300мс
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Скрываем результаты при клике вне поиска
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.navbar-search')) {
        setShowSearchResults(false);
      }
      if (!event.target.closest('.user-dropdown')) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
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
      // При нажатии кнопки "Найти" переходим на страницу с результатами поиска
      navigate(`/lego-shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // Очищаем поле поиска
      setShowSearchResults(false); // Скрываем результаты поиска
    }
  };

  const handleProductSelect = (product) => {
    // При клике на товар в результатах поиска, переходим на страницу с этим конкретным товаром
    // Используем ID товара для точного поиска
    navigate(`/lego-shop?product=${product.id}`);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const closeMenu = () => {
    // Функция для закрытия мобильного меню (оставлена для совместимости)
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const closeUserDropdown = () => {
    setIsUserDropdownOpen(false);
  };

  const navLinks = [
    { label: "О нас", path: "/about" },
    { label: "Магазин LEGO", path: "/lego-shop" },
    // { label: "Оплата и доставка", path: "#" }, // Убрано по вашему запросу
    // { label: "Как заказать", path: "#" }, // Убрано по вашему запросу
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
                placeholder="Поиск товаров по названию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch(e);
                  }
                }}
                className="search-input"
                aria-label="Поиск товаров"
              />
            </div>
          </form>
          
          {/* Результаты поиска в реальном времени */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="search-results-dropdown">
              <div className="search-results-header">
                <span>Найдено товаров: {searchResults.length}</span>
              </div>
              <div className="search-results-list">
                {searchResults.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="search-result-item"
                    onClick={() => handleProductSelect(product)}
                  >
                    <div className="search-result-image">
                      {product.image ? (
                        <img src={product.image} alt={product.name} />
                      ) : (
                        <div className="search-result-placeholder">🖼️</div>
                      )}
                    </div>
                    <div className="search-result-info">
                      <div className="search-result-name">{product.name}</div>
                      <div className="search-result-price">{product.price} ₽</div>
                    </div>
                  </div>
                ))}
              </div>
              {searchResults.length > 5 && (
                <div className="search-results-footer">
                  <button 
                    className="search-results-more"
                    onClick={() => {
                      // При клике на "Показать все результаты" переходим на страницу с текущим поисковым запросом
                      navigate(`/lego-shop?search=${encodeURIComponent(searchQuery.trim())}`);
                      setSearchQuery("");
                      setShowSearchResults(false);
                    }}
                  >
                    Показать все результаты ({searchResults.length})
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Индикатор загрузки */}
          {isSearching && (
            <div className="search-loading">
              <div className="search-spinner"></div>
              <span>Поиск...</span>
            </div>
          )}
        </div>

        {/* Навигационные ссылки - теперь на одной линии */}
        <div className="navbar-nav-inline">
          {navLinks.map((link, index) => (
            <Link 
              key={index}
              className={`nav-link ${link.label === "Магазин LEGO" ? 'lego-shop-btn' : ''} ${link.label === "О нас" ? 'about-btn' : ''}`} 
              to={link.path} 
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
          
          {/* Избранное - на одном уровне с навигацией */}
          {user && (
            <button className="nav-link favorite-nav-btn" onClick={() => navigate('/favorites')}>
              <FaHeart className="nav-icon" />
              <span>Избранное</span>
              {favoritesCount > 0 && (
                <span className="favorites-count">{favoritesCount}</span>
              )}
            </button>
          )}
        </div>

        {/* Правая часть навбара */}
        <div className="navbar-actions">
          {/* Корзина убрана - достаточно в топ баре */}

          {/* Пользователь */}
          {user ? (
            <div className="action-item user-dropdown">
              <button 
                className="action-button user-btn modern-user-btn" 
                onClick={toggleUserDropdown}
              >
                <FaUser className="action-icon" />
                <span className="action-text">{user.username || user.email}</span>
              </button>
              

              
              <div className={`dropdown-menu ${isUserDropdownOpen ? 'show' : ''}`}>
                <Link to="/profile" className="dropdown-item" onClick={closeUserDropdown}>Личный кабинет</Link>
                <Link to="/orders" className="dropdown-item" onClick={closeUserDropdown}>Мои заказы</Link>
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

        {/* Мобильное меню убрано - все на одной линии */}
      </div>
    </nav>
  );
}
