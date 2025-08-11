from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, ProductViewSet, CartItemViewSet, FavoriteViewSet,
    CartViewSet, CartAddItemView, CartUpdateItemView, CartRemoveItemView, CartClearView
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'cart-items', CartItemViewSet, basename='cart-item')
router.register(r'favorites', FavoriteViewSet, basename='favorite')

urlpatterns = [
    path('', include(router.urls)),
    # Cart endpoints
    path('cart/', CartViewSet.as_view(), name='cart'),
    path('cart/add_item/', CartAddItemView.as_view(), name='cart-add-item'),
    path('cart/update_item/', CartUpdateItemView.as_view(), name='cart-update-item'),
    path('cart/remove_item/', CartRemoveItemView.as_view(), name='cart-remove-item'),
    path('cart/clear_cart/', CartClearView.as_view(), name='cart-clear'),
]