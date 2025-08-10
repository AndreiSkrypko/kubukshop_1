import React, { useState, useEffect } from 'react';
import '../css/Sidebar.css';

export default function Sidebar({ onCategorySelect, selectedCategory }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:8000/api';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/categories/`);
        if (!response.ok) {
          throw new Error('Ошибка загрузки категорий');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Ошибка загрузки категорий:', err);
        setError('Не удалось загрузить категории');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    onCategorySelect(categoryId);
  };

  const handleShowAllProducts = () => {
    onCategorySelect(null);
  };

  if (loading) {
    return (
      <div className="sidebar-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
        <p>Загружаем категории...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sidebar-error">
        <div className="error-icon">⚠️</div>
        <h3>Ошибка загрузки</h3>
        <p>{error}</p>
        <button 
          className="btn btn-primary btn-sm"
          onClick={() => window.location.reload()}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Категории</h3>
      </div>
      
      <div className="sidebar-content">
        <div 
          className={`category-item ${!selectedCategory ? 'active' : ''}`}
          onClick={handleShowAllProducts}
        >
          <div className="category-icon">🏠</div>
          <span>Все товары</span>
        </div>
        
        {categories.map((category) => (
          <div
            key={category.id}
            className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="category-icon">📦</div>
            <span>{category.name}</span>
            <span className="products-count">({category.products_count || 0})</span>
          </div>
        ))}
      </div>
    </div>
  );
} 