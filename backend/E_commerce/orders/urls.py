from django.urls import path
from .views import OrderListCreateView, OrderDetailView, CancelOrderView, PayOrderView

urlpatterns = [
    path("orders/", OrderListCreateView.as_view()),
    path("orders/<int:order_id>/", OrderDetailView.as_view()),
    path("orders/<int:order_id>/cancel/", CancelOrderView.as_view()),
    path("orders/<int:order_id>/pay/", PayOrderView.as_view()),
]