import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/CategoryList.css';

const API_BASE_URL = 'http://localhost:8000/api';

export default function CategoryList({ onCategorySelect, selectedCategory }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/categories/`);
        
        // Ensure we always have an array
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error('API returned non-array data:', response.data);
          setCategories([]);
          setError('Неверный формат данных от сервера');
        }
        setLoading(false);
      } catch (err) {
        console.error('Ошибка загрузки категорий:', err);
        setCategories([]); // Ensure categories is always an array
        setError('Не удалось загрузить категории. Проверьте, запущен ли сервер Django.');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categorySlug) => {
    onCategorySelect(categorySlug);
  };

  // Calculate total products count safely
  const getTotalProductsCount = () => {
    if (!Array.isArray(categories) || categories.length === 0) {
      return 0;
    }
    return categories.reduce((total, cat) => {
      const count = cat.products_count || 0;
      return total + count;
    }, 0);
  };

  if (loading) {
    return (
      <div className="categories-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
        <p>Загружаем категории...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="categories-error">
        <div className="error-icon">⚠️</div>
        <p>{error}</p>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  // Ensure categories is an array before rendering
  if (!Array.isArray(categories)) {
    return (
      <div className="categories-error">
        <div className="error-icon">⚠️</div>
        <p>Ошибка: неверный формат данных</p>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="category-list">
      <div className="category-header">
        <h3>Категории товаров</h3>
        <button 
          className={`category-item ${!selectedCategory ? 'active' : ''}`}
          onClick={() => handleCategoryClick(null)}
        >
          <span className="category-icon">🏠</span>
          <span className="category-name">Все товары</span>
          <span className="category-count">({getTotalProductsCount()})</span>
        </button>
      </div>
      
      <div className="categories-container">
        {categories.length === 0 ? (
          <div className="no-categories">
            <p>Категории не найдены</p>
          </div>
        ) : (
          categories.map((category) => (
            <button
              key={category.id}
              className={`category-item ${selectedCategory === category.slug ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category.slug)}
            >
              <div className="category-content">
                {category.image ? (
                  <img 
                    src={`http://localhost:8000${category.image}`} 
                    alt={category.name}
                    className="category-image"
                  />
                ) : (
                  <span className="category-icon">📦</span>
                )}
                <div className="category-info">
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">({category.products_count || 0})</span>
                </div>
              </div>
              {category.description && (
                <p className="category-description">{category.description}</p>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
