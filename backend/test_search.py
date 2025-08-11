#!/usr/bin/env python
"""
Скрипт для тестирования поиска товаров
"""
import os
import sys
import django

# Добавляем путь к проекту в sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Настраиваем Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from products.models import Product

def test_search():
    """Тестирует поиск товаров"""
    
    print("=== ТЕСТИРОВАНИЕ ПОИСКА ===")
    
    # Тестовые запросы
    test_queries = [
        "кубик",
        "Кубик", 
        "КУБИК",
        "lego",
        "LEGO",
        "Lego",
        "колесо",
        "Колесо",
        "ось",
        "Ось"
    ]
    
    for query in test_queries:
        print(f"\n--- Поиск по '{query}' ---")
        
        # Прямой поиск
        products = Product.objects.filter(name__icontains=query)
        print(f"Прямой поиск: {products.count()} товаров")
        for product in products[:3]:
            print(f"  - {product.name}")
        
        # Поиск по нормализованному запросу
        normalized_query = query.strip().lower()
        products_norm = Product.objects.filter(name__icontains=normalized_query)
        print(f"Нормализованный поиск '{normalized_query}': {products_norm.count()} товаров")
        
        # Поиск по началу
        products_start = Product.objects.filter(name__istartswith=normalized_query)
        print(f"Поиск по началу '{normalized_query}': {products_start.count()} товаров")

if __name__ == "__main__":
    test_search()
