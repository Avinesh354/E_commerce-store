import io
import time
from pathlib import Path

import requests
from decouple import config
from django.conf import settings
from django.core.management.base import BaseCommand
from PIL import Image

from products.catalog_data import CATALOG, iter_products

IMAGES_DIR = Path(settings.BASE_DIR).parent.parent / "frontend" / "public" / "images"
HINTS = {c["name"]: c.get("query_hint", "") for c in CATALOG}


def search_photos(key, query):
    """Return up to 20 photo results from Pixabay for a search word."""
    params = {
        "key": key,
        "q": query,
        "image_type": "photo",
        "orientation": "horizontal",
        "per_page": 20,
        "safesearch": "true",
    }
    for attempt in range(2):
        res = requests.get("https://pixabay.com/api/", params=params, timeout=20)
        if res.status_code == 429 and attempt == 0:
            time.sleep(62)  # Pixabay allows 100 searches per minute
            continue
        return res.json().get("hits", []) if res.ok else []
    return []


def save_photo(url, path):
    """Download a photo, shrink it to a small JPEG and save it."""
    res = requests.get(url, timeout=30)
    res.raise_for_status()
    image = Image.open(io.BytesIO(res.content)).convert("RGB")
    image.thumbnail((480, 360))
    image.save(path, "JPEG", quality=75, optimize=True)


class Command(BaseCommand):
    help = "Download a matching photo from Pixabay for every product"

    def add_arguments(self, parser):
        parser.add_argument("--force", action="store_true", help="Download again even if the picture exists")

    def handle(self, *args, **options):
        key = config("PIXABAY_API_KEY")
        IMAGES_DIR.mkdir(parents=True, exist_ok=True)

        # Group the products by line, so one search serves all 4 variants of a line
        lines = {}
        for item in iter_products():
            lines.setdefault((item["category"], item["line"]), []).append(item)

        saved = skipped = missing = 0
        for (category, line), items in lines.items():
            todo = [i for i in items if options["force"] or not (IMAGES_DIR / f"{i['slug']}.jpg").exists()]
            skipped += len(items) - len(todo)
            if not todo:
                continue

            query = f"{line} {HINTS[category]}".strip()
            hits = search_photos(key, query)
            time.sleep(0.7)
            if not hits:
                missing += len(todo)
                self.stdout.write(self.style.WARNING(f"No photo found for: {query}"))
                continue

            for item in todo:
                hit = hits[item["variant_no"] % len(hits)]
                try:
                    save_photo(hit["webformatURL"], IMAGES_DIR / f"{item['slug']}.jpg")
                    saved += 1
                except Exception as error:  # keep going if one download fails
                    missing += 1
                    self.stdout.write(self.style.WARNING(f"Could not save {item['name']}: {error}"))
            self.stdout.write(f"{category}: {line} ({len(todo)} pictures)")

        self.stdout.write(self.style.SUCCESS(
            f"Done. Saved {saved}, already had {skipped}, missing {missing}. "
            "Run the command again to retry any that are missing."
        ))
