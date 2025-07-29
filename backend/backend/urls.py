from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('products.urls')),
    path('auth/', include('djoser.urls')),       # регистрация, активация и др.
    path('auth/', include('djoser.urls.jwt')),   # JWT login/logout
]
