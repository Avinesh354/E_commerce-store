from django.db import transaction
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from cart.models import Cart
from products.models import Product
from .models import Order, OrderItem, OrderStatusHistory
from .serializers import OrderSerializer


class OrderListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        orders = (
            Order.objects.filter(user=request.user)
            .prefetch_related("items", "history")
        )
        return Response(OrderSerializer(orders, many=True).data)

    def post(self, request):
        shipping_address = request.data.get("shipping_address", "").strip()
        if not shipping_address:
            return Response({"detail": "Shipping address is required."}, status=400)

        with transaction.atomic():
            cart = Cart.objects.filter(user=request.user).first()
            cart_items = list(cart.items.all()) if cart else []
            if not cart_items:
                return Response({"detail": "Your cart is empty."}, status=400)

            # Lock the product rows so two buyers can't take the last item
            product_ids = sorted(item.product_id for item in cart_items)
            products = {
                p.id: p
                for p in Product.objects.select_for_update()
                .filter(id__in=product_ids)
                .order_by("id")
            }

            total = 0
            for item in cart_items:
                product = products[item.product_id]
                if not product.is_active or item.quantity > product.stock:
                    return Response(
                        {"detail": f"Not enough stock for {product.name}. Only {product.stock} left."},
                        status=400,
                    )
                total += product.price * item.quantity

            order = Order.objects.create(
                user=request.user,
                total=total,
                shipping_address=shipping_address,
            )
            for item in cart_items:
                product = products[item.product_id]
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    name=product.name,
                    price=product.price,
                    quantity=item.quantity,
                )
                product.stock -= item.quantity
                product.save(update_fields=["stock"])

            OrderStatusHistory.objects.create(order=order, status=Order.Status.PENDING)
            cart.items.all().delete()

        return Response(OrderSerializer(order).data, status=201)


class OrderDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, order_id):
        order = (
            Order.objects.filter(pk=order_id, user=request.user)
            .prefetch_related("items", "history")
            .first()
        )
        if not order:
            return Response({"detail": "Order not found."}, status=404)
        return Response(OrderSerializer(order).data)


class CancelOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, order_id):
        with transaction.atomic():
            order = (
                Order.objects.select_for_update()
                .filter(pk=order_id, user=request.user)
                .first()
            )
            if not order:
                return Response({"detail": "Order not found."}, status=404)
            if order.status != Order.Status.PENDING:
                return Response({"detail": "Only pending orders can be cancelled."}, status=400)

            # Put the stock back
            for item in order.items.all():
                if item.product_id:
                    product = Product.objects.select_for_update().get(pk=item.product_id)
                    product.stock += item.quantity
                    product.save(update_fields=["stock"])

            order.status = Order.Status.CANCELLED
            order.save(update_fields=["status"])
            OrderStatusHistory.objects.create(order=order, status=Order.Status.CANCELLED)

        return Response(OrderSerializer(order).data)

class PayOrderView(APIView):
    """Mock payment: marks a pending order as paid (no real money)."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, order_id):
        with transaction.atomic():
            order = (
                Order.objects.select_for_update()
                .filter(pk=order_id, user=request.user)
                .first()
            )
            if not order:
                return Response({"detail": "Order not found."}, status=404)
            if order.status != Order.Status.PENDING:
                return Response({"detail": "Only pending orders can be paid."}, status=400)

            order.status = Order.Status.PAID
            order.save(update_fields=["status"])
            OrderStatusHistory.objects.create(order=order, status=Order.Status.PAID)

        return Response(OrderSerializer(order).data)