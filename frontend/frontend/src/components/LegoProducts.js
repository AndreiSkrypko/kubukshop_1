import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/LegoProducts.css';

export default function LegoProducts({ selectedCategory, openCart, onResetCategory }) {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const API_BASE_URL = 'http://localhost:8000/api';

  // Извлекаем параметр поиска из URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchParam = urlParams.get('search');
    setSearchQuery(searchParam || '');
  }, [location.search]);

  // Загрузка категорий для отображения названий
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories/`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (err) {
        console.error('Ошибка загрузки категорий:', err);
      }
    };

    fetchCategories();
  }, []);

  // Загрузка товаров
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let url;
        if (searchQuery) {
          // Если есть поисковый запрос, используем API поиска
          url = `${API_BASE_URL}/products/search/?q=${encodeURIComponent(searchQuery)}&page=${currentPage}`;
        } else if (selectedCategory) {
          // Если выбрана категория, загружаем товары категории
          url = `${API_BASE_URL}/categories/${selectedCategory}/products/?page=${currentPage}`;
        } else {
          // Иначе загружаем все товары
          url = `${API_BASE_URL}/products/?page=${currentPage}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Ошибка загрузки товаров');
        }
        const data = await response.json();
        
        // Обработка пагинированных данных
        setProducts(data.results || data);
        setTotalCount(data.count || data.length);
        setTotalPages(Math.ceil((data.count || data.length) / 10));
      } catch (err) {
        console.error('Ошибка загрузки товаров:', err);
        setError('Не удалось загрузить товары. Проверьте, запущен ли Django сервер.');
        setProducts([]);
        setTotalCount(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, currentPage, searchQuery]);

  // Сброс страницы при смене категории или поиска
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

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

      console.log('Adding product to cart:', product.id, 'with token:', token);

      const response = await fetch(`${API_BASE_URL}/cart/add_item/`, {
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

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        throw new Error(`Ошибка добавления в корзину: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Success response:', result);

      setNotification({
        type: 'success',
        message: `Товар "${product.name}" успешно добавлен в корзину!`
      });
      
      // Скрываем уведомление через 3 секунды
      setTimeout(() => setNotification(null), 3000);
      
      // Открываем корзину после успешного добавления
      if (openCart) {
        openCart();
      }
    } catch (err) {
      console.error('Ошибка добавления в корзину:', err);
      setNotification({
        type: 'danger',
        message: `Не удалось добавить товар в корзину: ${err.message}`
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleShowAllProducts = () => {
    // Сброс выбранной категории и поиска
    setSearchQuery('');
    if (onResetCategory) {
      onResetCategory();
    }
    // Очищаем URL от параметров поиска
    window.history.pushState({}, '', '/lego-shop');
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (onResetCategory) {
      onResetCategory();
    }
    // Очищаем URL от параметров поиска
    window.history.pushState({}, '', '/lego-shop');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Кнопка "Предыдущая"
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          className="page-btn prev-btn"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          ← Предыдущая
        </button>
      );
    }

    // Кнопка "Первая страница"
    if (startPage > 1) {
      pages.push(
        <button
          key="first"
          className="page-btn"
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="dots1" className="page-dots">...</span>);
      }
    }

    // Номера страниц
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`page-btn ${i === currentPage ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    // Кнопка "Последняя страница"
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="dots2" className="page-dots">...</span>);
      }
      pages.push(
        <button
          key="last"
          className="page-btn"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    // Кнопка "Следующая"
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          className="page-btn next-btn"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Следующая →
        </button>
      );
    }

    return (
      <div className="pagination-container">
        <div className="pagination-info">
          Показано {((currentPage - 1) * 10) + 1}-{Math.min(currentPage * 10, totalCount)} из {totalCount} товаров
        </div>
        <div className="pagination-controls">
          {pages}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="products-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
        <p>Загружаем товары...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <div className="error-icon">⚠️</div>
        <h3>Произошла ошибка</h3>
        <p>{error}</p>
        <div className="error-details">
          <p><strong>Возможные причины:</strong></p>
          <ul>
            <li>Django сервер не запущен</li>
            <li>Проблемы с подключением к базе данных</li>
            <li>Ошибки в API</li>
          </ul>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  const selectedCategoryName = selectedCategory 
    ? categories.find(c => c.id === selectedCategory)?.name 
    : null;

  return (
    <div className="lego-products">
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
      
      <div className="products-header">
        <h2>
          {searchQuery 
            ? `Результаты поиска по названию "${searchQuery}" (найдено ${totalCount} товаров)`
            : selectedCategory 
              ? `Товары в категории "${selectedCategoryName || 'Неизвестная категория'}"`
              : 'Все товары'
          }
        </h2>
        <div className="header-buttons">
          {searchQuery && (
            <button 
              className="btn btn-outline-secondary me-2"
              onClick={handleClearSearch}
            >
              Очистить поиск
            </button>
          )}
          {selectedCategory && !searchQuery && (
            <button 
              className="btn btn-outline-primary"
              onClick={handleShowAllProducts}
            >
              Показать все товары
            </button>
          )}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="no-products">
          <div className="no-products-icon">📦</div>
          <h3>Товары не найдены</h3>
          <p>
            {searchQuery 
              ? `По запросу "${searchQuery}" ничего не найдено. Попробуйте изменить поисковый запрос.`
              : selectedCategory 
                ? 'В выбранной категории пока нет товаров'
                : 'В магазине пока нет товаров'
            }
          </p>
          {searchQuery && (
            <button 
              className="btn btn-primary"
              onClick={handleClearSearch}
            >
              Очистить поиск
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <div className="product-placeholder">
                      <span>🖼️</span>
                    </div>
                  )}
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-category">
                    <span className="category-label">Категория:</span>
                    <span className="category-name">{product.category?.name || 'Без категории'}</span>
                  </div>
                  <div className="product-price">
                    <span className="price-amount">{product.price} ₽</span>
                    <span className="price-currency"></span>
                  </div>
                  <div className="product-stock">
                    <span className="stock-label">В наличии:</span>
                    <span className={`stock-amount ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      {product.stock > 0 ? `${product.stock} шт.` : 'Нет в наличии'}
                    </span>
                  </div>
                  <button
                    className="btn btn-primary add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    {product.stock > 0 ? 'Добавить в корзину' : 'Нет в наличии'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {renderPagination()}
        </>
      )}
    </div>
  );
} 