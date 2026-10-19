"""Demo catalog: 15 categories x 11 product lines x 4 variants = 660 products.

This file has no Django imports, so both seed_products and fetch_images can use it.
Each line is (name, base price in rupees). Variants change the name and the price a little.
"""
import re

# Price multiplier for each of the 4 variants
FACTORS = (1.00, 1.12, 1.25, 0.88)

CATALOG = [
    {
        "name": "Mobiles & Accessories",
        "brands": ["Nexo", "Vyra", "Orbit", "Kalix"],
        "variants": ["Black", "Blue", "Pro", "Lite"],
        "lines": [
            ("Smartphone", 17999), ("5G Smartphone", 26999), ("Phone Case", 399),
            ("Tempered Glass", 249), ("Fast Charger", 899), ("Power Bank", 1499),
            ("USB Cable", 299), ("Phone Stand", 349), ("Selfie Stick", 599),
            ("Wireless Earphones", 1299), ("Memory Card", 549),
        ],
    },
    {
        "name": "Electronics",
        "brands": ["Sonic", "Auralux", "Voltix", "Zenix"],
        "variants": ["Pro", "Lite", "Max", "Plus"],
        "lines": [
            ("Wireless Headphones", 2499), ("Bluetooth Speaker", 1799), ("Smart Watch", 3999),
            ("Soundbar", 6999), ("Smart TV", 24999), ("Action Camera", 5999),
            ("Home Theatre", 9999), ("Fitness Band", 1799), ("Digital Camera", 28999),
            ("Projector", 11999), ("Streaming Stick", 3299),
        ],
    },
    {
        "name": "Computers & Laptops",
        "brands": ["Lumo", "Techra", "Corex", "Pixelon"],
        "variants": ["Silver", "Black", "Pro", "Lite"],
        "lines": [
            ("Laptop", 45999), ("Gaming Laptop", 74999), ("Desktop Monitor", 8999),
            ("Mechanical Keyboard", 3299), ("Wireless Mouse", 799), ("Laptop Bag", 1299),
            ("Webcam", 1899), ("External Hard Drive", 4999), ("Pen Drive", 599),
            ("WiFi Router", 1999), ("Laptop Stand", 999),
        ],
    },
    {
        "name": "Men's Fashion",
        "brands": ["Urbano", "Kasual", "Dapper", "Nord"],
        "variants": ["Black", "Navy", "Olive", "Grey"],
        "lines": [
            ("T-Shirt", 499), ("Casual Shirt", 899), ("Slim Fit Jeans", 1299),
            ("Hoodie", 1499), ("Formal Trousers", 1199), ("Jacket", 2499),
            ("Track Pants", 799), ("Polo T-Shirt", 699), ("Kurta", 999),
            ("Shorts", 599), ("Blazer", 3999),
        ],
    },
    {
        "name": "Women's Fashion",
        "brands": ["Aarna", "Zoya", "Mira", "Nysa"],
        "variants": ["Red", "Blue", "Green", "Pink"],
        "lines": [
            ("Kurti", 799), ("Saree", 1799), ("Palazzo Pants", 699),
            ("Top", 549), ("Dress", 1599), ("Leggings", 449),
            ("Dupatta", 399), ("Handbag", 1299), ("Cardigan", 1399),
            ("Skirt", 899), ("Lehenga", 4999),
        ],
    },
    {
        "name": "Footwear",
        "brands": ["Stridex", "Walkon", "Pacer", "Soleil"],
        "variants": ["Black", "White", "Brown", "Blue"],
        "lines": [
            ("Running Shoes", 2499), ("Sneakers", 1899), ("Formal Shoes", 2299),
            ("Sandals", 799), ("Flip Flops", 299), ("Sports Shoes", 2799),
            ("Loafers", 1799), ("Boots", 3299), ("Slippers", 399),
            ("Heels", 1599), ("School Shoes", 999),
        ],
    },
    {
        "name": "Watches & Accessories",
        "brands": ["Chronix", "Aurel", "Tempo", "Zephyr"],
        "variants": ["Black", "Silver", "Gold", "Blue"],
        "lines": [
            ("Analog Watch", 1999), ("Digital Watch", 1299), ("Sunglasses", 899),
            ("Leather Wallet", 799), ("Leather Belt", 599), ("Backpack", 1599),
            ("Duffel Bag", 2199), ("Baseball Cap", 349), ("Silver Bracelet", 1499),
            ("Pendant Necklace", 1299), ("Perfume", 999),
        ],
    },
    {
        "name": "Home & Kitchen",
        "brands": ["Cookwell", "Hearth", "Kitchenix", "Purelle"],
        "variants": ["Classic", "Premium", "Deluxe", "Compact"],
        "lines": [
            ("Non-Stick Frying Pan", 899), ("Electric Kettle", 1199), ("Mixer Grinder", 3299),
            ("Pressure Cooker", 1899), ("Dinner Set", 2799), ("Knife Set", 999),
            ("Water Bottle", 449), ("Lunch Box", 549), ("Food Storage Containers", 749),
            ("Air Fryer", 5499), ("Toaster", 1599),
        ],
    },
    {
        "name": "Furniture",
        "brands": ["Woodcraft", "Oakline", "Nestly", "Urbane"],
        "variants": ["Walnut", "Oak", "White", "Black"],
        "lines": [
            ("Study Table", 5500), ("Office Chair", 7999), ("Sofa", 24999),
            ("Queen Bed", 18999), ("Bookshelf", 4299), ("Dining Table", 15999),
            ("TV Unit", 6999), ("Shoe Rack", 1799), ("Wardrobe", 14999),
            ("Coffee Table", 3499), ("Bean Bag", 1999),
        ],
    },
    {
        "name": "Home Decor & Lighting",
        "brands": ["Lumina", "Decora", "Casa", "Glow"],
        "variants": ["Gold", "Silver", "White", "Black"],
        "lines": [
            ("Table Lamp", 649), ("Wall Clock", 899), ("Photo Frame", 399),
            ("Wall Art", 1299), ("Curtains", 1499), ("Cushion Covers", 599),
            ("Bedsheet", 1099), ("Scented Candles", 499), ("LED String Lights", 349),
            ("Flower Vase", 699), ("Wall Mirror", 1799),
        ],
    },
    {
        "name": "Appliances",
        "brands": ["Aerolux", "Breezo", "Frostine", "Whirlix"],
        "variants": ["Classic", "Plus", "Pro", "Max"],
        "lines": [
            ("Refrigerator", 24999), ("Washing Machine", 21999), ("Air Conditioner", 34999),
            ("Microwave Oven", 8999), ("Ceiling Fan", 2499), ("Water Purifier", 10999),
            ("Vacuum Cleaner", 6999), ("Steam Iron", 1299), ("Water Heater", 5999),
            ("Air Cooler", 7999), ("Induction Cooktop", 2299),
        ],
    },
    {
        "name": "Beauty & Personal Care",
        "brands": ["Glowly", "Veda", "Aquaa", "Pureskin"],
        "variants": ["Classic", "Natural", "Intense", "Fresh"],
        "lines": [
            ("Face Wash", 249), ("Moisturizer", 399), ("Sunscreen", 449),
            ("Shampoo", 349), ("Hair Oil", 299), ("Lipstick", 499),
            ("Perfume Spray", 799), ("Beard Trimmer", 1299), ("Hair Dryer", 1199),
            ("Face Serum", 699), ("Body Lotion", 349),
        ],
    },
    {
        "name": "Sports & Fitness",
        "brands": ["Fitron", "Proflex", "Velocity", "Titan"],
        "variants": ["Black", "Blue", "Red", "Green"],
        "lines": [
            ("Yoga Mat", 699), ("Dumbbell Set", 2499), ("Treadmill", 24999),
            ("Cricket Bat", 1899), ("Football", 799), ("Badminton Racket", 1299),
            ("Skipping Rope", 249), ("Resistance Bands", 499), ("Gym Gloves", 399),
            ("Bicycle", 9999), ("Protein Shaker", 349),
        ],
    },
    {
        "name": "Books",
        "brands": [],
        "variants": ["for Beginners", "Made Simple", "Complete Guide", "Handbook"],
        "query_hint": "book",
        "lines": [
            ("Python Programming", 599), ("JavaScript", 549), ("Data Structures and Algorithms", 699),
            ("Machine Learning", 799), ("Web Development", 649), ("Personal Finance", 399),
            ("Self Improvement", 349), ("Business Strategy", 499), ("Indian History", 449),
            ("Science Fiction Stories", 299), ("Cooking", 399),
        ],
    },
    {
        "name": "Toys & Games",
        "brands": ["Funzo", "Playfield", "Kiddo", "Brainy"],
        "variants": ["Red", "Blue", "Green", "Yellow"],
        "lines": [
            ("Building Blocks", 899), ("Remote Control Car", 1499), ("Board Game", 699),
            ("Jigsaw Puzzle", 399), ("Teddy Bear", 599), ("Doll House", 1999),
            ("Art and Craft Kit", 499), ("Chess Set", 799), ("Toy Train Set", 1799),
            ("Water Gun", 249), ("Kids Cycle", 4999),
        ],
    },
]


def slug(name):
    """File name used for a product picture, e.g. 'nexo-smartphone-black'."""
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def iter_products():
    """Yield one dict for every product in the catalog."""
    count = 0
    for category in CATALOG:
        brands = category["brands"]
        for line_no, (line, base) in enumerate(category["lines"]):
            for variant_no, variant in enumerate(category["variants"]):
                count += 1
                brand = brands[(line_no + variant_no) % len(brands)] if brands else ""
                name = " ".join(part for part in (brand, line, variant) if part)
                price = max(99, int(round(base * FACTORS[variant_no] / 10)) * 10 - 1)
                stock = 3 if count % 17 == 0 else 6 + (line_no * 13 + variant_no * 7) % 35
                yield {
                    "category": category["name"],
                    "line": line,
                    "line_no": line_no,
                    "variant_no": variant_no,
                    "query_hint": category.get("query_hint", ""),
                    "name": name,
                    "slug": slug(name),
                    "price": price,
                    "stock": stock,
                }
