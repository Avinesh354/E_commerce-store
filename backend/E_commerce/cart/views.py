from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from products.models import Product
from .models import Cart, CartItem
from .serializers import CartSerializer


def get_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart


def cart_response(request, cart, status=200):
    return Response(CartSerializer(cart, context={"request": request}).data, status=status)


class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return cart_response(request, get_cart(request.user))


class AddToCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            product = Product.objects.get(pk=request.data.get("product_id"), is_active=True)
            quantity = int(request.data.get("quantity", 1))
        except (Product.DoesNotExist, ValueError, TypeError):
            return Response({"detail": "Invalid product or quantity."}, status=400)

        if quantity < 1:
            return Response({"detail": "Quantity must be at least 1."}, status=400)

        cart = get_cart(request.user)
        item, created = CartItem.objects.get_or_create(
            cart=cart, product=product, defaults={"quantity": 0}
        )
        new_quantity = item.quantity + quantity

        if new_quantity > product.stock:
            if created:
                item.delete()
            return Response({"detail": f"Only {product.stock} in stock."}, status=400)

        item.quantity = new_quantity
        item.save()
        return cart_response(request, cart, status=201)


class CartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_item(self, request, item_id):
        return (
            CartItem.objects.filter(pk=item_id, cart__user=request.user)
            .select_related("product")
            .first()
        )

    def patch(self, request, item_id):
        item = self.get_item(request, item_id)
        if not item:
            return Response({"detail": "Item not found."}, status=404)

        try:
            quantity = int(request.data.get("quantity"))
        except (ValueError, TypeError):
            return Response({"detail": "Invalid quantity."}, status=400)

        if quantity < 1:
            return Response({"detail": "Quantity must be at least 1."}, status=400)
        if quantity > item.product.stock:
            return Response({"detail": f"Only {item.product.stock} in stock."}, status=400)

        item.quantity = quantity
        item.save()
        return cart_response(request, item.cart)

    def delete(self, request, item_id):
        item = self.get_item(request, item_id)
        if not item:
            return Response({"detail": "Item not found."}, status=404)
        cart = item.cart
        item.delete()
        return cart_response(request, cart)