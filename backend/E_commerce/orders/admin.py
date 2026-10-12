from django.contrib import admin
from .models import Order, OrderItem, OrderStatusHistory


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


class StatusHistoryInline(admin.TabularInline):
    model = OrderStatusHistory
    extra = 0
    can_delete = False
    readonly_fields = ("status", "created_at")

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "total", "status", "created_at")
    list_filter = ("status",)
    inlines = [OrderItemInline, StatusHistoryInline]

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if "status" in form.changed_data:
            OrderStatusHistory.objects.create(order=obj, status=obj.status)