from django.urls import path
from .views import CartView, AddToCartView, CartItemView

urlpatterns = [
    path("cart/", CartView.as_view()),
    path("cart/add/", AddToCartView.as_view()),
    path("cart/items/<int:item_id>/", CartItemView.as_view()),
]