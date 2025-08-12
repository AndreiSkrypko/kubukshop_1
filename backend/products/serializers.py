from rest_framework import serializers
from .models import Category, Product, Cart, CartItem, Favorite, Order, OrderItem
from users.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    """Сериализатор для списка категорий"""
    products_count = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'slug', 'image', 'products_count']
    
    def get_products_count(self, obj):
        return obj.products.filter(is_available=True).count()
    
    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                # Используем build_absolute_uri для получения полного URL
                return request.build_absolute_uri(obj.image.url)
            # Если нет request, возвращаем относительный URL
            return obj.image.url
        return None


class CategoryDetailSerializer(serializers.ModelSerializer):
    """Сериализатор для детальной информации о категории"""
    products_count = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'slug', 'image', 'products_count', 'created_at', 'updated_at']
    
    def get_products_count(self, obj):
        return obj.products.filter(is_available=True).count()
    
    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class ProductSerializer(serializers.ModelSerializer):
    """Базовый сериализатор для товаров"""
    category = CategorySerializer(read_only=True)
    is_favorited = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'slug', 'category', 'price', 'stock', 'image', 'is_available', 'is_featured', 'created_at', 'updated_at', 'is_favorited']
    
    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Favorite.objects.filter(user=request.user, product=obj).exists()
        return False
    
    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class ProductListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка товаров"""
    category = CategorySerializer(read_only=True)
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'slug', 'category', 'price', 'stock', 'image', 'is_available', 'is_featured']
    
    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    """Сериализатор для детальной информации о товаре"""
    category = CategorySerializer(read_only=True)
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'slug', 'category', 'price', 'stock', 'image', 'is_available', 'is_featured', 'created_at', 'updated_at']
    
    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class CartItemSerializer(serializers.ModelSerializer):
    """Сериализатор для элементов корзины"""
    product = ProductSerializer(read_only=True)
    total_price = serializers.SerializerMethodField()
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'total_price', 'added_at']
    
    def get_total_price(self, obj):
        return obj.total_price


class CartSerializer(serializers.ModelSerializer):
    """Сериализатор для корзины"""
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()
    total_items = serializers.SerializerMethodField()
    
    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_price', 'total_items', 'created_at', 'updated_at']
    
    def get_total_price(self, obj):
        return obj.total_price
    
    def get_total_items(self, obj):
        return obj.total_items


class AddToCartSerializer(serializers.Serializer):
    """Сериализатор для добавления товара в корзину"""
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)


class UpdateCartItemSerializer(serializers.Serializer):
    """Сериализатор для обновления элемента корзины"""
    item_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class FavoriteSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    
    class Meta:
        model = Favorite
        fields = ['id', 'product', 'created_at']


class OrderItemSerializer(serializers.ModelSerializer):
    """Сериализатор для элементов заказа"""
    product = ProductSerializer(read_only=True)
    total_price = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price', 'total_price']
    
    def get_total_price(self, obj):
        return obj.total_price


class OrderSerializer(serializers.ModelSerializer):
    """Сериализатор для заказа"""
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'status', 'status_display', 'total_price', 'shipping_address', 'phone', 'notes', 'items', 'created_at', 'updated_at']


class CreateOrderSerializer(serializers.Serializer):
    """Сериализатор для создания заказа"""
    shipping_address = serializers.CharField(required=True)
    phone = serializers.CharField(required=True)
    notes = serializers.CharField(required=False, allow_blank=True)
