import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Profile.css';

function Profile({ user, setUser }) {
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    date_joined: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    favoriteItems: 0
  });

  useEffect(() => {
    if (user) {
      loadProfileData();
      loadUserStats();
    }
  }, [user]);

  const loadProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/auth/users/me/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      
      const userData = response.data;
      setProfileData({
        username: userData.username || '',
        email: userData.email || '',
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        date_joined: userData.date_joined || ''
      });
      
      setEditForm({
        username: userData.username || '',
        email: userData.email || '',
        first_name: userData.first_name || '',
        last_name: userData.last_name || ''
      });
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error);
      setMessage('Ошибка загрузки профиля');
    }
  };

  const loadUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Загружаем статистику заказов
      const ordersResponse = await axios.get('http://localhost:8000/api/cart/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      
      // Загружаем количество избранных товаров
      const favoritesResponse = await axios.get('http://localhost:8000/api/favorites/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      
      setStats({
        totalOrders: ordersResponse.data.items?.length || 0,
        totalSpent: ordersResponse.data.total_price || 0,
        favoriteItems: favoritesResponse.data.count || 0
      });
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      username: profileData.username,
      email: profileData.email,
      first_name: profileData.first_name,
      last_name: profileData.last_name
    });
    setMessage('');
  };

  const handleChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch('http://localhost:8000/auth/users/me/', editForm, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      setProfileData({
        ...profileData,
        ...editForm
      });
      
      // Обновляем пользователя в localStorage и App.js
      const updatedUser = { ...user, ...editForm };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setIsEditing(false);
      setMessage('Профиль успешно обновлен!');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      const errorData = error?.response?.data;
      let errorMsg = 'Ошибка обновления профиля';
      
      if (errorData) {
        if (errorData.username) {
          errorMsg = `Имя пользователя: ${errorData.username[0]}`;
        } else if (errorData.email) {
          errorMsg = `Email: ${errorData.email[0]}`;
        } else if (errorData.first_name) {
          errorMsg = `Имя: ${errorData.first_name[0]}`;
        } else if (errorData.last_name) {
          errorMsg = `Фамилия: ${errorData.last_name[0]}`;
        }
      }
      
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указано';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB'
    }).format(price);
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="text-center">
            <h2>Доступ запрещен</h2>
            <p>Для просмотра профиля необходимо войти в систему</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        {/* Заголовок */}
        <div className="profile-header">
          <h1>Личный кабинет</h1>
          <p>Управляйте своим профилем и отслеживайте активность</p>
        </div>

        <div className="row">
          {/* Основная информация профиля */}
          <div className="col-lg-8">
            <div className="profile-card">
              <div className="profile-card-header">
                <h3>Информация профиля</h3>
                {!isEditing && (
                  <button className="btn btn-primary" onClick={handleEdit}>
                    Редактировать
                  </button>
                )}
              </div>
              
              {!isEditing ? (
                <div className="profile-info">
                  <div className="info-row">
                    <span className="info-label">Имя пользователя:</span>
                    <span className="info-value">{profileData.username}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{profileData.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Имя:</span>
                    <span className="info-value">{profileData.first_name || 'Не указано'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Фамилия:</span>
                    <span className="info-value">{profileData.last_name || 'Не указано'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Дата регистрации:</span>
                    <span className="info-value">{formatDate(profileData.date_joined)}</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="profile-edit-form">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Имя пользователя *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="username"
                        value={editForm.username}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={editForm.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Имя</label>
                      <input
                        type="text"
                        className="form-control"
                        name="first_name"
                        value={editForm.first_name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Фамилия</label>
                      <input
                        type="text"
                        className="form-control"
                        name="last_name"
                        value={editForm.last_name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  {message && (
                    <div className={`alert ${message.includes('успешно') ? 'alert-success' : 'alert-danger'}`}>
                      {message}
                    </div>
                  )}
                  
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                      {isLoading ? 'Сохранение...' : 'Сохранить'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                      Отмена
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Статистика и боковая панель */}
          <div className="col-lg-4">
            {/* Статистика */}
            <div className="stats-card">
              <h4>Ваша статистика</h4>
              <div className="stats-item">
                <div className="stats-icon">🛒</div>
                <div className="stats-content">
                  <div className="stats-number">{stats.totalOrders}</div>
                  <div className="stats-label">Товаров в корзине</div>
                </div>
              </div>
              <div className="stats-item">
                <div className="stats-icon">💰</div>
                <div className="stats-content">
                  <div className="stats-number">{formatPrice(stats.totalSpent)}</div>
                  <div className="stats-label">Общая сумма</div>
                </div>
              </div>
              <div className="stats-item">
                <div className="stats-icon">❤️</div>
                <div className="stats-content">
                  <div className="stats-number">{stats.favoriteItems}</div>
                  <div className="stats-label">Избранных товаров</div>
                </div>
              </div>
            </div>

            {/* Быстрые действия */}
            <div className="quick-actions-card">
              <h4>Быстрые действия</h4>
              <div className="quick-actions">
                <a href="/lego-shop" className="quick-action-btn">
                  <span className="action-icon">🛍️</span>
                  Перейти в магазин
                </a>
                <a href="/favorites" className="quick-action-btn">
                  <span className="action-icon">❤️</span>
                  Мои избранные
                </a>
                <button className="quick-action-btn" onClick={() => window.location.reload()}>
                  <span className="action-icon">🔄</span>
                  Обновить страницу
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
