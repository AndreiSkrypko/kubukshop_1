#!/usr/bin/env python
"""
Детальный скрипт для отладки поиска товаров
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

def debug_search():
    """Детальная отладка поиска товаров"""
    
    print("=== ДЕТАЛЬНАЯ ОТЛАДКА ПОИСКА ===")
    
    # Получаем все товары
    products = Product.objects.all()
    print(f"Всего товаров в базе: {products.count()}")
    
    # Анализируем названия товаров
    print("\n--- АНАЛИЗ НАЗВАНИЙ ТОВАРОВ ---")
    for product in products:
        name = product.name
        print(f"ID: {product.id}")
        print(f"Название: '{name}'")
        print(f"Длина: {len(name)}")
        print(f"Байты: {name.encode('utf-8')}")
        print(f"Нижний регистр: '{name.lower()}'")
        print(f"Содержит 'кубик': {'кубик' in name.lower()}")
        print(f"Содержит 'lego': {'lego' in name.lower()}")
        print("---")
    
    # Тестируем поиск
    print("\n--- ТЕСТИРОВАНИЕ ПОИСКА ---")
    
    # Тест 1: Поиск по "кубик"
    query = "кубик"
    print(f"\nПоиск по '{query}':")
    
    # Прямой поиск
    products_direct = Product.objects.filter(name__icontains=query)
    print(f"Прямой поиск: {products_direct.count()}")
    
    # Поиск по нижнему регистру
    products_lower = Product.objects.filter(name__icontains=query.lower())
    print(f"Поиск по нижнему: {products_lower.count()}")
    
    # Поиск по верхнему регистру
    products_upper = Product.objects.filter(name__icontains=query.upper())
    print(f"Поиск по верхнему: {products_upper.count()}")
    
    # Поиск по началу
    products_start = Product.objects.filter(name__istartswith=query)
    print(f"Поиск по началу: {products_start.count()}")
    
    # Тест 2: Поиск по "lego"
    query2 = "lego"
    print(f"\nПоиск по '{query2}':")
    
    products_lego = Product.objects.filter(name__icontains=query2)
    print(f"Поиск по 'lego': {products_lego.count()}")
    
    # Проверяем конкретные товары
    print("\n--- ПРОВЕРКА КОНКРЕТНЫХ ТОВАРОВ ---")
    cube_products = Product.objects.filter(name__icontains="Кубик")
    print(f"Товары с 'Кубик': {cube_products.count()}")
    for product in cube_products:
        print(f"  - {product.name}")

if __name__ == "__main__":
    debug_search()
