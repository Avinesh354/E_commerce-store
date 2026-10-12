from rest_framework import serializers
from .models import Order, OrderItem, OrderStatusHistory


class OrderItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ["id", "product", "name", "price", "quantity", "subtotal"]

    def get_subtotal(self, obj):
        return obj.price * obj.quantity


class StatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderStatusHistory
        fields = ["status", "created_at"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    history = StatusHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "total", "status", "shipping_address",
            "items", "history", "created_at",
        ]