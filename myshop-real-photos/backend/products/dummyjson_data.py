"""Turns DummyJSON demo products into products for our shop.

No Django imports here, so it is easy to test.
"""

# DummyJSON prices are in US dollars. This is only an approximate demo conversion.
USD_TO_INR = 85

# DummyJSON category -> our category
CATEGORY_MAP = {
    "smartphones": "Mobiles & Accessories",
    "mobile-accessories": "Mobiles & Accessories",
    "tablets": "Mobiles & Accessories",
    "laptops": "Computers & Laptops",
    "mens-shirts": "Men's Fashion",
    "tops": "Women's Fashion",
    "womens-dresses": "Women's Fashion",
    "mens-shoes": "Footwear",
    "womens-shoes": "Footwear",
    "mens-watches": "Watches & Accessories",
    "womens-watches": "Watches & Accessories",
    "sunglasses": "Watches & Accessories",
    "womens-bags": "Watches & Accessories",
    "womens-jewellery": "Watches & Accessories",
    "kitchen-accessories": "Home & Kitchen",
    "furniture": "Furniture",
    "home-decoration": "Home Decor & Lighting",
    "beauty": "Beauty & Personal Care",
    "fragrances": "Beauty & Personal Care",
    "skin-care": "Beauty & Personal Care",
    "sports-accessories": "Sports & Fitness",
}


def to_item(raw):
    """Convert one DummyJSON product to our fields, or None if we have no category for it."""
    category = CATEGORY_MAP.get(raw.get("category"))
    if not category or not raw.get("title"):
        return None

    images = raw.get("images") or []
    image_url = raw.get("thumbnail") or (images[0] if images else "")
    price = int(round(float(raw.get("price", 0)) * USD_TO_INR / 10)) * 10 - 1

    return {
        "category": category,
        "name": raw["title"].strip()[:200],
        "description": (raw.get("description") or "").strip(),
        "price": max(49, price),
        "stock": max(0, min(int(raw.get("stock", 20)), 99)),
        "image_url": image_url,
    }
