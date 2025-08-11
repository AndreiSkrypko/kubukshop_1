from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from decimal import Decimal
from users.models import CustomUser


class Category(models.Model):
    """Модель категории товаров"""
    name = models.CharField(max_length=100, verbose_name="Название")
    description = models.TextField(blank=True, verbose_name="Описание")
    slug = models.SlugField(unique=True, verbose_name="URL")
    image = models.ImageField(upload_to='categories/', blank=True, null=True, verbose_name="Изображение")
    is_active = models.BooleanField(default=True, verbose_name="Активна")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"
        ordering = ['name']

    def __str__(self):
        return self.name


class Product(models.Model):
    """Модель товара"""
    name = models.CharField(max_length=200, verbose_name="Название")
    description = models.TextField(verbose_name="Описание")
    slug = models.SlugField(unique=True, verbose_name="URL")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products', verbose_name="Категория")
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))], verbose_name="Цена")
    stock = models.PositiveIntegerField(default=0, verbose_name="Остаток на складе")
    image = models.ImageField(upload_to='products/', blank=True, null=True, verbose_name="Изображение")
    is_available = models.BooleanField(default=True, verbose_name="Доступен")
    is_featured = models.BooleanField(default=False, verbose_name="Рекомендуемый")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        verbose_name = "Товар"
        verbose_name_plural = "Товары"
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class Cart(models.Model):
    """Модель корзины покупок"""
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='carts', verbose_name="Пользователь")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        verbose_name = "Корзина"
        verbose_name_plural = "Корзины"
        ordering = ['-created_at']

    def __str__(self):
        return f"Корзина пользователя {self.user.username}"

    @property
    def total_price(self):
        """Общая стоимость корзины"""
        return sum(item.total_price for item in self.items.all())

    @property
    def total_items(self):
        """Общее количество товаров в корзине"""
        return sum(item.quantity for item in self.items.all())


class CartItem(models.Model):
    """Модель элемента корзины"""
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items', verbose_name="Корзина")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, verbose_name="Товар")
    quantity = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)], verbose_name="Количество")
    added_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата добавления")

    class Meta:
        verbose_name = "Элемент корзины"
        verbose_name_plural = "Элементы корзины"
        unique_together = ['cart', 'product']
        ordering = ['-added_at']

    def __str__(self):
        return f"{self.quantity}x {self.product.name} в корзине {self.cart.user.username}"

    @property
    def total_price(self):
        """Общая стоимость элемента корзины"""
        return self.product.price * self.quantity


class Favorite(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='favorites')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Избранное"
        verbose_name_plural = "Избранное"
        unique_together = ['user', 'product']  # Пользователь может добавить товар в избранное только один раз

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"


class Order(models.Model):
    """Модель заказа"""
    STATUS_CHOICES = [
        ('оформлен', 'Оформлен'),
        ('оплачен', 'Оплачен'),
        ('отправлен', 'Отправлен'),
    ]
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='orders', verbose_name="Пользователь")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='оформлен', verbose_name="Статус заказа")
    total_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Общая стоимость")
    shipping_address = models.TextField(blank=True, verbose_name="Адрес доставки")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Телефон")
    notes = models.TextField(blank=True, verbose_name="Примечания к заказу")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"
        ordering = ['-created_at']

    def __str__(self):
        return f"Заказ #{self.id} - {self.user.username} ({self.get_status_display()})"


class OrderItem(models.Model):
    """Модель элемента заказа"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items', verbose_name="Заказ")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, verbose_name="Товар")
    quantity = models.PositiveIntegerField(default=1, verbose_name="Количество")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Цена за единицу")
    
    class Meta:
        verbose_name = "Элемент заказа"
        verbose_name_plural = "Элементы заказа"
        ordering = ['id']

    def __str__(self):
        return f"{self.quantity}x {self.product.name} в заказе #{self.order.id}"

    @property
    def total_price(self):
        """Общая стоимость элемента заказа"""
        return self.price * self.quantity
