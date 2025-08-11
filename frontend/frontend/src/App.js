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
import './css/LegoShop.css';

// Главная страница
function HomePage({ user }) {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12 text-center">
          <h1 className="display-4 mb-4">Добро пожаловать в KubukShop</h1>
          {user ? (
            <div className="alert alert-success">
              <h4>Добро пожаловать, {user.username || user.email}!</h4>
              <p className="mb-0">Вы успешно вошли в систему. Теперь вы можете пользоваться всеми возможностями нашего магазина.</p>
            </div>
          ) : (
            <>
              <p className="lead mb-4">
                Ваш надежный партнер в мире качественных товаров
              </p>
              <div className="d-flex justify-content-center gap-3">
                <a href="/login" className="btn btn-primary btn-lg">
                  Войти
                </a>
                <a href="/register" className="btn btn-outline-primary btn-lg">
                  Зарегистрироваться
                </a>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="row mt-5">
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <h5 className="card-title">Качественные товары</h5>
              <p className="card-text">
                Мы предлагаем только лучшие товары от проверенных производителей
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <h5 className="card-title">Быстрая доставка</h5>
              <p className="card-text">
                Доставляем заказы в кратчайшие сроки по всей стране
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <h5 className="card-title">Отличный сервис</h5>
              <p className="card-text">
                Наша команда всегда готова помочь вам с любыми вопросами
              </p>
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
