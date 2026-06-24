# Techmart-smartbot
Full-stack AI chatbot using PyTorch for intent classification, Flask for API, SQLite for data, React for UI. Features: product search, order tracking, compatibility checks, tickets. BoW + 3-layer neural net with Cross-Entropy loss.

# TechMart — Smart Computer Hardware E-Commerce Website

## 🚀 Project Overview
TechMart is a full-stack computer hardware e-commerce website with an integrated AI chatbot powered by PyTorch NLP. Features a complete checkout system with order tracking, 60+ products across 13 categories, and a responsive design that works on all devices.

---


---


---

## ✨ Features




### 🤖 AI Chatbot
- **19 Intents** — Product search, recommend, compare, compatibility, track order, returns, complaint, payment, delivery, warranty, cart/checkout, price inquiry, stock check, offers, greeting, farewell, help, about
- **Fuzzy Matching** — Handles typos (nvida, samsng, helo, lappy)
- **Synonym Recognition** — 150+ synonyms for actions, categories, brands
- **Product Comparison** — Side-by-side spec comparison table
- **Order Tracking** — Live status with progress bar
- **Support Tickets** — Create tickets with unique IDs
- **Quick Reply Buttons** — One-click common queries
- **Natural Language** — Understands casual speech and questions

### 📱 Responsive Design
- **Mobile-First** — Works on all screen sizes (360px to 1920px)
- **Touch Optimizations** — Tap feedback instead of hover
- **Floating Credit Badge** — Mobile-only developer credit
- **Responsive Navigation** — Hamburger menu on mobile
- **Adaptive Layouts** — Grids adjust from 1 to 4 columns

---

## 🗄️ Product Categories (13)

| Category | Products | Price Range |
|----------|----------|-------------|
| CPUs | 5 | ₹14,999 - ₹54,999 |
| GPUs | 5 | ₹24,999 - ₹1,49,999 |
| RAM | 4 | ₹3,499 - ₹18,999 |
| SSDs | 4 | ₹1,999 - ₹11,999 |
| Motherboards | 4 | ₹12,999 - ₹24,999 |
| Monitors | 4 | ₹19,999 - ₹26,999 |
| Keyboards | 4 | ₹5,499 - ₹9,999 |
| Mice | 4 | ₹3,999 - ₹10,999 |
| Laptops | 8 | ₹44,999 - ₹89,999 |
| Headphones | 4 | ₹12,999 - ₹28,999 |
| Speakers | 4 | ₹8,999 - ₹19,999 |
| Lights | 4 | ₹2,999 - ₹7,999 |
| Webcams | 2 | ₹6,999 - ₹12,999 |
| Routers | 2 | ₹7,999 - ₹18,999 |
| UPS | 2 | ₹10,999 - ₹12,999 |

---

## ⚙️ Setup Instructions

### Frontend (React/Vite)
```bash
npm install
npm run build
# Deploy dist/ folder to Netlify/Vercel
```

### Backend (Flask + PyTorch)
```bash
cd backend
pip install -r requirements.txt
python seed_db.py      # Seed database
python train.py        # Train PyTorch model
python app.py          # Start Flask server on port 5000
```

### Connect Frontend to Backend
In `src/scripts/chatbot.js`, the `processMessage` function can be connected to the Flask API:
```javascript
const response = await fetch('http://localhost:5000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: msg })
});
const data = await response.json();
return data.response;
```

---

## 🎯 Chatbot Commands

| Feature | Example Query | Response |
|---------|--------------|----------|
| Product Search | "Show gaming laptops under ₹60000" | Product cards with specs |
| Recommendation | "Best GPU for gaming" | Top-rated GPU list |
| Comparison | "Compare RTX 4060 vs RTX 5060 Ti" | Side-by-side table |
| Compatibility | "Is Ryzen 7 compatible with B650?" | Yes/No with explanation |
| Order Tracking | "Track my order TM10045" | Live status with progress bar |
| Complaint | "My keyboard is not working" | Support ticket form |
| Return/Refund | "I want to return my product" | Step-by-step guide |
| Payment Info | "What payment methods?" | Full payment list |
| Delivery Info | "How long is delivery?" | Delivery times and charges |
| Price Check | "Price of RTX " | Price with discount |
| Stock Status | "RTX stock" | Stock availability |
| Help | "What can you do?" | Full command list |

---


## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, JavaScript (ES6 Modules) |
| Build Tool | Vite + React (shell only) |
| Styling | Custom CSS with CSS Variables |
| Icons | Font Awesome 6 |
| Fonts | Inter + Orbitron (Google Fonts) |
| Backend | Python Flask 3.0 |
| AI/ML | PyTorch + NLTK |
| Database | SQLite |
| NLP | Bag-of-Words + Stemming + Neural Net |

---

## 📝 License
This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Developer
**Divyarajsinh Jadav** — R.C. Technical Institute, Diploma Student
