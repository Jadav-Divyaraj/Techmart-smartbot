"""
TechMart AI - Database Seeder
Seeds the SQLite database with sample products and orders
Run: python seed_db.py
"""

import sqlite3
import json
import datetime

PRODUCTS = [
    # CPUs
    ('AMD Ryzen 5 5600X', 'cpu', 'AMD', 14999, 19999, '{"Cores":"6C/12T","Speed":"3.7GHz","TDP":"65W","Socket":"AM4"}', 'In Stock', 4.7, 2341, 'hot', '💻'),
    ('Intel Core i5-13600K', 'cpu', 'Intel', 21999, 27999, '{"Cores":"14C/20T","Speed":"5.1GHz Boost","TDP":"125W","Socket":"LGA1700"}', 'In Stock', 4.8, 1876, 'best', '💻'),
    ('AMD Ryzen 7 7700X', 'cpu', 'AMD', 29999, 36999, '{"Cores":"8C/16T","Speed":"5.4GHz Boost","TDP":"105W","Socket":"AM5"}', 'In Stock', 4.9, 987, 'new', '💻'),
    ('Intel Core i9-13900K', 'cpu', 'Intel', 54999, 64999, '{"Cores":"24C/32T","Speed":"5.8GHz Boost","TDP":"125W","Socket":"LGA1700"}', 'Low Stock', 4.9, 652, 'best', '💻'),
    
    # GPUs
    ('NVIDIA RTX 4060', 'gpu', 'NVIDIA', 29999, 34999, '{"VRAM":"8GB GDDR6","Cores":"3072 CUDA","TDP":"115W","Interface":"PCIe 4.0"}', 'In Stock', 4.7, 3241, 'hot', '🖥️'),
    ('NVIDIA RTX 4070 Super', 'gpu', 'NVIDIA', 49999, 57999, '{"VRAM":"12GB GDDR6X","Cores":"7168 CUDA","TDP":"220W","Interface":"PCIe 4.0"}', 'In Stock', 4.9, 1876, 'best', '🖥️'),
    ('AMD Radeon RX 7600', 'gpu', 'AMD', 24999, 29999, '{"VRAM":"8GB GDDR6","Cores":"2048 SPs","TDP":"165W","Interface":"PCIe 4.0"}', 'In Stock', 4.5, 1243, 'sale', '🖥️'),
    ('NVIDIA RTX 5060 Ti', 'gpu', 'NVIDIA', 42999, 49999, '{"VRAM":"16GB GDDR7","Cores":"4608 CUDA","TDP":"180W","Interface":"PCIe 5.0"}', 'In Stock', 4.8, 876, 'new', '🖥️'),

    # RAM
    ('Corsair Vengeance DDR5 32GB', 'ram', 'Corsair', 8999, 11999, '{"Capacity":"32GB","Speed":"DDR5-5600","Latency":"CL36","Type":"DDR5"}', 'In Stock', 4.8, 2341, 'hot', '🔋'),
    ('Kingston Fury Beast DDR4 16GB', 'ram', 'Kingston', 3499, 4999, '{"Capacity":"16GB","Speed":"DDR4-3200","Latency":"CL16","Type":"DDR4"}', 'In Stock', 4.6, 3241, 'best', '🔋'),

    # SSDs
    ('Samsung 870 EVO 500GB', 'ssd', 'Samsung', 3999, 5499, '{"Capacity":"500GB","Type":"SATA SSD","Read":"560 MB/s","Write":"530 MB/s"}', 'In Stock', 4.8, 5672, 'best', '💾'),
    ('WD Black SN770 1TB NVMe', 'ssd', 'WD', 5499, 7999, '{"Capacity":"1TB","Type":"NVMe","Read":"5150 MB/s","Write":"4900 MB/s"}', 'In Stock', 4.9, 3241, 'hot', '💾'),
    ('Samsung 990 Pro 2TB NVMe', 'ssd', 'Samsung', 11999, 14999, '{"Capacity":"2TB","Type":"NVMe","Read":"7450 MB/s","Write":"6900 MB/s"}', 'In Stock', 4.9, 1432, 'new', '💾'),
    ('Kingston A400 240GB SATA', 'ssd', 'Kingston', 1999, 2999, '{"Capacity":"240GB","Type":"SATA","Read":"500 MB/s","Write":"350 MB/s"}', 'In Stock', 4.4, 8765, 'sale', '💾'),

    # Motherboards
    ('ASUS ROG Strix B650E-F', 'motherboard', 'ASUS', 24999, 29999, '{"Socket":"AM5","Chipset":"B650E","RAM":"DDR5","PCIe":"5.0","Form":"ATX"}', 'In Stock', 4.8, 876, 'best', '🔌'),
    ('MSI MAG B660M Mortar WiFi', 'motherboard', 'MSI', 13999, 17999, '{"Socket":"LGA1700","Chipset":"B660M","RAM":"DDR4","PCIe":"4.0","Form":"mATX"}', 'In Stock', 4.7, 1243, 'hot', '🔌'),

    # Monitors
    ('LG 27GP850-B 27" QHD 165Hz', 'monitor', 'LG', 26999, 33999, '{"Size":"27 inch","Resolution":"2560x1440","Panel":"IPS","RefreshRate":"165Hz"}', 'In Stock', 4.9, 2341, 'best', '🖥️'),
    ('Samsung Odyssey G5 32" WQHD', 'monitor', 'Samsung', 22999, 28999, '{"Size":"32 inch","Resolution":"2560x1440","Panel":"VA","RefreshRate":"144Hz"}', 'In Stock', 4.7, 1876, 'hot', '🖥️'),

    # Keyboards
    ('Corsair K70 RGB Mechanical', 'keyboard', 'Corsair', 8999, 11999, '{"Type":"Mechanical","Switch":"Cherry MX Red","Backlight":"RGB","Layout":"Full"}', 'In Stock', 4.8, 4532, 'best', '⌨️'),
    ('Logitech G Pro X TKL', 'keyboard', 'Logitech', 7499, 9999, '{"Type":"Mechanical","Switch":"GX Red","Backlight":"RGB","Layout":"TKL"}', 'In Stock', 4.7, 3241, 'hot', '⌨️'),
    ('Keychron K2 Hot-Swap', 'keyboard', 'Keychron', 5499, 6999, '{"Type":"Mechanical","Switch":"Gateron Red","Backlight":"RGB","Layout":"75%"}', 'In Stock', 4.9, 2341, 'new', '⌨️'),

    # Mice
    ('Logitech G Pro X Superlight 2', 'mouse', 'Logitech', 10999, 13999, '{"DPI":"100-32000","Weight":"60g","Sensor":"HERO 2","Buttons":"5","Connection":"Wireless"}', 'In Stock', 4.9, 5432, 'best', '🖱️'),
    ('Razer DeathAdder V3', 'mouse', 'Razer', 5999, 7999, '{"DPI":"100-26000","Weight":"75g","Sensor":"Focus Pro 30K","Connection":"Wireless"}', 'In Stock', 4.8, 3241, 'hot', '🖱️'),

    # Laptops
    ('ASUS ROG Strix G15 (Ryzen 9)', 'laptop', 'ASUS', 89999, 109999, '{"CPU":"Ryzen 9 7945HX","GPU":"RTX 4070","RAM":"16GB DDR5","Storage":"1TB","Display":"15.6\" 240Hz"}', 'In Stock', 4.8, 2341, 'best', '💼'),
    ('MSI Katana 15 (i7 + RTX 4060)', 'laptop', 'MSI', 69999, 84999, '{"CPU":"i7-13620H","GPU":"RTX 4060","RAM":"16GB DDR5","Storage":"512GB","Display":"15.6\" 144Hz"}', 'In Stock', 4.7, 1876, 'hot', '💼'),
    ('HP Pavilion Gaming 15 (i5)', 'laptop', 'HP', 52999, 64999, '{"CPU":"i5-12500H","GPU":"RTX 3050","RAM":"8GB DDR4","Storage":"512GB","Display":"15.6\" 144Hz"}', 'In Stock', 4.5, 3241, 'sale', '💼'),
    ('Lenovo ThinkPad E15 (Ryzen 7)', 'laptop', 'Lenovo', 58999, 72999, '{"CPU":"Ryzen 7 5700U","GPU":"Radeon Vega 8","RAM":"16GB DDR4","Storage":"512GB","Display":"15.6\" FHD"}', 'In Stock', 4.7, 2134, 'new', '💼'),
    ('ASUS VivoBook 15 (Ryzen 5)', 'laptop', 'ASUS', 44999, 54999, '{"CPU":"Ryzen 5 5500U","GPU":"AMD Radeon","RAM":"8GB DDR4","Storage":"512GB","Display":"15.6\" FHD"}', 'In Stock', 4.4, 4321, 'sale', '💼'),
    ('Dell G15 Gaming (i7 + RTX 4060)', 'laptop', 'Dell', 74999, 89999, '{"CPU":"i7-13650HX","GPU":"RTX 4060","RAM":"16GB DDR5","Storage":"512GB","Display":"15.6\" 165Hz"}', 'In Stock', 4.8, 1432, 'hot', '💼'),
    ('Acer Nitro 5 (Ryzen 5)', 'laptop', 'Acer', 54999, 65999, '{"CPU":"Ryzen 5 7535HS","GPU":"RTX 3050","RAM":"8GB DDR5","Storage":"512GB","Display":"15.6\" 144Hz"}', 'In Stock', 4.5, 2876, 'sale', '💼'),
]

#Sample Names used for ChatBot 
ORDERS = [
    ('TM10045', 'Rahul Sharma', 'NVIDIA RTX 4060', 'Delivered', 'FEDEX9834723', '2025-07-01', 29999),
    ('TM10046', 'Priya Patel', 'AMD Ryzen 7 7700X', 'Out for Delivery', 'DTDC8723461', '2025-07-05', 29999),
    ('TM10047', 'Amit Singh', 'Samsung 990 Pro 2TB', 'Shipped', 'BLUEDART7234651', '2025-07-07', 11999),
    ('TM10048', 'Sneha Kumar', 'Corsair K70 RGB', 'Processing', 'TM-PROC-48', '2025-07-08', 8999),
    ('TM10049', 'Rohan Verma', 'LG 27GP850 Monitor', 'Delivered', 'ECOM8873421', '2025-06-28', 26999),
]

def seed():
    conn = sqlite3.connect('techmart.db')
    cursor = conn.cursor()

    # Create tables if they don't exist
    cursor.execute('''CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        brand TEXT NOT NULL,
        price INTEGER NOT NULL,
        old_price INTEGER,
        specifications TEXT,
        stock TEXT DEFAULT 'In Stock',
        rating REAL DEFAULT 4.5,
        reviews INTEGER DEFAULT 0,
        badge TEXT,
        emoji TEXT
    )''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT UNIQUE NOT NULL,
        customer_name TEXT,
        product_name TEXT,
        status TEXT DEFAULT 'Processing',
        tracking_number TEXT,
        order_date TEXT,
        amount INTEGER
    )''')

    # Clear existing data
    cursor.execute('DELETE FROM products')
    cursor.execute('DELETE FROM orders')

    # Insert products
    for p in PRODUCTS:
        cursor.execute(
            'INSERT INTO products (name, category, brand, price, old_price, specifications, stock, rating, reviews, badge, emoji) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
            p
        )

    # Insert orders
    for o in ORDERS:
        cursor.execute(
            'INSERT INTO orders (order_id, customer_name, product_name, status, tracking_number, order_date, amount) VALUES (?,?,?,?,?,?,?)',
            o
        )

    conn.commit()
    conn.close()
    print(f"[OK] Seeded {len(PRODUCTS)} products and {len(ORDERS)} orders!")

if __name__ == '__main__':
    seed()
