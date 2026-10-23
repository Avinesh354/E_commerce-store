"""Saves the live shop's products to frontend/public/catalog.json.

Run it from this folder (the one with manage.py):

    python export_catalog.py

The website reads that file, so product pages open instantly even when the free server is
asleep. Run it again, then rebuild the website, whenever you change the products.
"""
import json
import sys
import time
from pathlib import Path

import requests

API = (sys.argv[1] if len(sys.argv) > 1 else "https://e-commerce-api-sn0a.onrender.com/api").rstrip("/")
OUT = Path(__file__).resolve().parent.parent.parent / "frontend" / "public" / "catalog.json"


def get(url):
    for _ in range(3):
        try:
            res = requests.get(url, timeout=120)  # the first call can take a minute while the server wakes up
            res.raise_for_status()
            return res.json()
        except requests.RequestException as error:
            print(f"  could not read {url}: {error}. Trying again...")
            time.sleep(5)
    raise SystemExit("Could not reach the server. Open the API address in a browser, wait until it loads, then run this again.")


def main():
    print(f"Reading products from {API} (the first call can take up to a minute)...")
    categories = get(f"{API}/categories/")

    products = []
    url = f"{API}/products/"
    while url:
        data = get(url)
        for p in data["results"]:
            products.append({
                "id": p["id"],
                "name": p["name"],
                "description": p["description"],
                "price": float(p["price"]),
                "stock": p["stock"],
                "image_url": p["image_url"],
                "category": p["category"],
                "category_name": p["category_name"],
            })
        print(f"  {len(products)} of {data['count']} products")
        url = data["next"]

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps({"categories": categories, "products": products}, separators=(",", ":"), ensure_ascii=False),
        encoding="utf-8",
    )
    print(f"Saved {len(products)} products in {len(categories)} categories to {OUT}")


if __name__ == "__main__":
    main()
