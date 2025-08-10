import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import "../css/TopBar.css";

export default function TopBar({ user, openCart }) {
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch('http://localhost:8000/api/cart/my_cart/', {
            headers: {
              'Authorization': `Token ${token}`,
            },
          });
          if (response.ok) {
            const cart = await response.json();
            const count = cart.items ? cart.items.length : 0;
            setCartItemCount(count);
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки корзины:', error);
      }
    };

    fetchCartCount();

    // Обновляем счетчик каждые 5 секунд
    const interval = setInterval(fetchCartCount, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="topbar py-1 small">
      <div className="container d-flex justify-content-between align-items-center">
        <div>
          При заказе от <strong>4 000 ₽</strong> — Бесплатная доставка
        </div>
        <div>
          Часы работы: <strong>10:00 - 17:00</strong>
        </div>
        <div>
          {user && (
            <button
              onClick={openCart}
              className="cart-button text-decoration-none text-dark border-0 bg-transparent"
            >
              <FaShoppingCart className="me-1" />
              Корзина
              {cartItemCount > 0 && (
                <span className="badge bg-danger ms-1">{cartItemCount}</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
