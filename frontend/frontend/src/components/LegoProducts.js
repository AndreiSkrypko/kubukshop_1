import React, { useState, useEffect } from 'react';
import '../css/LegoProducts.css';

export default function LegoProducts({ selectedCategory }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Моковые данные товаров LEGO
  const mockProducts = [
    {
      id: 1,
      name: 'Кубик LEGO 2x2',
      category: 'bricks',
      subcategory: '2x2',
      price: 15,
      image: '🧱',
      description: 'Классический кубик LEGO размером 2x2',
      inStock: true,
      colors: ['Красный', 'Синий', 'Желтый', 'Зеленый']
    },
    {
      id: 2,
      name: 'Кубик LEGO 2x4',
      category: 'bricks',
      subcategory: '2x4',
      price: 25,
      image: '🧱',
      description: 'Кубик LEGO размером 2x4 для строительства',
      inStock: true,
      colors: ['Красный', 'Синий', 'Желтый', 'Зеленый', 'Белый']
    },
    {
      id: 3,
      name: 'Ось LEGO 2',
      category: 'axles',
      subcategory: 'axle-2',
      price: 8,
      image: '⚙️',
      description: 'Ось LEGO длиной 2 единицы',
      inStock: true,
      colors: ['Черный', 'Серый']
    },
    {
      id: 4,
      name: 'Ось LEGO 4',
      category: 'axles',
      subcategory: 'axle-4',
      price: 12,
      image: '⚙️',
      description: 'Ось LEGO длиной 4 единицы',
      inStock: true,
      colors: ['Черный', 'Серый', 'Белый']
    },
    {
      id: 5,
      name: 'Пластина LEGO 2x2',
      category: 'plates',
      subcategory: 'plate-2x2',
      price: 10,
      image: '📏',
      description: 'Тонкая пластина LEGO 2x2',
      inStock: true,
      colors: ['Красный', 'Синий', 'Желтый', 'Зеленый', 'Белый']
    },
    {
      id: 6,
      name: 'Шестерня LEGO 8 зубьев',
      category: 'gears',
      subcategory: 'gear-8',
      price: 18,
      image: '⚙️',
      description: 'Шестерня с 8 зубьями для механизмов',
      inStock: true,
      colors: ['Черный', 'Серый', 'Белый']
    },
    {
      id: 7,
      name: 'Колесо LEGO маленькое',
      category: 'wheels',
      subcategory: 'wheel-small',
      price: 20,
      image: '🛞',
      description: 'Маленькое колесо для моделей',
      inStock: true,
      colors: ['Черный', 'Серый']
    },
    {
      id: 8,
      name: 'Соединитель LEGO 1',
      category: 'connectors',
      subcategory: 'connector-1',
      price: 6,
      image: '🔗',
      description: 'Соединительный элемент',
      inStock: true,
      colors: ['Черный', 'Серый', 'Белый']
    },
    {
      id: 9,
      name: 'Петля LEGO',
      category: 'special',
      subcategory: 'hinge',
      price: 15,
      image: '⭐',
      description: 'Петля для подвижных соединений',
      inStock: true,
      colors: ['Черный', 'Серый']
    },
    {
      id: 10,
      name: 'Кронштейн LEGO',
      category: 'special',
      subcategory: 'bracket',
      price: 22,
      image: '⭐',
      description: 'Кронштейн для крепления элементов',
      inStock: true,
      colors: ['Черный', 'Серый', 'Белый']
    }
  ];

  useEffect(() => {
    // Имитация загрузки данных
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const [category, subcategory] = selectedCategory.split('-');
      let filtered = products;
      
      if (subcategory) {
        filtered = products.filter(product => 
          product.category === category && product.subcategory === subcategory
        );
      } else {
        filtered = products.filter(product => product.category === category);
      }
      
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [selectedCategory, products]);

  const handleAddToCart = (product) => {
    // Здесь будет логика добавления в корзину
    console.log('Добавлено в корзину:', product.name);
    alert(`Товар "${product.name}" добавлен в корзину!`);
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

  return (
    <div className="lego-products">
      <div className="products-header">
        <h2>
          {selectedCategory ? 
            `Детали LEGO - ${selectedCategory.replace('-', ' ')}` : 
            'Все детали LEGO'
          }
        </h2>
        <p className="products-count">
          Найдено товаров: {filteredProducts.length}
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <div className="no-products-icon">🔍</div>
          <h3>Товары не найдены</h3>
          <p>Попробуйте выбрать другую категорию или изменить параметры поиска</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <span className="product-icon">{product.image}</span>
              </div>
              <div className="product-info">
                <h4 className="product-name">{product.name}</h4>
                <p className="product-description">{product.description}</p>
                <div className="product-colors">
                  <strong>Цвета:</strong> {product.colors.join(', ')}
                </div>
                <div className="product-price">
                  <span className="price">{product.price} ₽</span>
                  <span className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                    {product.inStock ? 'В наличии' : 'Нет в наличии'}
                  </span>
                </div>
                <button 
                  className="btn btn-primary add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                >
                  {product.inStock ? 'Добавить в корзину' : 'Нет в наличии'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 