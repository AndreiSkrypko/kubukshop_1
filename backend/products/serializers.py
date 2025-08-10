from rest_framework import serializers
from .models import Category, Product, Cart, CartItem


class CategorySerializer(serializers.ModelSerializer):
    """Сериализатор для списка категорий"""
    products_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'slug', 'image', 'products_count']
    
    def get_products_count(self, obj):
        return obj.products.filter(is_available=True).count()


class CategoryDetailSerializer(serializers.ModelSerializer):
    """Сериализатор для детальной информации о категории"""
    products_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'slug', 'image', 'products_count', 'created_at', 'updated_at']
    
    def get_products_count(self, obj):
        return obj.products.filter(is_available=True).count()


class ProductSerializer(serializers.ModelSerializer):
    """Базовый сериализатор для товаров"""
    category = CategorySerializer(read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'slug', 'category', 'price', 'stock', 'image', 'is_available', 'is_featured', 'created_at', 'updated_at']


class ProductListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка товаров"""
    category = CategorySerializer(read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'slug', 'category', 'price', 'stock', 'image', 'is_available', 'is_featured']


class ProductDetailSerializer(serializers.ModelSerializer):
    """Сериализатор для детальной информации о товаре"""
    category = CategorySerializer(read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'slug', 'category', 'price', 'stock', 'image', 'is_available', 'is_featured', 'created_at', 'updated_at']


class CartItemSerializer(serializers.ModelSerializer):
    """Сериализатор для элементов корзины"""
    product = ProductListSerializer(read_only=True)
    total_price = serializers.ReadOnlyField()
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'total_price', 'added_at']


class CartSerializer(serializers.ModelSerializer):
    """Сериализатор для корзины"""
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.ReadOnlyField()
    total_items = serializers.ReadOnlyField()
    
    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_price', 'total_items', 'created_at', 'updated_at']


class AddToCartSerializer(serializers.Serializer):
    """Сериализатор для добавления товара в корзину"""
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)


class UpdateCartItemSerializer(serializers.Serializer):
    """Сериализатор для обновления количества товара в корзине"""
    quantity = serializers.IntegerField(min_value=1)
