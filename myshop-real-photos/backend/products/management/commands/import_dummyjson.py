import requests
from django.core.management.base import BaseCommand, CommandError

from products.dummyjson_data import to_item
from products.models import Category, Product

URL = "https://dummyjson.com/products?limit=0"


class Command(BaseCommand):
    help = "Add demo products with real product photos from DummyJSON"

    def handle(self, *args, **options):
        try:
            res = requests.get(URL, timeout=60)
            res.raise_for_status()
            products = res.json()["products"]
        except Exception as error:
            raise CommandError(f"Could not download products from DummyJSON: {error}")

        added = skipped = 0
        for raw in products:
            item = to_item(raw)
            if item is None:
                skipped += 1
                continue
            category, _ = Category.objects.get_or_create(name=item["category"])
            Product.objects.update_or_create(
                category=category,
                name=item["name"],
                defaults={
                    "description": item["description"],
                    "price": item["price"],
                    "stock": item["stock"],
                    "image_url": item["image_url"],
                    "is_active": True,
                },
            )
            added += 1

        self.stdout.write(self.style.SUCCESS(
            f"{added} products with real photos added, {skipped} skipped (no matching category)"
        ))
