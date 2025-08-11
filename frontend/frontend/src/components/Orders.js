import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Orders.css';

function Orders({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/orders/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setOrders(response.data);
      setError('');
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
      setError('Ошибка загрузки заказов');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'оформлен':
        return 'status-pending';
      case 'оплачен':
        return 'status-paid';
      case 'отправлен':
        return 'status-shipped';
      default:
        return 'status-default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'оформлен':
        return '📋';
      case 'оплачен':
        return '💰';
      case 'отправлен':
        return '🚚';
      default:
        return '❓';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      <div className="orders-page">
        <div className="container">
          <div className="text-center">
            <h2>Доступ запрещен</h2>
            <p>Для просмотра заказов необходимо войти в систему</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="text-center">
            <div className="loading-spinner"></div>
            <p>Загрузка заказов...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="text-center">
            <div className="alert alert-danger">
              <h4>Ошибка</h4>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={loadOrders}>
                Попробовать снова
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        {/* Заголовок */}
        <div className="orders-header">
          <h1>Мои заказы</h1>
          <p>История всех ваших заказов и их текущий статус</p>
        </div>

        {orders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">📦</div>
            <h3>У вас пока нет заказов</h3>
            <p>Сделайте свой первый заказ в нашем магазине!</p>
            <a href="/lego-shop" className="btn btn-primary">
              Перейти в магазин
            </a>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3 className="order-number">Заказ #{order.id}</h3>
                    <div className="order-date">
                      <span className="date-label">Дата заказа:</span>
                      <span className="date-value">{formatDate(order.created_at)}</span>
                    </div>
                  </div>
                  <div className="order-status">
                    <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                      <span className="status-icon">{getStatusIcon(order.status)}</span>
                      {order.status_display}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  <h4>Товары в заказе:</h4>
                  <div className="items-list">
                    {order.items.map((item) => (
                      <div key={item.id} className="order-item">
                        <div className="item-info">
                          <div className="item-name">{item.product.name}</div>
                          <div className="item-details">
                            <span className="item-quantity">Количество: {item.quantity}</span>
                            <span className="item-price">Цена: {formatPrice(item.price)}</span>
                          </div>
                        </div>
                        <div className="item-total">
                          {formatPrice(item.total_price)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span className="total-label">Общая стоимость:</span>
                    <span className="total-amount">{formatPrice(order.total_price)}</span>
                  </div>
                  
                  <div className="order-details">
                    {order.shipping_address && (
                      <div className="detail-item">
                        <span className="detail-label">Адрес доставки:</span>
                        <span className="detail-value">{order.shipping_address}</span>
                      </div>
                    )}
                    {order.phone && (
                      <div className="detail-item">
                        <span className="detail-label">Телефон:</span>
                        <span className="detail-value">{order.phone}</span>
                      </div>
                    )}
                    {order.notes && (
                      <div className="detail-item">
                        <span className="detail-label">Примечания:</span>
                        <span className="detail-value">{order.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
