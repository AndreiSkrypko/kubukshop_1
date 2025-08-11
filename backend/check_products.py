#!/usr/bin/env python
"""
Скрипт для проверки товаров в базе данных
"""
import os
import sys
import django

# Добавляем путь к проекту в sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Настраиваем Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from products.models import Product, Category

def check_products():
    """Проверяет товары в базе данных"""
    
    print("=== ПРОВЕРКА БАЗЫ ДАННЫХ ===")
    
    # Проверяем категории
    categories = Category.objects.all()
    print(f"\nКатегории ({categories.count()}):")
    for cat in categories:
        print(f"- {cat.name} (активна: {cat.is_active})")
    
    # Проверяем товары
    products = Product.objects.all()
    print(f"\nТовары ({products.count()}):")
    for product in products:
        print(f"- {product.name} (доступен: {product.is_available}, цена: {product.price} ₽)")
    
    # Проверяем поиск по разным запросам
    print(f"\n=== ТЕСТ ПОИСКА ===")
    search_queries = ["кубик", "lego", "колесо", "ось", "пластина"]
    for query in search_queries:
        found_products = Product.objects.filter(name__icontains=query)
        print(f"Поиск по '{query}': найдено {found_products.count()} товаров")
        for product in found_products:
            print(f"  - {product.name}")
        print()

if __name__ == "__main__":
    check_products()
