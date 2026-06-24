"""
TechMart AI - Flask Backend
Integrates PyTorch NLP chatbot with SQLite database
Run: python app.py
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import sqlite3
import datetime
import random
import torch
import numpy as np
from model import NeuralNet
from nltk_utils import bag_of_words, tokenize

app = Flask(__name__, static_folder='..', static_url_path='')
CORS(app)

# ===== LOAD PYTORCH MODEL =====
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

with open('intents.json', 'r') as f:
    intents = json.load(f)

FILE = "data.pth"
data = torch.load(FILE)

input_size = data["input_size"]
hidden_size = data["hidden_size"]
output_size = data["output_size"]
all_words = data['all_words']
tags = data['tags']
model_state = data["model_state"]

model = NeuralNet(input_size, hidden_size, output_size).to(device)
model.load_state_dict(model_state)
model.eval()

# ===== DATABASE =====
def get_db():
    conn = sqlite3.connect('techmart.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Products table
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

    # Orders table
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

    # Users table
    cursor.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        created_at TEXT
    )''')

    # Tickets table
    cursor.execute('''CREATE TABLE IF NOT EXISTS tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ticket_id TEXT UNIQUE NOT NULL,
        user_name TEXT,
        order_id TEXT,
        issue_type TEXT,
        description TEXT,
        status TEXT DEFAULT 'Open',
        created_at TEXT
    )''')

    conn.commit()
    conn.close()

# ===== INTENT CLASSIFICATION (PyTorch) =====
def classify_intent(sentence):
    sentence = tokenize(sentence)
    X = bag_of_words(sentence, all_words)
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X).to(device)

    output = model(X)
    _, predicted = torch.max(output, dim=1)
    tag = tags[predicted.item()]

    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]

    if prob.item() > 0.6:
        return tag, prob.item()
    return "general", prob.item()

# ===== ACTION ROUTER =====
def extract_entities(msg):
    msg_lower = msg.lower()
    entities = {}

    # Price extraction
    import re
    price_match = re.search(r'[₹rs\.]*\s*(\d[\d,]*)\s*(k)?', msg_lower)
    if price_match:
        price = int(price_match.group(1).replace(',', ''))
        if price_match.group(2) == 'k':
            price *= 1000
        entities['max_price'] = price

    # Category detection
    cat_map = {
        'laptop': 'laptop', 'laptops': 'laptop', 'gpu': 'gpu',
        'graphics': 'gpu', 'cpu': 'cpu', 'processor': 'cpu',
        'ssd': 'ssd', 'storage': 'ssd', 'ram': 'ram', 'memory': 'ram',
        'motherboard': 'motherboard', 'monitor': 'monitor',
        'keyboard': 'keyboard', 'mouse': 'mouse'
    }
    for key, val in cat_map.items():
        if key in msg_lower:
            entities['category'] = val
            break

    # Order ID
    order_match = re.search(r'tm\d+', msg_lower)
    if order_match:
        entities['order_id'] = order_match.group(0).upper()

    return entities

def action_router(intent, msg, entities):
    conn = get_db()

    if intent in ['product_search', 'search']:
        query = "SELECT * FROM products WHERE 1=1"
        params = []
        if 'category' in entities:
            query += " AND category = ?"
            params.append(entities['category'])
        if 'max_price' in entities:
            query += " AND price <= ?"
            params.append(entities['max_price'])
        query += " LIMIT 5"
        cursor = conn.execute(query, params)
        products = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return {'type': 'products', 'data': products}

    elif intent == 'track_order':
        if 'order_id' in entities:
            cursor = conn.execute("SELECT * FROM orders WHERE order_id = ?", (entities['order_id'],))
            order = cursor.fetchone()
            conn.close()
            if order:
                return {'type': 'order_status', 'data': dict(order)}
        conn.close()
        return {'type': 'order_form'}

    elif intent == 'complaint':
        return {'type': 'ticket_form'}

    else:
        # Use PyTorch intents.json response
        for intent_obj in intents['intents']:
            if intent_obj['tag'] == intent:
                response = random.choice(intent_obj['responses'])
                conn.close()
                return {'type': 'text', 'data': response}
        conn.close()
        return {'type': 'text', 'data': "I'm here to help! Ask me about products, orders, or support."}

# ===== API ROUTES =====

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    msg = data.get('message', '')
    if not msg:
        return jsonify({'error': 'No message provided'}), 400

    # PyTorch classification
    tag, confidence = classify_intent(msg)
    entities = extract_entities(msg)
    response = action_router(tag, msg, entities)

    return jsonify({
        'intent': tag,
        'confidence': confidence,
        'response': response
    })

@app.route('/api/products', methods=['GET'])
def get_products():
    category = request.args.get('category')
    max_price = request.args.get('max_price', type=int)
    brand = request.args.get('brand')

    conn = get_db()
    query = "SELECT * FROM products WHERE 1=1"
    params = []

    if category:
        query += " AND category = ?"
        params.append(category)
    if max_price:
        query += " AND price <= ?"
        params.append(max_price)
    if brand:
        query += " AND brand = ?"
        params.append(brand)

    cursor = conn.execute(query, params)
    products = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(products)

@app.route('/api/orders/<order_id>', methods=['GET'])
def get_order(order_id):
    conn = get_db()
    cursor = conn.execute("SELECT * FROM orders WHERE order_id = ?", (order_id.upper(),))
    order = cursor.fetchone()
    conn.close()
    if order:
        return jsonify(dict(order))
    return jsonify({'error': 'Order not found'}), 404

@app.route('/api/tickets', methods=['POST'])
def create_ticket():
    data = request.get_json()
    ticket_id = 'TKT' + str(random.randint(10000, 99999))
    created_at = datetime.datetime.now().isoformat()

    conn = get_db()
    conn.execute(
        "INSERT INTO tickets (ticket_id, user_name, order_id, issue_type, description, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        (ticket_id, data.get('name'), data.get('order_id'), data.get('issue_type'), data.get('description'), created_at)
    )
    conn.commit()
    conn.close()
    return jsonify({'ticket_id': ticket_id, 'status': 'Open', 'created_at': created_at})

@app.route('/api/compatibility', methods=['POST'])
def check_compatibility():
    data = request.get_json()
    cpu = data.get('cpu', '').lower()
    board = data.get('board', '').lower()
    
    # Compatibility logic
    compat_rules = {
        ('ryzen 7000', 'am5'): True, ('ryzen 5000', 'am4'): True,
        ('ryzen 5000', 'am5'): False, ('ryzen 7000', 'am4'): False,
        ('intel 13th', 'lga1700'): True, ('intel 12th', 'lga1700'): True,
    }
    result = None
    for (cpu_key, socket), compat in compat_rules.items():
        if cpu_key in cpu and socket in board:
            result = compat
            break
    
    if result is None:
        return jsonify({'compatible': None, 'note': 'Could not determine compatibility. Please check manufacturer specs.'})
    return jsonify({'compatible': result, 'note': 'Compatible!' if result else 'Not compatible!'})

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000, use_reloader=False)
