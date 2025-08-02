import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import Footer from './components/Footer';

// Главная страница
function HomePage({ user }) {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12 text-center">
          <h1 className="display-4 mb-4">Добро пожаловать в KubukShop</h1>
          <p className="lead mb-4">
            Ваш надежный партнер в мире качественных товаров
          </p>
          {!user && (
            <div className="d-flex justify-content-center gap-3">
              <a href="/login" className="btn btn-primary btn-lg">
                Войти
              </a>
              <a href="/register" className="btn btn-outline-primary btn-lg">
                Зарегистрироваться
              </a>
            </div>
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

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Ошибка при загрузке пользователя:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  return (
    <Router>
      <TopBar />
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/register" element={<RegisterForm setUser={setUser} />} />
        <Route path="/login" element={<LoginForm setUser={setUser} />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
