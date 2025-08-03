import React, { useState } from 'react';
import '../css/Sidebar.css';

export default function Sidebar({ onCategorySelect, selectedCategory }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const legoCategories = [
    {
      id: 'bricks',
      name: 'Кубики',
      icon: '🧱',
      subcategories: [
        { id: '2x2', name: '2x2' },
        { id: '2x4', name: '2x4' },
        { id: '1x2', name: '1x2' },
        { id: '1x4', name: '1x4' },
        { id: '1x1', name: '1x1' }
      ]
    },
    {
      id: 'plates',
      name: 'Пластины',
      icon: '📏',
      subcategories: [
        { id: 'plate-2x2', name: 'Пластина 2x2' },
        { id: 'plate-2x4', name: 'Пластина 2x4' },
        { id: 'plate-1x2', name: 'Пластина 1x2' },
        { id: 'plate-1x4', name: 'Пластина 1x4' }
      ]
    },
    {
      id: 'axles',
      name: 'Оси',
      icon: '⚙️',
      subcategories: [
        { id: 'axle-2', name: 'Ось 2' },
        { id: 'axle-3', name: 'Ось 3' },
        { id: 'axle-4', name: 'Ось 4' },
        { id: 'axle-6', name: 'Ось 6' },
        { id: 'axle-8', name: 'Ось 8' }
      ]
    },
    {
      id: 'gears',
      name: 'Шестерни',
      icon: '⚙️',
      subcategories: [
        { id: 'gear-8', name: 'Шестерня 8 зубьев' },
        { id: 'gear-16', name: 'Шестерня 16 зубьев' },
        { id: 'gear-24', name: 'Шестерня 24 зуба' },
        { id: 'gear-40', name: 'Шестерня 40 зубьев' }
      ]
    },
    {
      id: 'wheels',
      name: 'Колеса',
      icon: '🛞',
      subcategories: [
        { id: 'wheel-small', name: 'Маленькое колесо' },
        { id: 'wheel-medium', name: 'Среднее колесо' },
        { id: 'wheel-large', name: 'Большое колесо' },
        { id: 'wheel-thin', name: 'Тонкое колесо' }
      ]
    },
    {
      id: 'connectors',
      name: 'Соединители',
      icon: '🔗',
      subcategories: [
        { id: 'connector-1', name: 'Соединитель 1' },
        { id: 'connector-2', name: 'Соединитель 2' },
        { id: 'connector-3', name: 'Соединитель 3' },
        { id: 'connector-4', name: 'Соединитель 4' }
      ]
    },
    {
      id: 'special',
      name: 'Специальные',
      icon: '⭐',
      subcategories: [
        { id: 'hinge', name: 'Петля' },
        { id: 'bracket', name: 'Кронштейн' },
        { id: 'beam', name: 'Балка' },
        { id: 'angle', name: 'Уголок' }
      ]
    }
  ];

  const handleCategoryClick = (categoryId) => {
    onCategorySelect(categoryId);
  };

  const handleSubcategoryClick = (categoryId, subcategoryId) => {
    onCategorySelect(`${categoryId}-${subcategoryId}`);
  };

  return (
    <>
      {/* Мобильная кнопка меню */}
      <div className="mobile-menu-toggle d-md-none">
        <button 
          className="btn btn-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰ Меню LEGO
        </button>
      </div>
      
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'show' : ''}`}>
        <div className="sidebar-header">
          <h5 className="sidebar-title">
            {!isCollapsed && <span>Детали LEGO</span>}
          </h5>
          <button 
            className="sidebar-toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
      
      <div className="sidebar-content">
        {legoCategories.map((category) => (
          <div key={category.id} className="category-item">
            <div 
              className={`category-header ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              {!isCollapsed && <span className="category-name">{category.name}</span>}
            </div>
            
            {!isCollapsed && selectedCategory === category.id && (
              <div className="subcategories">
                {category.subcategories.map((subcategory) => (
                  <div 
                    key={subcategory.id}
                    className="subcategory-item"
                    onClick={() => handleSubcategoryClick(category.id, subcategory.id)}
                  >
                    {subcategory.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    </>
  );
} 