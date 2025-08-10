#!/usr/bin/env python
"""
Скрипт для создания тестовых данных в базе данных
"""
import os
import sys
import django

# Добавляем путь к проекту в sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Настраиваем Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from products.models import Category, Product

def create_sample_data():
    """Создает тестовые категории и товары"""
    
    print("Создание тестовых данных...")
    
    # Создаем категории
    categories_data = [
        {
            'name': 'Кубики LEGO',
            'description': 'Основные строительные блоки LEGO различных размеров',
            'slug': 'lego-bricks',
            'is_active': True
        },
        {
            'name': 'Пластины LEGO',
            'description': 'Тонкие пластины для строительства и отделки',
            'slug': 'lego-plates',
            'is_active': True
        },
        {
            'name': 'Оси и шестерни',
            'description': 'Механические элементы для создания движущихся конструкций',
            'slug': 'lego-mechanics',
            'is_active': True
        },
        {
            'name': 'Колеса и шины',
            'description': 'Колеса различных размеров для транспортных средств',
            'slug': 'lego-wheels',
            'is_active': True
        },
        {
            'name': 'Специальные элементы',
            'description': 'Уникальные детали для особых конструкций',
            'slug': 'lego-special',
            'is_active': True
        }
    ]
    
    created_categories = []
    for cat_data in categories_data:
        category, created = Category.objects.get_or_create(
            slug=cat_data['slug'],
            defaults=cat_data
        )
        if created:
            print(f"Создана категория: {category.name}")
        else:
            print(f"Категория уже существует: {category.name}")
        created_categories.append(category)
    
    # Создаем товары
    products_data = [
        {
            'name': 'Кубик LEGO 2x2',
            'description': 'Классический кубик LEGO размером 2x2, идеально подходит для строительства',
            'price': 15.00,
            'slug': 'lego-brick-2x2',
            'stock': 100,
            'is_available': True,
            'category': 'lego-bricks'
        },
        {
            'name': 'Кубик LEGO 2x4',
            'description': 'Кубик LEGO размером 2x4 для строительства больших конструкций',
            'price': 25.00,
            'slug': 'lego-brick-2x4',
            'stock': 85,
            'is_available': True,
            'category': 'lego-bricks'
        },
        {
            'name': 'Пластина LEGO 2x2',
            'description': 'Тонкая пластина LEGO 2x2 для отделки и декора',
            'price': 10.00,
            'slug': 'lego-plate-2x2',
            'stock': 200,
            'is_available': True,
            'category': 'lego-plates'
        },
        {
            'name': 'Пластина LEGO 2x4',
            'description': 'Тонкая пластина LEGO 2x4 для создания оснований',
            'price': 18.00,
            'slug': 'lego-plate-2x4',
            'stock': 150,
            'is_available': True,
            'category': 'lego-plates'
        },
        {
            'name': 'Ось LEGO длиной 2',
            'description': 'Ось LEGO длиной 2 единицы для механических конструкций',
            'price': 8.00,
            'slug': 'lego-axle-2',
            'stock': 150,
            'is_available': True,
            'category': 'lego-mechanics'
        },
        {
            'name': 'Ось LEGO длиной 4',
            'description': 'Ось LEGO длиной 4 единицы для длинных механизмов',
            'price': 12.00,
            'slug': 'lego-axle-4',
            'stock': 120,
            'is_available': True,
            'category': 'lego-mechanics'
        },
        {
            'name': 'Шестерня LEGO 8 зубьев',
            'description': 'Шестерня с 8 зубьями для передачи движения',
            'price': 18.00,
            'slug': 'lego-gear-8',
            'stock': 75,
            'is_available': True,
            'category': 'lego-mechanics'
        },
        {
            'name': 'Колесо LEGO маленькое',
            'description': 'Маленькое колесо для моделей автомобилей и мотоциклов',
            'price': 20.00,
            'slug': 'lego-wheel-small',
            'stock': 90,
            'is_available': True,
            'category': 'lego-wheels'
        },
        {
            'name': 'Колесо LEGO среднее',
            'description': 'Среднее колесо для грузовиков и строительной техники',
            'price': 28.00,
            'slug': 'lego-wheel-medium',
            'stock': 60,
            'is_available': True,
            'category': 'lego-wheels'
        },
        {
            'name': 'Соединитель LEGO',
            'description': 'Соединительный элемент для крепления деталей',
            'price': 6.00,
            'slug': 'lego-connector',
            'stock': 300,
            'is_available': True,
            'category': 'lego-special'
        },
        {
            'name': 'Петля LEGO',
            'description': 'Петля для создания подвижных соединений',
            'price': 15.00,
            'slug': 'lego-hinge',
            'stock': 60,
            'is_available': True,
            'category': 'lego-special'
        },
        {
            'name': 'Кронштейн LEGO',
            'description': 'Кронштейн для крепления элементов под углом',
            'price': 22.00,
            'slug': 'lego-bracket',
            'stock': 45,
            'is_available': True,
            'category': 'lego-special'
        }
    ]
    
    for prod_data in products_data:
        # Находим категорию по slug
        category = Category.objects.get(slug=prod_data.pop('category'))
        
        product, created = Product.objects.get_or_create(
            slug=prod_data['slug'],
            defaults={**prod_data, 'category': category}
        )
        if created:
            print(f"Создан товар: {product.name} в категории {product.category.name}")
        else:
            print(f"Товар уже существует: {product.name}")
    
    print("\nТестовые данные созданы успешно!")
    print(f"Создано категорий: {Category.objects.count()}")
    print(f"Создано товаров: {Product.objects.count()}")


if __name__ == '__main__':
    create_sample_data()
