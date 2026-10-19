from django.core.management.base import BaseCommand

from products.catalog_data import CATALOG, iter_products
from products.models import Category, Product


class Command(BaseCommand):
    help = "Create the demo catalog: 15 categories with 44 products each"

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete ALL products and categories first, then create the demo catalog",
        )

    def handle(self, *args, **options):
        if options["reset"]:
            Product.objects.all().delete()
            Category.objects.all().delete()
            self.stdout.write("Old products and categories deleted.")

        categories = {}
        for data in CATALOG:
            categories[data["name"]], _ = Category.objects.get_or_create(name=data["name"])

        total = 0
        for item in iter_products():
            Product.objects.update_or_create(
                category=categories[item["category"]],
                name=item["name"],
                defaults={
                    "description": f"{item['name']} from our {item['category']} collection.",
                    "price": item["price"],
                    "stock": item["stock"],
                    "image_url": f"/images/{item['slug']}.jpg",
                    "is_active": True,
                },
            )
            total += 1

        self.stdout.write(self.style.SUCCESS(f"{total} products ready in {len(categories)} categories"))
