from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.db.models import Q
from .models import Category, Product, Cart, CartItem, Favorite, Order, OrderItem
from .serializers import (
    CategorySerializer, ProductSerializer, CartSerializer, 
    CartItemSerializer, AddToCartSerializer, UpdateCartItemSerializer,
    FavoriteSerializer, OrderSerializer, CreateOrderSerializer
)
from .pagination import ProductPagination

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        """Получить товары конкретной категории"""
        try:
            category = self.get_object()
            products = Product.objects.filter(category=category, is_available=True)
            
            paginator = ProductPagination()
            paginated_products = paginator.paginate_queryset(products, request)
            serializer = ProductSerializer(paginated_products, many=True, context={'request': request})
            
            return paginator.get_paginated_response(serializer.data)
        except Category.DoesNotExist:
            return Response({'error': 'Категория не найдена'}, status=status.HTTP_404_NOT_FOUND)

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_available=True)
    serializer_class = ProductSerializer
    pagination_class = ProductPagination
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Поиск товаров по названию с пагинацией"""
        query = request.query_params.get('q', '')
        print(f"Поисковый запрос: '{query}'")
        
        if query:
            # Используем базовый queryset с фильтром доступности
            base_queryset = Product.objects.filter(is_available=True)
            print(f"Базовый queryset содержит {base_queryset.count()} доступных товаров")
            
            from django.db.models import Q
            
            q_objects = Q()
            
            # 1. Поиск по оригинальному запросу (как есть)
            q_objects |= Q(name__icontains=query)
            
            # 2. Поиск по запросу в верхнем регистре
            q_objects |= Q(name__icontains=query.upper())
            
            # 3. Поиск по запросу в нижнем регистре
            q_objects |= Q(name__icontains=query.lower())
            
            # 4. Поиск по запросу с заглавной первой буквой
            if query:
                capitalized_query = query[0].upper() + query[1:].lower()
                q_objects |= Q(name__icontains=capitalized_query)
            
            # 5. Поиск по началу названия (независимо от регистра)
            q_objects |= Q(name__istartswith=query)
            q_objects |= Q(name__istartswith=query.lower())
            q_objects |= Q(name__istartswith=query.upper())
            
            # 6. Поиск по словам (независимо от регистра)
            words = query.split()
            for word in words:
                if len(word) >= 2:
                    q_objects |= Q(name__icontains=word)
                    q_objects |= Q(name__icontains=word.lower())
                    q_objects |= Q(name__icontains=word.upper())
            
            products = base_queryset.filter(q_objects).distinct()
            print(f"Комплексный поиск: найдено {products.count()} товаров")
            
            for product in products[:5]:
                print(f"Найден товар: {product.name} (is_available: {product.is_available})")
            
            paginator = ProductPagination()
            paginated_products = paginator.paginate_queryset(products, request)
            serializer = self.get_serializer(paginated_products, many=True)
            return paginator.get_paginated_response(serializer.data)
        return Response([])

class CartViewSet(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Получить корзину текущего пользователя"""
        try:
            cart, created = Cart.objects.get_or_create(user=request.user)
            serializer = CartSerializer(cart)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error in my_cart: {e}")
            import traceback
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CartAddItemView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Добавить товар в корзину"""
        try:
            serializer = AddToCartSerializer(data=request.data)
            if serializer.is_valid():
                cart, created = Cart.objects.get_or_create(user=request.user)
                product_id = serializer.validated_data['product_id']
                quantity = serializer.validated_data['quantity']
                
                try:
                    product = Product.objects.get(id=product_id, is_available=True)
                except Product.DoesNotExist:
                    return Response({'error': 'Товар не найден или недоступен'}, status=status.HTTP_404_NOT_FOUND)
                
                if product.stock < quantity:
                    return Response({'error': 'Недостаточно товара на складе'}, status=status.HTTP_400_BAD_REQUEST)
                
                cart_item, created = CartItem.objects.get_or_create(
                    cart=cart, 
                    product=product,
                    defaults={'quantity': quantity}
                )
                
                if not created:
                    cart_item.quantity += quantity
                    cart_item.save()
                
                cart.save()
                serializer = CartSerializer(cart)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Error in add_item: {e}")
            import traceback
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CartUpdateItemView(APIView):
    permission_classes = [IsAuthenticated]
    
    def put(self, request):
        """Обновить количество товара в корзине"""
        try:
            serializer = UpdateCartItemSerializer(data=request.data)
            if serializer.is_valid():
                item_id = serializer.validated_data['item_id']
                quantity = serializer.validated_data['quantity']
                
                try:
                    cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
                except CartItem.DoesNotExist:
                    return Response({'error': 'Элемент корзины не найден'}, status=status.HTTP_404_NOT_FOUND)
                
                if quantity <= 0:
                    cart_item.delete()
                else:
                    if cart_item.product.stock < quantity:
                        return Response({'error': 'Недостаточно товара на складе'}, status=status.HTTP_400_BAD_REQUEST)
                    
                    cart_item.quantity = quantity
                    cart_item.save()
                
                cart = cart_item.cart
                cart.save()
                
                serializer = CartSerializer(cart)
                return Response(serializer.data)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Error in update_item: {e}")
            import traceback
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CartRemoveItemView(APIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self, request):
        """Удалить товар из корзины"""
        try:
            item_id = request.data.get('item_id')
            if not item_id:
                return Response({'error': 'ID элемента корзины обязателен'}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
            except CartItem.DoesNotExist:
                return Response({'error': 'Элемент корзины не найден'}, status=status.HTTP_404_NOT_FOUND)
            
            cart = cart_item.cart
            cart_item.delete()
            cart.save()
            
            serializer = CartSerializer(cart)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error in remove_item: {e}")
            import traceback
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CartClearView(APIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self, request):
        """Очистить корзину"""
        try:
            cart = Cart.objects.get(user=request.user)
            cart.items.all().delete()
            cart.save()
            
            serializer = CartSerializer(cart)
            return Response(serializer.data)
        except Cart.DoesNotExist:
            return Response({'error': 'Корзина не найдена'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error in clear_cart: {e}")
            import traceback
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)

class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def toggle(self, request):
        """Добавить/убрать товар из избранного"""
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({'error': 'ID товара обязателен'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            product = Product.objects.get(id=product_id, is_available=True)
        except Product.DoesNotExist:
            return Response({'error': 'Товар не найден или недоступен'}, status=status.HTTP_404_NOT_FOUND)
        
        favorite, created = Favorite.objects.get_or_create(
            user=request.user,
            product=product
        )
        
        if not created:
            # Если товар уже в избранном, убираем его
            favorite.delete()
            return Response({'message': 'Товар убран из избранного', 'is_favorited': False})
        
        return Response({'message': 'Товар добавлен в избранное', 'is_favorited': True})
    
    @action(detail=False, methods=['get'])
    def count(self, request):
        """Получить количество избранных товаров"""
        count = Favorite.objects.filter(user=request.user).count()
        return Response({'count': count})


class OrderViewSet(viewsets.ModelViewSet):
    """ViewSet для заказов"""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    
    def create(self, request):
        """Создать заказ из корзины"""
        try:
            # Получаем корзину пользователя
            cart = Cart.objects.get(user=request.user)
            if not cart.items.exists():
                return Response({'error': 'Корзина пуста'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Валидируем данные заказа
            serializer = CreateOrderSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            # Создаем заказ
            order = Order.objects.create(
                user=request.user,
                total_price=cart.total_price,
                shipping_address=serializer.validated_data['shipping_address'],
                phone=serializer.validated_data['phone'],
                notes=serializer.validated_data.get('notes', '')
            )
            
            # Создаем элементы заказа
            for cart_item in cart.items.all():
                OrderItem.objects.create(
                    order=order,
                    product=cart_item.product,
                    quantity=cart_item.quantity,
                    price=cart_item.product.price
                )
            
            # Очищаем корзину
            cart.items.all().delete()
            cart.save()
            
            # Возвращаем созданный заказ
            order_serializer = OrderSerializer(order)
            return Response(order_serializer.data, status=status.HTTP_201_CREATED)
            
        except Cart.DoesNotExist:
            return Response({'error': 'Корзина не найдена'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error creating order: {e}")
            import traceback
            traceback.print_exc()
            return Response({'error': 'Ошибка создания заказа'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Обновить статус заказа (только для админов)"""
        if not request.user.is_staff:
            return Response({'error': 'Доступ запрещен'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            order = Order.objects.get(pk=pk)
            new_status = request.data.get('status')
            
            if new_status not in dict(Order.STATUS_CHOICES):
                return Response({'error': 'Неверный статус'}, status=status.HTTP_400_BAD_REQUEST)
            
            order.status = new_status
            order.save()
            
            serializer = OrderSerializer(order)
            return Response(serializer.data)
            
        except Order.DoesNotExist:
            return Response({'error': 'Заказ не найден'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


