from rest_framework import serializers
from .models import Category, Product, Cart, CartItem, Favorite
from users.serializers import UserSerializer


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
    is_favorited = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'slug', 'category', 'price', 'stock', 'image', 'is_available', 'is_featured', 'created_at', 'updated_at', 'is_favorited']
    
    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Favorite.objects.filter(user=request.user, product=obj).exists()
        return False


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
