from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import Category, Product, Cart, CartItem
from .serializers import (
    CategorySerializer, CategoryDetailSerializer,
    ProductSerializer, ProductDetailSerializer, ProductListSerializer,
    CartSerializer, CartItemSerializer, AddToCartSerializer, UpdateCartItemSerializer
)


class ProductPagination(PageNumberPagination):
    """Пагинация для товаров"""
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet для категорий товаров"""
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CategoryDetailSerializer
        return CategorySerializer
    
    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        """Получить товары конкретной категории с пагинацией"""
        category = self.get_object()
        products = category.products.filter(is_available=True)
        
        # Применяем пагинацию для товаров категории
        paginator = ProductPagination()
        paginated_products = paginator.paginate_queryset(products, request)
        serializer = ProductListSerializer(paginated_products, many=True)
        return paginator.get_paginated_response(serializer.data)


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet для товаров"""
    queryset = Product.objects.filter(is_available=True)
    serializer_class = ProductListSerializer
    pagination_class = ProductPagination
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer
    
    def get_queryset(self):
        queryset = Product.objects.filter(is_available=True)
        category = self.request.query_params.get('category', None)
        if category is not None:
            try:
                category_id = int(category)
                queryset = queryset.filter(category_id=category_id)
            except ValueError:
                pass
        return queryset.select_related('category')
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Получить избранные товары"""
        products = self.get_queryset()[:10]  # Первые 10 товаров
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Поиск товаров по названию с пагинацией"""
        query = request.query_params.get('q', '')
        if query:
            products = self.get_queryset().filter(name__icontains=query)
            paginator = ProductPagination()
            paginated_products = paginator.paginate_queryset(products, request)
            serializer = self.get_serializer(paginated_products, many=True)
            return paginator.get_paginated_response(serializer.data)
        return Response([])


class CartViewSet(viewsets.ModelViewSet):
    """ViewSet для корзины покупок"""
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)
    
    def get_object(self):
        """Получает или создает корзину для пользователя"""
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart
    
    @action(detail=False, methods=['get'])
    def my_cart(self, request):
        """Получить корзину текущего пользователя"""
        cart = self.get_object()
        serializer = self.get_serializer(cart)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """Добавить товар в корзину"""
        serializer = AddToCartSerializer(data=request.data)
        if serializer.is_valid():
            product_id = serializer.validated_data['product_id']
            quantity = serializer.validated_data['quantity']
            
            try:
                product = Product.objects.get(id=product_id, is_available=True)
            except Product.DoesNotExist:
                return Response(
                    {'error': 'Товар не найден или недоступен'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            if product.stock < quantity:
                return Response(
                    {'error': f'Недостаточно товара на складе. Доступно: {product.stock}'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            cart = self.get_object()
            
            with transaction.atomic():
                cart_item, created = CartItem.objects.get_or_create(
                    cart=cart,
                    product=product,
                    defaults={'quantity': quantity}
                )
                
                if not created:
                    cart_item.quantity += quantity
                    cart_item.save()
            
            # Возвращаем обновленную корзину
            cart.refresh_from_db()
            serializer = self.get_serializer(cart)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['put'])
    def update_item(self, request):
        """Обновить количество товара в корзине"""
        serializer = UpdateCartItemSerializer(data=request.data)
        if serializer.is_valid():
            item_id = request.data.get('item_id')
            quantity = serializer.validated_data['quantity']
            
            try:
                cart_item = CartItem.objects.get(
                    id=item_id, 
                    cart__user=request.user
                )
            except CartItem.DoesNotExist:
                return Response(
                    {'error': 'Элемент корзины не найден'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            if cart_item.product.stock < quantity:
                return Response(
                    {'error': f'Недостаточно товара на складе. Доступно: {cart_item.product.stock}'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            cart_item.quantity = quantity
            cart_item.save()
            
            # Возвращаем обновленную корзину
            cart = self.get_object()
            serializer = self.get_serializer(cart)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['delete'])
    def remove_item(self, request):
        """Удалить товар из корзины"""
        item_id = request.data.get('item_id')
        
        try:
            cart_item = CartItem.objects.get(
                id=item_id, 
                cart__user=request.user
            )
        except CartItem.DoesNotExist:
            return Response(
                {'error': 'Элемент корзины не найден'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        cart_item.delete()
        
        # Возвращаем обновленную корзину
        cart = self.get_object()
        serializer = self.get_serializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['delete'])
    def clear_cart(self, request):
        """Очистить корзину"""
        cart = self.get_object()
        cart.items.all().delete()
        
        serializer = self.get_serializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)


