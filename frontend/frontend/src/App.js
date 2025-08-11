import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import Footer from './components/Footer';
import About from "./components/About";
import LegoProducts from './components/LegoProducts';
import Sidebar from './components/Sidebar';
import Cart from './components/Cart';
import Favorites from './components/Favorites';
import Profile from './components/Profile';
import Orders from './components/Orders';
import './css/LegoShop.css';
import './css/Home.css';

// Главная страница
function HomePage({ user }) {
  return (
    <div className="home-page">
      {/* Герой-секция */}
      <div className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="hero-title">Добро пожаловать в KubukShop</h1>
              <p className="hero-subtitle">
                Откройте для себя мир качественных товаров и отличного сервиса. 
                Мы предлагаем широкий ассортимент товаров для всей семьи.
              </p>
              {user ? (
                <div className="alert alert-success">
                  <h4>Рады видеть вас, {user.username || user.email}!</h4>
                  <p className="mb-0">Исследуйте наш каталог и находите то, что вам нужно.</p>
                  <div className="mt-3">
                    <a href="/profile" className="btn btn-outline-light me-2">
                      Личный кабинет
                    </a>
                    <a href="/favorites" className="btn btn-outline-light">
                      Избранное
                    </a>
                  </div>
                </div>
              ) : (
                <div className="hero-buttons">
                  <a href="/login" className="btn btn-primary btn-lg me-3">
                    Войти в систему
                  </a>
                  <a href="/register" className="btn btn-outline-primary btn-lg">
                    Создать аккаунт
                  </a>
                </div>
              )}
            </div>
            <div className="col-lg-6 text-center">
              <div className="hero-image">
                <span className="hero-icon">🛍️</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Преимущества */}
      <div className="features-section">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-12">
              <h2 className="section-title">Почему выбирают нас</h2>
              <p className="section-subtitle">Мы стремимся предоставить вам лучший опыт покупок</p>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="feature-card">
                <div className="feature-icon">🚚</div>
                <h5 className="feature-title">Быстрая доставка</h5>
                <p className="feature-text">
                  Доставляем заказы по всей стране в кратчайшие сроки. 
                  Бесплатная доставка при заказе от 4 000 ₽.
                </p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card">
                <div className="feature-icon">⭐</div>
                <h5 className="feature-title">Качество товаров</h5>
                <p className="feature-text">
                  Мы тщательно отбираем поставщиков и предлагаем только 
                  качественные товары от проверенных производителей.
                </p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card">
                <div className="feature-icon">💬</div>
                <h5 className="feature-title">Поддержка 24/7</h5>
                <p className="feature-text">
                  Наша команда поддержки всегда готова помочь вам 
                  с любыми вопросами и решить возникшие проблемы.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Популярные категории */}
      <div className="categories-section">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-12">
              <h2 className="section-title">Популярные категории</h2>
              <p className="section-subtitle">Исследуйте наши основные направления</p>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6 col-lg-3 mb-4">
              <div className="category-card">
                <div className="category-icon">🧱</div>
                <h5 className="category-title">LEGO конструкторы</h5>
                <p className="category-text">Увлекательные наборы для всех возрастов</p>
                <a href="/lego-shop" className="btn btn-outline-primary">Перейти</a>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 mb-4">
              <div className="category-card">
                <div className="category-icon">🎮</div>
                <h5 className="category-title">Игры и развлечения</h5>
                <p className="category-text">Настольные игры и развивающие игрушки</p>
                <a href="/lego-shop" className="btn btn-outline-primary">Перейти</a>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 mb-4">
              <div className="category-card">
                <div className="category-icon">📚</div>
                <h5 className="category-title">Книги и обучение</h5>
                <p className="category-text">Образовательная литература для детей</p>
                <a href="/lego-shop" className="btn btn-outline-primary">Перейти</a>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 mb-4">
              <div className="category-card">
                <div className="category-icon">🎨</div>
                <h5 className="category-title">Творчество</h5>
                <p className="category-text">Наборы для рисования и рукоделия</p>
                <a href="/lego-shop" className="btn btn-outline-primary">Перейти</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Информация о доставке */}
      <div className="delivery-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h3 className="delivery-title">Удобная доставка</h3>
              <ul className="delivery-list">
                <li>🚚 Быстрая доставка по всей России</li>
                <li>📦 Безопасная упаковка товаров</li>
                <li>💰 Бесплатная доставка от 4 000 ₽</li>
                <li>📱 Отслеживание заказа в реальном времени</li>
                <li>🔄 Возможность возврата в течение 14 дней</li>
              </ul>
            </div>
            <div className="col-lg-6 text-center">
              <div className="delivery-image">
                <span className="delivery-icon">📦</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Страница товаров LEGO
function LegoShopPage({ user, openCart, setFavoritesCount }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="lego-shop-page">
      <div className="lego-shop-container">
        <Sidebar 
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
        />
        <div className="lego-shop-content">
          <LegoProducts selectedCategory={selectedCategory} openCart={openCart} setFavoritesCount={setFavoritesCount} />
        </div>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Ошибка при загрузке пользователя:', error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  // Загружаем количество избранных товаров при входе пользователя
  useEffect(() => {
    const loadFavoritesCount = async () => {
      if (user) {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const response = await fetch('http://localhost:8000/api/favorites/count/', {
              headers: {
                'Authorization': `Token ${token}`,
              },
            });
            if (response.ok) {
              const data = await response.json();
              setFavoritesCount(data.count);
            }
          }
        } catch (error) {
          console.error('Ошибка загрузки количества избранных товаров:', error);
        }
      } else {
        setFavoritesCount(0);
      }
    };

    loadFavoritesCount();
  }, [user]);

  const openCart = () => {
    console.log('openCart called, setting isCartOpen to true');
    console.log('Current isCartOpen state:', isCartOpen);
    setIsCartOpen(true);
    console.log('After setting isCartOpen to true');
  };
  
  const closeCart = () => {
    console.log('closeCart called, setting isCartOpen to false');
    console.log('Current isCartOpen state:', isCartOpen);
    setIsCartOpen(false);
    console.log('After setting isCartOpen to false');
  };

  return (
    <Router>
      <TopBar user={user} openCart={openCart} />
      <Navbar user={user} setUser={setUser} openCart={openCart} favoritesCount={favoritesCount} />
      <Routes>
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/lego-shop" element={<LegoShopPage user={user} openCart={openCart} setFavoritesCount={setFavoritesCount} />} />
        <Route path="/register" element={<RegisterForm setUser={setUser} />} />
        <Route path="/login" element={<LoginForm setUser={setUser} />} />
        <Route path="/about" element={<About />} />
        <Route path="/favorites" element={<Favorites setFavoritesCount={setFavoritesCount} />} />
        <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
        <Route path="/orders" element={<Orders user={user} />} />
      </Routes>
      
      {/* Cart Modal */}
      {console.log('Rendering check - isCartOpen:', isCartOpen, 'user:', user, 'condition result:', isCartOpen && user)}
      {isCartOpen && user && (
        <div>
          {console.log('Rendering Cart component, isCartOpen:', isCartOpen, 'user:', user)}
          <Cart user={user} onClose={closeCart} />
        </div>
      )}
      
      <Footer />
    </Router>
  );
}

export default App;
