import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../css/Favorites.css';

export default function Favorites({ setFavoritesCount }) {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const API_BASE_URL = 'http://localhost:8000/api';

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Для просмотра избранного необходимо войти в систему');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/favorites/`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка загрузки избранного');
      }

      const data = await response.json();
      setFavorites(data);
    } catch (err) {
      console.error('Ошибка загрузки избранного:', err);
      setError('Не удалось загрузить избранные товары');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (product) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/favorites/toggle/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка обновления избранного');
      }

      const result = await response.json();
      
      if (!result.is_favorited) {
        // Товар убран из избранного
        setFavorites(prev => prev.filter(fav => fav.product.id !== product.id));
        setNotification({
          type: 'success',
          message: `Товар "${product.name}" убран из избранного!`
        });
        // Обновляем счетчик избранного
        if (setFavoritesCount) {
          setFavoritesCount(prev => Math.max(0, prev - 1));
        }
      }
      
      setTimeout(() => setNotification(null), 3000);
      
    } catch (err) {
      console.error('Ошибка обновления избранного:', err);
      setNotification({
        type: 'danger',
        message: `Не удалось обновить избранное: ${err.message}`
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setNotification({
          type: 'danger',
          message: 'Для добавления товара в корзину необходимо войти в систему'
        });
        setTimeout(() => setNotification(null), 3000);
        return;
      }

      const response = await fetch('http://localhost:8000/api/cart/add_item/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка добавления в корзину');
      }

      setNotification({
        type: 'success',
        message: `Товар "${product.name}" успешно добавлен в корзину!`
      });
      
      setTimeout(() => setNotification(null), 3000);
      
    } catch (err) {
      console.error('Ошибка добавления в корзину:', err);
      setNotification({
        type: 'danger',
        message: `Не удалось добавить товар в корзину: ${err.message}`
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  if (loading) {
    return (
      <div className="favorites-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
        <p>Загружаем избранные товары...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <div className="error-icon">⚠️</div>
        <h3>Произошла ошибка</h3>
        <p>{error}</p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/login')}
        >
          Войти в систему
        </button>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      {notification && (
        <div className={`alert alert-${notification.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`} role="alert">
          {notification.message}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setNotification(null)}
            aria-label="Close"
          ></button>
        </div>
      )}
      
      <div className="favorites-header">
        <button 
          className="btn btn-outline-secondary back-btn"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft /> Назад
        </button>
        <h1>Избранные товары</h1>
        <span className="favorites-count">{favorites.length} товаров</span>
      </div>

      {favorites.length === 0 ? (
        <div className="no-favorites">
          <div className="no-favorites-icon">💔</div>
          <h3>У вас пока нет избранных товаров</h3>
          <p>Добавляйте товары в избранное, чтобы быстро находить их позже</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/lego-shop')}
          >
            Перейти в магазин
          </button>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((favorite) => (
            <div key={favorite.id} className="favorite-card">
              <div className="favorite-image">
                {favorite.product.image ? (
                  <img src={favorite.product.image} alt={favorite.product.name} />
                ) : (
                  <div className="favorite-placeholder">
                    <span>🖼️</span>
                  </div>
                )}
                {/* Кнопка избранного */}
                <button
                  className="favorite-btn active"
                  onClick={() => handleToggleFavorite(favorite.product)}
                  title="Убрать из избранного"
                >
                  <FaHeart />
                </button>
              </div>
              <div className="favorite-info">
                <h3 className="favorite-name">{favorite.product.name}</h3>
                <p className="favorite-description">{favorite.product.description}</p>
                <div className="favorite-category">
                  <span className="category-label">Категория:</span>
                  <span className="category-name">{favorite.product.category?.name || 'Без категории'}</span>
                </div>
                <div className="favorite-price">
                  <span className="price-amount">{favorite.product.price} ₽</span>
                </div>
                <div className="favorite-stock">
                  <span className="stock-label">В наличии:</span>
                  <span className={`stock-amount ${favorite.product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {favorite.product.stock > 0 ? `${favorite.product.stock} шт.` : 'Нет в наличии'}
                  </span>
                </div>
                <button
                  className="btn btn-primary add-to-cart-btn"
                  onClick={() => handleAddToCart(favorite.product)}
                  disabled={favorite.product.stock === 0}
                >
                  {favorite.product.stock > 0 ? 'Добавить в корзину' : 'Нет в наличии'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
