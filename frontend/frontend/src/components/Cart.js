import React, { useState, useEffect } from 'react';
import '../css/Cart.css';

export default function Cart({ user, onClose }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const API_BASE_URL = 'http://localhost:8000/api';

  useEffect(() => {
    console.log('Cart component mounted, user:', user);
    if (user) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      console.log('Fetching cart for user:', user);
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'exists' : 'missing');
      
      const response = await fetch('http://localhost:8000/api/cart/', {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      
      console.log('Cart API response status:', response.status);
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки корзины');
      }
      
      const data = await response.json();
      console.log('Cart data received:', data);
      setCart(data);
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error);
      setError('Не удалось загрузить корзину');
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setUpdating(true);
      const response = await fetch('http://localhost:8000/api/cart/update_item/', {
        method: 'PUT',
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item_id: itemId,
          quantity: newQuantity,
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка обновления количества');
      }

      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (err) {
      console.error('Ошибка обновления количества:', err);
      alert('Не удалось обновить количество товара');
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/cart/remove_item/', {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item_id: itemId }),
      });

      if (!response.ok) {
        throw new Error('Ошибка удаления товара');
      }

      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (error) {
      console.error('Ошибка удаления товара:', error);
      setError('Не удалось удалить товар');
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Вы уверены, что хотите очистить корзину?')) {
      return;
    }

    try {
      setUpdating(true);
      const response = await fetch('http://localhost:8000/api/cart/clear_cart/', {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка очистки корзины');
      }

      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (err) {
      console.error('Ошибка очистки корзины:', err);
      alert('Не удалось очистить корзину');
    } finally {
      setUpdating(false);
    }
  };

  const handleCheckout = () => {
    // Здесь будет логика оформления заказа
    alert('Функция оформления заказа будет добавлена позже');
  };

  if (loading) {
    console.log('Cart: Rendering loading state');
    return (
      <div className="cart-overlay">
        <div className="cart-modal">
          <div className="cart-loading">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
            <p>Загружаем корзину...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.log('Cart: Rendering error state:', error);
    return (
      <div className="cart-overlay">
        <div className="cart-modal">
          <div className="cart-error">
            <div className="error-icon">⚠️</div>
            <h3>Ошибка загрузки</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchCart}>
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log('Cart: Rendering main cart content, cart data:', cart);
  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h3>Корзина покупок</h3>
          <button className="cart-close" onClick={onClose}>
            ×
          </button>
        </div>

        {!cart || cart.items.length === 0 ? (
          <div className="cart-empty">
            <div className="empty-icon">🛒</div>
            <h4>Корзина пуста</h4>
            <p>Добавьте товары в корзину для оформления заказа</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.items.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    {item.product.image ? (
                      <img src={item.product.image} alt={item.product.name} />
                    ) : (
                      <div className="item-placeholder">
                        <span>🖼️</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="item-info">
                    <h4 className="item-name">{item.product.name}</h4>
                    <p className="item-category">{item.product.category?.name}</p>
                    <div className="item-price">
                      <span className="price-amount">{item.product.price} ₽</span>
                      <span className="price-per-item">за шт.</span>
                    </div>
                  </div>

                  <div className="item-quantity">
                    <button
                      className="quantity-btn"
                      onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                      disabled={updating || item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                      disabled={updating || item.quantity >= item.product.stock}
                    >
                      +
                    </button>
                  </div>

                  <div className="item-total">
                    <span className="total-amount">{item.total_price} ₽</span>
                  </div>

                  <button
                    className="remove-item-btn"
                    onClick={() => removeItem(item.id)}
                    disabled={updating}
                    title="Удалить из корзины"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>Товаров в корзине:</span>
                <span>{cart.total_items}</span>
              </div>
              <div className="summary-row total">
                <span>Итого:</span>
                <span className="total-price">{cart.total_price} ₽</span>
              </div>
            </div>

            <div className="cart-actions">
              <button
                className="btn btn-outline-danger"
                onClick={clearCart}
                disabled={updating}
              >
                Очистить корзину
              </button>
              <button
                className="btn btn-primary checkout-btn"
                onClick={handleCheckout}
                disabled={updating}
              >
                Оформить заказ
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
