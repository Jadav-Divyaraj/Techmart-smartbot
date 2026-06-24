// ===== TECHMART AI CHATBOT ENGINE =====
// Advanced intent classifier with fuzzy matching, context awareness, and natural language understanding

import { PRODUCTS, ORDERS, COMPATIBILITY, formatPrice } from './database.js';

// ===== MATCHING DICTIONARY =====
const SYNONYMS = {
  // Actions
  show: ['show', 'display', 'list', 'get', 'find', 'search', 'browse', 'see', 'view', 'give me', 'i want', 'i need', 'looking for', 'show me', 'find me', 'help me find', 'where can i find', 'do you have', 'any', 'fetch'],
  recommend: ['recommend', 'suggest', 'best', 'good', 'which one', 'what should', 'advise', 'help me choose', 'ideal', 'for me', 'top', 'top rated', 'highest rated', 'worth', 'value for money', 'best value', 'go for'],
  compare: ['compare', 'vs', 'versus', 'difference', 'better', 'or', 'which is', 'difference between', 'head to head', 'battle', 'versus', 'fight'],
  buy: ['buy', 'purchase', 'order', 'add to cart', 'cart', 'checkout', 'pay', 'get', 'book'],
  greet: ['hi', 'hello', 'hey', 'good morning', 'good evening', 'good afternoon', 'howdy', 'sup', 'namaste', 'hola', 'yo', 'whats up', "what's up", 'how are you', 'how r u', 'hie', 'hii', 'hiii', 'helo', 'heyy'],
  bye: ['bye', 'goodbye', 'see you', 'later', 'ttyl', 'thank', 'thanks', 'thank you', 'ty', 'thx', 'appreciate', 'great help', 'awesome'],
  help: ['help', 'assist', 'support', 'guide', 'how to', 'how do', 'what can you do', 'features', 'capabilities', 'menu', 'options', 'commands'],
  yes: ['yes', 'yeah', 'yep', 'yup', 'sure', 'ok', 'okay', 'y', 'correct', 'right', 'absolutely', 'definitely', 'of course', 'go ahead', 'do it', 'confirm', 'proceed'],
  no: ['no', 'nah', 'nope', 'n', 'not really', 'cancel', 'stop', 'dont', "don't", 'never mind', 'change mind', 'go back'],

  // Categories (with typos and slang)
  laptop: ['laptop', 'laptops', 'lap', 'lappy', 'notebook', 'computer', 'pc', 'macbook', 'chromebook', 'ultrabook'],
  gpu: ['gpu', 'graphics card', 'graphics', 'video card', 'vga', 'gtx', 'rtx', 'radeon', 'geforce', 'nvidia', 'amd gpu', 'video adapter', 'graphics processor', 'gpu card', 'rtx card'],
  cpu: ['cpu', 'processor', 'processors', 'cpu unit', 'intel', 'amd', 'ryzen', 'core', 'core i5', 'core i7', 'core i9', 'pentium', 'celeron', 'chip'],
  ram: ['ram', 'memory', 'ram stick', 'ram kit', 'ddr', 'ddr4', 'ddr5', 'dram', 'system memory'],
  ssd: ['ssd', 'solid state', 'solid state drive', 'storage', 'hard drive', 'hdd', 'nvme', 'm.2', 'sata ssd', 'hard disk', 'drive', 'disk'],
  motherboard: ['motherboard', 'mainboard', 'mobo', 'board', 'mother board', 'main board', 'mother-board', 'logic board', 'system board'],
  monitor: ['monitor', 'display', 'screen', 'led', 'lcd', 'oled', 'gaming monitor', 'computer screen', 'desktop monitor', '27 inch', '24 inch', '32 inch'],
  keyboard: ['keyboard', 'key board', 'keyboards', 'mechanical keyboard', 'membrane keyboard', 'wireless keyboard', 'gaming keyboard', 'keys'],
  mouse: ['mouse', 'mice', 'gaming mouse', 'wireless mouse', 'bluetooth mouse', 'optical mouse', 'gaming mice', 'trackball'],

  // Brands
  nvidia: ['nvidia', 'nvida', 'geforce', 'rtx', 'gtx'],
  amd: ['amd', 'radeon', 'ryzen', 'threadripper', 'athlon'],
  intel: ['intel', 'core', 'pentium', 'celeron', 'xeon', 'arc'],
  asus: ['asus', 'asus rog', 'rog', 'tuf', 'vivobook', 'zenbook'],
  msi: ['msi', 'micro-star'],
  hp: ['hp', 'hewlett', 'pavilion', 'omen', 'envy'],
  lenovo: ['lenovo', 'thinkpad', 'ideapad', 'legion', 'yoga'],
  dell: ['dell', 'alienware', 'g-series', 'inspiron', 'xps'],
  samsung: ['samsung', 'samsng', 'odyssey', 'ev'],
  lg: ['lg', 'ultragear'],
  corsair: ['corsair', 'corsair'],
  logitech: ['logitech', 'logitec', 'g series', 'g-pro'],
  razer: ['razer', 'razr'],
  kingston: ['kingston', 'hyperx', 'fury'],
  wd: ['wd', 'western digital', 'westerndigital', 'black sn'],
  gigabyte: ['gigabyte', 'gigbyte', 'aorus', 'aero'],
  steelseries: ['steelseries', 'steel series', 'steelseris'],
  keychron: ['keychron', 'keychron'],

  // Use cases
  gaming: ['gam', 'gamer', 'gaming', 'games', 'game', 'play', 'pubg', 'fortnite', 'valorant', 'cod', 'warzone', 'apex', 'esports', 'stream games'],
  programming: ['programm', 'programming', 'code', 'coding', 'developer', 'development', 'software', 'web dev', 'app dev', 'python', 'java', 'javascript', 'react', 'full stack', 'programmer'],
  student: ['student', 'college', 'school', 'university', 'study', 'studies', 'studying', 'btech', 'bca', 'mca', 'engineering', '12th', '10th', 'semester', 'exam'],
  editing: ['edit', 'editing', 'video edit', 'video editing', 'photo editing', 'photoshop', 'premiere', 'after effects', 'davinci', 'creator', 'content', 'youtube', 'video maker', 'video creator'],
  work: ['work', 'office', 'business', 'professional', 'corporate', 'remote work', 'wfh', 'work from home', 'productivity', 'multitasking'],
  streaming: ['stream', 'streaming', 'twitch', 'obs', 'broadcast', 'live stream', 'streamer', 'content creator'],
  budget: ['budget', 'cheap', 'affordable', 'low price', 'low cost', 'economical', 'pocket friendly', 'inexpensive', 'best deal', 'cheapest', 'under', 'below', 'less than', 'within', 'max', 'maximum'],
};

// ===== INTENT PATTERNS (regex-based) =====
// NOTE: Order matters! Compare & Recommend BEFORE Product Search to avoid false matches.
const INTENT_PATTERNS = [
  // Comparison (check first - before product_search)
  { intent: 'compare', patterns: [
    /\b(compare|vs|versus|difference between|head to head|battle|difference)\b/i,
    /\b(rtx|rx|ryzen|intel|core|i5|i7|i9|gpu|cpu|ssd|ram|laptop|headphone|speaker|light)\b.*\b(vs|versus|or|and|compare)\b.*\b(rtx|rx|ryzen|intel|core|i5|i7|i9|gpu|cpu|ssd|ram|laptop|headphone|speaker|light)\b/i,
    /\b(which (one|is) (better|best|good|great|faster|cheaper|worth))\b/i,
    /\b(better|best|good|great|faster|cheaper|worth).*\b(than|over|between)\b/i,
    /\b(or)\b.*\b(right|correct|better|best|good|great)\b/i,
  ]},

  // Recommendation (check before product_search)
  { intent: 'recommend', patterns: [
    /\b(recommend|suggest|best|top|which one|what should|advise|help me choose|ideal|for me|worth buying|value for money|best value|go for|pick|choose|select)\b/i,
    /\b(for gaming|for programming|for work|for students|for editing|for streaming|for coding|for college|for video editing|for office|for home)\b/i,
    /\b(what|which).*\b(should|would|could)\b.*\b(buy|choose|pick|get|go for|select)\b/i,
    /\b(good|great|excellent|amazing|awesome|solid|reliable|durable|long lasting)\b.*\b(laptop|gpu|cpu|ssd|ram|keyboard|mouse|monitor|motherboard|headphone|speaker|light|webcam|router|ups|product|option|choice)\b/i,
    /\b(any suggestions?|what do you suggest|what would you recommend)\b/i,
  ]},

  // Product search (check after compare/recommend)
  { intent: 'product_search', patterns: [
    /\b(show|find|get|search|list|display|browse|see|view|fetch|looking for|where can i|do you have)\b.*\b(product|laptop|gpu|cpu|ssd|ram|keyboard|mouse|monitor|motherboard|processor|graphics|gaming|storage|memory|board|display|screen|drive|chip|headphone|speaker|light|webcam|router|ups|earbud|headset)\b/i,
    /\b(under|below|less than|cheap|budget|affordable|within|over|around|about|approx)\b.*[₹\d]/i,
    /\b(rtx|rx |radeon|geforce|nvidia|amd|intel|core|ryzen|ddr4|ddr5|nvme)\b/i,
    /\b(laptop|gpu|cpu|ssd|ram|keyboard|mouse|monitor|motherboard|headphone|speaker|light|webcam|router|ups)\b.*\b(under|below|less|cheap|budget|price|cost|around|about)\b/i,
    /\b(what|which).*\b(laptop|gpu|cpu|ssd|ram|keyboard|mouse|monitor|motherboard|headphone|speaker|light|webcam|router|ups)\b/i,
    /\b(any|some)\b.*\b(laptop|gpu|cpu|ssd|ram|keyboard|mouse|monitor|motherboard|headphone|speaker|light|webcam|router|ups|product|deal|item)\b/i,
    /\b(new|latest|recent|arrival)\b/i,
  ]},

  // Compatibility
  { intent: 'compatibility', patterns: [
    /\b(compat|compatible|compatibility|work with|fit|support|fits|works with|pair|pairing|matching)\b/i,
    /\b(am4|am5|lga1700|lga1200|b650|b550|x670|z790|b660|z690|h610|h670|b450|x570|b350)\b/i,
    /\b(socket|chipset|motherboard).*\b(support|compatible|fit|work)\b/i,
    /\b(can i|could i|is it possible to)\b.*\b(use|pair|connect|install|put|combine)\b/i,
    /\b(will|does).*\b(work|fit|support|compatible)\b/i,
  ]},

  // Order tracking
  { intent: 'track_order', patterns: [
    /\b(track|tracking|where is|order status|where.*order|my order|delivery status|shipped|delivery|when.*arrive|when.*come|expected delivery|delivery date|dispatch|ship|transit)\b/i,
    /\border\s*(id|number|no|#)?\s*[:#]?\s*tm\d+/i,
    /\b(package|parcel|item|product|order)\b.*\b(where|when|status|track|delivered|shipped|delayed)\b/i,
    /\b(has|did|is|was)\b.*\b(order|package|parcel|item|product|delivery)\b.*\b(shipped|dispatched|delivered|arrived|come|reach)\b/i,
    /\bhow long|when will|when is|what time|how many days\b.*\b(deliver|arrive|come|reach|ship|dispatch)\b/i,
  ]},

  // Returns & Refund
  { intent: 'return_refund', patterns: [
    /\b(return|refund|send back|exchange|replace|replacement|money back|cancel order|cancellation)\b/i,
    /\b(dont|don't|do not)\b.*\b(want|like|need|keep)\b/i,
    /\b(want|need|would like)\b.*\b(return|refund|exchange|replace|back|money)\b/i,
    /\b(how to|how can|process for|procedure for|steps to)\b.*\b(return|refund|exchange|replace)\b/i,
    /\b(return|refund|exchange|replace)\b.*\b(policy|process|procedure|how|days|time|period)\b/i,
  ]},

  // Complaint
  { intent: 'complaint', patterns: [
    /\b(complaint|complain|not working|broken|damaged|defective|issue|problem|dead|faulty|doesn't work|does not work|not working|failed|failure|error|bug|glitch|malfunction)\b/i,
    /\b(product|item|device|thing|stuff)\b.*\b(broken|damaged|defective|not working|faulty|issue|problem|dead|failed|wrong)\b/i,
    /\b(wrong|different|fake|counterfeit|duplicate|used|old|refurbished)\b.*\b(product|item|thing|sent|delivered|received)\b/i,
    /\b(disappointed|unsatisfied|terrible|worst|horrible|awful|bad experience|poor quality|not good|cheap quality)\b/i,
    /\b(angry|frustrated|upset|irritated|annoyed|unhappy|dissatisfied)\b/i,
    /\b(want|need|file|raise|make|register|submit)\b.*\b(complaint|complain|ticket|issue|grievance)\b/i,
  ]},

  // Payment
  { intent: 'payment', patterns: [
    /\b(payment|pay|upi|credit card|debit card|emi|cod|cash on delivery|net banking|gpay|paytm|phonepe|google pay|paypal|payumoney|razorpay|card|cheque|wallet|mobile wallet)\b/i,
    /\b(how|what|which|accepted|available|options|methods|types)\b.*\b(pay|payment|pay|transaction)\b/i,
    /\b(is|are|do you|can i|accept|support|have)\b.*\b(upi|gpay|paytm|phonepe|credit|debit|cod|emi|net banking|wallet|card)\b/i,
    /\b(online|digital|electronic|mobile|contactless)\b.*\b(pay|payment|wallet|transfer)\b/i,
    /\b(installment|emi|no cost|zero interest|monthly|pay later|bnpl|buy now pay later|simpl|zestmoney|lazypay)\b/i,
    /\b(secure|safe|trust|trusted|fraud|scam|hack|protect)\b.*\b(pay|payment|transaction|money)\b/i,
  ]},

  // Delivery & Shipping
  { intent: 'delivery', patterns: [
    /\b(deliver|delivery|shipping|dispatch|estimated|days|arrive|logistics|free shipping|ship|transit|transport|courier|fedex|dtdc|bluedart|ecom|india post|speedpost|express|fast delivery|same day|one day)\b/i,
    /\b(how many days|how long|when will|when is|what time|estimated time|delivery time|shipping time|arrival time)\b/i,
    /\b(shipping|delivery)\b.*\b(charge|cost|fee|free|price|rate|amount)\b/i,
    /\b(do you|can you|is there|available in)\b.*\b(ship|deliver|shipping|delivery|express|fast|same day)\b/i,
    /\b(location|area|city|state|pin|pincode|address|region|zone|country)\b.*\b(deliver|ship|available|service)\b/i,
    /\b(international|overseas|global|abroad|outside india|other country)\b.*\b(ship|deliver|shipping)\b/i,
  ]},

  // Warranty
  { intent: 'warranty', patterns: [
    /\bwarranty|guarantee|service center|service centre|repair|replacement guarantee|extended warranty|warranty period|warranty coverage|claim warranty|warranty claim\b/i,
    /\b(how long|how many|duration|period|years?|months?)\b.*\b(warranty|guarantee|service|repair)\b/i,
    /\b(is there|do you|does it|is it covered|included)\b.*\b(warranty|guarantee|service|repair)\b/i,
    /\b(what|which)\b.*\b(warranty|guarantee|service|repair)\b.*\b(cover|include|provide|offer)\b/i,
    /\b(broken|damaged|defective|faulty|issue|problem|not working)\b.*\b(warranty|guarantee|service|repair|replace|claim)\b/i,
  ]},

  // Greeting
  { intent: 'greeting', patterns: [
    /^(hi|hello|hey|good morning|good evening|good afternoon|howdy|sup|namaste|hola|yo|whats up|what's up|hie|hii|hiii|helo|heyy|heya|hiya|howdy|how r u|how are you|how do you do|greetings|good day|good night)[\s!.,]*$/i,
    /^(start|begin|hey there|hi there|hello there|yo yo|sup dude|sup bro|hey buddy|hi buddy|hey pal|hi pal|hey mate|hi mate|hey friend|hi friend|hey man|hi man|hey girl|hi girl|hey dude|hi dude|hey bro|hi bro|hey sis|hi sis)[\s!.,]*$/i,
  ]},

  // About store
  { intent: 'about', patterns: [
    /\b(about|who are you|what is techmart|techmart|store|shop|company|business|organization|organisation|firm|startup|who made|who built|who created|developer|developer|team|founder|owner|ceo|cto)\b/i,
    /\b(contact|address|location|phone|email|website|social media|instagram|facebook|twitter|linkedin|youtube)\b/i,
    /\b(where|located|based|headquarters|office|branch|store location)\b/i,
    /\b(how long|when did|since|established|founded|started|launched|begin)\b/i,
    /\b(your name|who am i talking to|who are you|what are you|are you human|are you bot|are you real|are you ai|are you robot|are you chatbot|are you assistant)\b/i,
  ]},

  // Cart / Checkout
  { intent: 'cart_checkout', patterns: [
    /\b(cart|shopping cart|my cart|view cart|open cart|show cart|see cart|check cart|cart items|cart total)\b/i,
    /\b(checkout|place order|complete order|finish order|confirm order|proceed to pay|pay now|buy now|complete purchase|finish purchase|order now|buy all|purchase all)\b/i,
    /\b(add to cart|add all|add everything|buy everything|order everything|purchase everything)\b/i,
    /\b(empty cart|clear cart|remove all|delete cart|reset cart)\b/i,
    /\b(how many|how much|total|subtotal|items in cart|cart count|cart total|cart value)\b.*\b(cart|cart)\b/i,
  ]},

  // Price inquiry
  { intent: 'price_inquiry', patterns: [
    /\b(price|cost|how much|rate|value|amount|pricing|mrp|discount|deal|offer|cheap|expensive|affordable|budget)\b/i,
    /\b(what is|what's|tell me|what are)\b.*\b(price|cost|rate|value|amount|pricing)\b/i,
    /\b(is it|are they)\b.*\b(cheap|expensive|affordable|worth|costly|budget)\b/i,
    /\b(discount|deal|offer|sale|off|percentage|% off|rebate|cashback)\b/i,
  ]},

  // Stock / Availability
  { intent: 'stock_availability', patterns: [
    /\b(stock|available|availability|in stock|out of stock|sold out|sold|left|remaining|inventory|quantity)\b/i,
    /\b(is|are|do you have|can i get|will there be)\b.*\b(available|in stock|stock|inventory)\b/i,
    /\b(when|how soon|next batch|restock|refill|replenish)\b/i,
  ]},

  // Offers / Deals
  { intent: 'offers_deals', patterns: [
    /\b(offer|deals|sale|discount|coupon|promo|promotion|voucher|code|special|limited time|flash deal|daily deal|weekly deal|combo|bundle|bogo|buy one|get one|free gift|freebie)\b/i,
    /\b(current|ongoing|running|active|latest|today|this week|this month|seasonal|festive|diwali|christmas|new year|independence|republic)\b.*\b(offer|deal|sale|discount|promo)\b/i,
    /\b(any|any ongoing|any running|any active|any current|any latest|any special)\b.*\b(offer|deal|sale|discount|promo|coupon|code)\b/i,
  ]},

  // Greetings (farewell)
  { intent: 'farewell', patterns: [
    /^(bye|goodbye|see you|see ya|later|ttyl|thank|thanks|thank you|ty|thx|appreciate|great help|awesome|nice|good talk|good chat|talk later|catch you later|have a good day|have a nice day|have a great day|good night|good evening|good morning|good afternoon|good luck|best regards|take care|care|peace out|cheers|ciao|adios|au revoir|sayonara)[\s!.,]*$/i,
  ]},

  // Help
  { intent: 'help', patterns: [
    /^(help|assist|support|guide|how to|how do|what can you do|features|capabilities|menu|options|commands|what can you|what do you|what are you|help me|i need help|i want help|need help|need assistance|need support|need guidance|need direction|need advice|need suggestion|need recommendation|need solution|need answer|need info|need information|need details|need clarification|need explanation|need help with|help with|assist with|support with|guide through|walk me through|show me how|teach me|explain to me|tell me about|tell me how|tell me what|tell me which|tell me why|tell me where|tell me when|tell me who|tell me whom|tell me whose|tell me|advise me|advise|suggest|suggestion|recommend|recommendation|propose|proposal|counsel|counseling|direction|guidance|instruction|instructional|tutorial|tutorial|how to|how do|how does|how can|how could|how would|how should|how will|how might|how about|what to|what do|what does|what is|what are|what was|what were|what will|what would|what could|what should|what might|what about|which to|which do|which does|which is|which are|which was|which were|which will|which would|which could|which should|which might|which about|where to|where do|where does|where is|where are|where was|where were|where will|where would|where could|where should|where might|where about|when to|when do|when does|when is|when are|when was|when were|when will|when would|when could|when should|when might|when about|why do|why does|why is|why are|why was|why were|why will|why would|why could|why should|why might|why about|who do|who does|who is|who are|who was|who were|who will|who would|who could|who should|who might|who about|whom do|whom does|whom is|whom are|whom was|whom were|whom will|whom would|whom could|whom should|whom might|whom about|whose do|whose does|whose is|whose are|whose was|whose were|whose will|whose would|whose could|whose should|whose might|whose about)[\s!.,]*$/i,
  ]},
];

// ===== ENTITY EXTRACTOR =====
function extractEntities(msg) {
  const m = msg.toLowerCase().trim();
  const entities = {};

  // Extract price limit (handles: ₹50000, rs 50000, 50k, 50000, 50,000, under 50000, below 50000)
  const pricePatterns = [
    /[₹rs\.]*\s*(\d[\d,]*)\s*(k|thousand|lakhs?|lacs?|crore|cr)?\b/i,
    /(under|below|less than|within|around|about|approx|maximum|max|up to|not more than|no more than|capped at)\s*[₹rs\.]*\s*(\d[\d,]*)\s*(k|thousand|lakhs?|lacs?|crore|cr)?\b/i,
  ];
  for (const pattern of pricePatterns) {
    const match = m.match(pattern);
    if (match) {
      let price = parseInt((match[1] || match[2]).replace(/,/g, ''));
      const unit = (match[2] || match[3] || '').toLowerCase();
      if (unit === 'k' || unit === 'thousand') price *= 1000;
      else if (unit === 'lakh' || unit === 'lac' || unit === 'lakhs' || unit === 'lacs') price *= 100000;
      else if (unit === 'crore' || unit === 'cr') price *= 10000000;
      if (price >= 100 && price <= 10000000) { // sanity check
        entities.maxPrice = price;
      }
    }
  }

  // Extract category
  const catMap = {
    laptop: ['laptop', 'laptops', 'lap', 'lappy', 'notebook', 'computer', 'pc', 'macbook', 'chromebook', 'ultrabook'],
    gpu: ['gpu', 'graphics card', 'graphics', 'video card', 'vga', 'gtx', 'rtx', 'radeon', 'geforce', 'nvidia', 'amd gpu', 'video adapter', 'graphics processor', 'rtx card'],
    cpu: ['cpu', 'processor', 'processors', 'intel', 'amd', 'ryzen', 'core i', 'core i5', 'core i7', 'core i9', 'pentium', 'celeron', 'chip'],
    ram: ['ram', 'memory', 'ram stick', 'ram kit', 'ddr4', 'ddr5', 'dram', 'system memory'],
    ssd: ['ssd', 'solid state', 'solid state drive', 'hard drive', 'hdd', 'nvme', 'm.2', 'sata ssd', 'hard disk', 'drive', 'disk', 'storage'],
    motherboard: ['motherboard', 'mainboard', 'mobo', 'mother board', 'main board', 'logic board', 'system board'],
    monitor: ['monitor', 'display', 'screen', 'led', 'lcd', 'oled', 'gaming monitor', 'computer screen', 'desktop monitor'],
    keyboard: ['keyboard', 'key board', 'keyboards', 'mechanical keyboard', 'membrane keyboard', 'wireless keyboard', 'gaming keyboard', 'keys'],
    mouse: ['mouse', 'mice', 'gaming mouse', 'wireless mouse', 'bluetooth mouse', 'optical mouse', 'gaming mice', 'trackball'],
    headphone: ['headphone', 'headphones', 'headset', 'earbuds', 'earphone', 'earphones', 'airpods', 'sony wh', 'bose quiet', 'razer blackshark'],
    speaker: ['speaker', 'speakers', 'bluetooth speaker', 'portable speaker', 'jbl', 'marshall', 'sonos', 'bose sound', 'soundbar'],
    light: ['light', 'lights', 'bulb', 'led strip', 'rgb light', 'smart bulb', 'philips hue', 'nanoleaf', 'logitech g', 'corsair icue', 'lighting'],
    webcam: ['webcam', 'web cam', 'camera', 'logitech c920', 'elgato face'],
    router: ['router', 'wifi router', 'gaming router', 'asus rt', 'tp-link'],
    ups: ['ups', 'power backup', 'battery backup', 'apc', 'cyberpower', 'uninterruptible power'],
  };
  for (const [cat, keywords] of Object.entries(catMap)) {
    if (keywords.some(k => m.includes(k))) { entities.category = cat; break; }
  }

  // Extract brand
  const brandMap = {
    'NVIDIA': ['nvidia', 'nvida', 'geforce', 'rtx', 'gtx'],
    'AMD': ['amd', 'radeon', 'ryzen', 'threadripper', 'athlon'],
    'Intel': ['intel', 'core', 'pentium', 'celeron', 'xeon', 'arc'],
    'ASUS': ['asus', 'rog', 'tuf', 'vivobook', 'zenbook'],
    'MSI': ['msi'],
    'HP': ['hp', 'hewlett', 'pavilion', 'omen', 'envy'],
    'Lenovo': ['lenovo', 'thinkpad', 'ideapad', 'legion', 'yoga'],
    'Dell': ['dell', 'alienware', 'g-series', 'inspiron', 'xps'],
    'Samsung': ['samsung', 'samsng', 'odyssey', 'ev'],
    'LG': ['lg', 'ultragear'],
    'Corsair': ['corsair'],
    'Logitech': ['logitech', 'logitec'],
    'Razer': ['razer', 'razr'],
    'Kingston': ['kingston', 'hyperx', 'fury'],
    'Western Digital': ['wd', 'western digital', 'westerndigital'],
    'Gigabyte': ['gigabyte', 'gigbyte', 'aorus', 'aero'],
    'SteelSeries': ['steelseries', 'steel series'],
    'Keychron': ['keychron'],
  };
  for (const [brand, keywords] of Object.entries(brandMap)) {
    if (keywords.some(k => m.includes(k))) { entities.brand = brand; break; }
  }

  // Extract use case
  if (/\bgam(e|ing|er|ers)\b|\bplay\b|\bpubg\b|\bfortnite\b|\bvalorant\b|\bcod\b|\bwarzone\b|\bapex\b|\besports\b|\bstream games\b/.test(m)) entities.useCase = 'gaming';
  else if (/\bprogramm(e|ing|er|ers)\b|\bcod(e|ing|er|ers)\b|\bdevelop(er|ment)\b|\bsoftware\b|\bweb dev\b|\bapp dev\b|\bpython\b|\bjava\b|\bjavascript\b|\breact\b|\bfull stack\b/.test(m)) entities.useCase = 'programming';
  else if (/\bstudent\b|\bcollege\b|\bschool\b|\buniversity\b|\bstudy\b|\bstudies\b|\bstudying\b|\bbtech\b|\bbca\b|\bmca\b|\bengineering\b|\bsemester\b|\bexam\b/.test(m)) entities.useCase = 'student';
  else if (/\bedit(ing)?\b|\bcreator\b|\byoutub\b|\bvideo edit\b|\bphoto editing\b|\bphotoshop\b|\bpremiere\b|\bafter effects\b|\bdavinci\b|\bcontent creator\b/.test(m)) entities.useCase = 'editing';
  else if (/\bwork\b|\boffice\b|\bbusiness\b|\bprofessional\b|\bcorporate\b|\bremote work\b|\bwfh\b|\bwork from home\b|\bproductivity\b/.test(m)) entities.useCase = 'work';
  else if (/\bstream(ing)?\s*\btwitch\b|\bobs\b|\bbroadcast\b|\blive stream\b|\bstreamer\b/.test(m)) entities.useCase = 'streaming';

  // Extract specific product names for comparison
  const products = [];
  const gpuNames = ['rtx 4060', 'rtx 4070', 'rtx 4070 super', 'rtx 4090', 'rtx 5060', 'rtx 5060 ti', 'rx 7600', 'rx 7900', 'rx 6700', 'rtx 3050', 'rtx 3050 ti'];
  const cpuNames = ['ryzen 5 5600', 'ryzen 5 5600x', 'ryzen 7 7700', 'ryzen 7 7700x', 'ryzen 9 7900', 'ryzen 9 7900x', 'i5-13600k', 'i7-13700k', 'i9-13900k', 'i5', 'i7', 'i9', 'ryzen 5', 'ryzen 7', 'ryzen 9'];
  [...gpuNames, ...cpuNames].forEach(name => { if (m.includes(name)) products.push(name); });
  if (products.length) entities.compareProducts = products;

  // Extract order ID
  const orderMatch = m.match(/tm\d+/i);
  if (orderMatch) entities.orderId = orderMatch[0].toUpperCase();

  // Extract product by name search
  if (!entities.category && !entities.compareProducts) {
    for (const p of PRODUCTS) {
      const nameWords = p.name.toLowerCase().split(' ').filter(w => w.length > 3);
      const matchCount = nameWords.filter(w => m.includes(w)).length;
      if (matchCount >= 2 || (nameWords.length >= 3 && matchCount >= 1)) {
        entities.productId = p.id;
        entities.category = p.category;
        break;
      }
    }
  }

  return entities;
}

// ===== INTENT CLASSIFIER =====
function classifyIntent(msg) {
  const m = msg.toLowerCase().trim();

  // Try regex patterns first (most reliable)
  for (const { intent, patterns } of INTENT_PATTERNS) {
    for (const pattern of patterns) {
      if (pattern.test(m)) return intent;
    }
  }

  // Fallback: keyword-based classification with synonyms
  const words = m.split(/\s+/).filter(w => w.length > 1);

  // Check each intent's keywords
  const intentScores = {};

  // Product search
  if (words.some(w => SYNONYMS.show.includes(w) || SYNONYMS.laptop.includes(w) || SYNONYMS.gpu.includes(w) || SYNONYMS.cpu.includes(w) || SYNONYMS.ram.includes(w) || SYNONYMS.ssd.includes(w) || SYNONYMS.motherboard.includes(w) || SYNONYMS.monitor.includes(w) || SYNONYMS.keyboard.includes(w) || SYNONYMS.mouse.includes(w))) {
    intentScores.product_search = (intentScores.product_search || 0) + 1;
  }

  // Recommendation
  if (words.some(w => SYNONYMS.recommend.includes(w))) intentScores.recommend = (intentScores.recommend || 0) + 2;
  if (words.some(w => SYNONYMS.gaming.includes(w) || SYNONYMS.programming.includes(w) || SYNONYMS.student.includes(w) || SYNONYMS.editing.includes(w) || SYNONYMS.work.includes(w) || SYNONYMS.streaming.includes(w))) {
    intentScores.recommend = (intentScores.recommend || 0) + 1;
  }

  // Comparison
  if (words.some(w => SYNONYMS.compare.includes(w))) intentScores.compare = (intentScores.compare || 0) + 2;

  // Compatibility
  if (/\b(compat|compatible|compatibility|work with|fit|support|fits|works with|pair|pairing|matching)\b/.test(m)) intentScores.compatibility = (intentScores.compatibility || 0) + 2;
  if (/\b(am4|am5|lga1700|lga1200|b650|b550|x670|z790|b660|z690|h610|h670|b450|x570|b350)\b/.test(m)) intentScores.compatibility = (intentScores.compatibility || 0) + 1;

  // Order tracking
  if (/\b(track|tracking|where is|order status|where.*order|my order|delivery status|shipped|delivery|when.*arrive|when.*come|expected delivery|delivery date|dispatch|ship|transit)\b/.test(m)) intentScores.track_order = (intentScores.track_order || 0) + 2;
  if (/\border\s*(id|number|no)?\s*[:#]?\s*tm\d+/i.test(m)) intentScores.track_order = (intentScores.track_order || 0) + 3;

  // Returns & Refund
  if (/\b(return|refund|send back|exchange|replace|replacement|money back|cancel order|cancellation)\b/.test(m)) intentScores.return_refund = (intentScores.return_refund || 0) + 2;

  // Complaint
  if (/\b(complaint|complain|not working|broken|damaged|defective|issue|problem|dead|faulty|doesn't work|does not work|not working|failed|failure|error|bug|glitch|malfunction)\b/.test(m)) intentScores.complaint = (intentScores.complaint || 0) + 2;

  // Payment
  if (/\b(payment|pay|upi|credit card|debit card|emi|cod|cash on delivery|net banking|gpay|paytm|phonepe|google pay|paypal|payumoney|razorpay|card|cheque|wallet|mobile wallet)\b/.test(m)) intentScores.payment = (intentScores.payment || 0) + 2;

  // Delivery & Shipping
  if (/\b(deliver|delivery|shipping|dispatch|estimated|days|arrive|logistics|free shipping|ship|transit|transport|courier|fedex|dtdc|bluedart|ecom|india post|speedpost|express|fast delivery|same day|one day)\b/.test(m)) intentScores.delivery = (intentScores.delivery || 0) + 2;

  // Warranty
  if (/\bwarranty|guarantee|service center|service centre|repair|replacement guarantee|extended warranty|warranty period|warranty coverage|claim warranty|warranty claim\b/.test(m)) intentScores.warranty = (intentScores.warranty || 0) + 2;

  // Cart / Checkout
  if (/\b(cart|shopping cart|my cart|view cart|open cart|show cart|see cart|check cart|cart items|cart total)\b/.test(m)) intentScores.cart_checkout = (intentScores.cart_checkout || 0) + 2;
  if (/\b(checkout|place order|complete order|finish order|confirm order|proceed to pay|pay now|buy now|complete purchase|finish purchase|order now|buy all|purchase all)\b/.test(m)) intentScores.cart_checkout = (intentScores.cart_checkout || 0) + 2;

  // Price inquiry
  if (/\b(price|cost|how much|rate|value|amount|pricing|mrp|discount|deal|offer|cheap|expensive|affordable|budget)\b/.test(m)) intentScores.price_inquiry = (intentScores.price_inquiry || 0) + 1;

  // Stock / Availability
  if (/\b(stock|available|availability|in stock|out of stock|sold out|sold|left|remaining|inventory|quantity)\b/.test(m)) intentScores.stock_availability = (intentScores.stock_availability || 0) + 2;

  // Offers / Deals
  if (/\b(offer|deals|sale|discount|coupon|promo|promotion|voucher|code|special|limited time|flash deal|daily deal|weekly deal|combo|bundle|bogo|buy one|get one|free gift|freebie)\b/.test(m)) intentScores.offers_deals = (intentScores.offers_deals || 0) + 2;

  // Greeting
  if (words.some(w => SYNONYMS.greet.includes(w))) intentScores.greeting = (intentScores.greeting || 0) + 2;

  // Farewell
  if (words.some(w => SYNONYMS.bye.includes(w))) intentScores.farewell = (intentScores.farewell || 0) + 2;

  // Help
  if (/\b(help|assist|support|guide|how to|how do|what can you do|features|capabilities|menu|options|commands)\b/.test(m)) intentScores.help = (intentScores.help || 0) + 2;

  // About store
  if (/\b(about|who are you|what is techmart|techmart|store|shop|company|business|organization|organisation|firm|startup|who made|who built|who created|developer|team|founder|owner|ceo|cto)\b/.test(m)) intentScores.about = (intentScores.about || 0) + 2;
  if (/\b(contact|address|location|phone|email|website|social media|instagram|facebook|twitter|linkedin|youtube)\b/.test(m)) intentScores.about = (intentScores.about || 0) + 1;

  // Get highest scoring intent
  const sorted = Object.entries(intentScores).sort((a, b) => b[1] - a[1]);
  if (sorted.length > 0 && sorted[0][1] >= 2) return sorted[0][0];

  return 'general';
}

// ===== ACTION HANDLERS =====

function pluralizeCategory(cat) {
  const pluralMap = {
    cpu: 'CPUs', gpu: 'GPUs', ram: 'RAM', ssd: 'SSDs', motherboard: 'Motherboards',
    monitor: 'Monitors', keyboard: 'Keyboards', mouse: 'Mice', laptop: 'Laptops',
    headphone: 'Headphones', speaker: 'Speakers', light: 'Lights', webcam: 'Webcams',
    router: 'Routers', ups: 'UPS'
  };
  return pluralMap[cat] || cat.toUpperCase() + 'S';
}

function handleProductSearch(msg, entities) {
  let results = [...PRODUCTS];

  if (entities.category) results = results.filter(p => p.category === entities.category);
  if (entities.brand) results = results.filter(p => p.brand === entities.brand);
  if (entities.maxPrice) results = results.filter(p => p.price <= entities.maxPrice);
  if (entities.productId) {
    const exact = PRODUCTS.find(p => p.id === entities.productId);
    if (exact) results = [exact];
  }

  // Keyword search fallback
  if (!entities.category && !entities.maxPrice && !entities.productId) {
    const keywords = msg.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    results = results.filter(p =>
      keywords.some(k =>
        p.name.toLowerCase().includes(k) ||
        p.brand.toLowerCase().includes(k) ||
        p.category.includes(k) ||
        JSON.stringify(p.specs).toLowerCase().includes(k)
      )
    );
  }

  results = results.slice(0, 5);

  if (!results.length) {
    return { type: 'text', content: `😔 Sorry, I couldn't find any products matching your request. Try searching with different keywords, or <button class="chat-link" onclick="openChatWithMessage('Show all laptops')">browse all categories</button>.` };
  }

  const cat = entities.category ? pluralizeCategory(entities.category) : 'products';
  const priceNote = entities.maxPrice ? ` under ${formatPrice(entities.maxPrice)}` : '';
  const brandNote = entities.brand ? ` by ${entities.brand}` : '';
  return {
    type: 'products',
    intro: `🔍 Found <strong>${results.length} ${cat}</strong>${brandNote}${priceNote}:`,
    products: results
  };
}

function handleRecommend(msg, entities) {
  const useCase = entities.useCase;
  const maxPrice = entities.maxPrice;
  const brand = entities.brand;
  let recs = [];
  let title = '';

  if (useCase === 'gaming') {
    if (entities.category === 'laptop') {
      recs = PRODUCTS.filter(p => p.category === 'laptop' && (p.name.toLowerCase().includes('rog') || p.name.toLowerCase().includes('katana') || p.name.toLowerCase().includes('g15') || p.name.toLowerCase().includes('nitro')));
      title = '🎮 Best Gaming Laptops';
    } else {
      recs = PRODUCTS.filter(p => p.category === 'gpu').sort((a, b) => b.rating - a.rating);
      title = '🎮 Best GPUs for Gaming';
    }
  } else if (useCase === 'programming' || useCase === 'work') {
    recs = PRODUCTS.filter(p => p.category === 'laptop' && (p.name.toLowerCase().includes('thinkpad') || p.name.toLowerCase().includes('vivobook') || p.name.toLowerCase().includes('pavilion') || p.brand === 'Lenovo'));
    title = '💻 Best Laptops for Programming/Work';
  } else if (useCase === 'student') {
    recs = PRODUCTS.filter(p => p.category === 'ssd' || p.category === 'laptop').sort((a, b) => a.price - b.price);
    title = '🎓 Best Products for Students';
  } else if (useCase === 'editing') {
    recs = PRODUCTS.filter(p => (p.category === 'cpu' || p.category === 'ram') && p.price > 10000).sort((a, b) => b.rating - a.rating);
    title = '🎬 Best Hardware for Video Editing';
  } else if (useCase === 'streaming') {
    recs = PRODUCTS.filter(p => p.category === 'cpu' || p.category === 'gpu').sort((a, b) => b.rating - a.rating);
    title = '📺 Best Hardware for Streaming';
  } else {
    if (entities.category) {
      recs = PRODUCTS.filter(p => p.category === entities.category).sort((a, b) => b.rating - a.rating);
      title = `⭐ Top Rated ${pluralizeCategory(entities.category)}`;
    } else {
      recs = PRODUCTS.filter(p => p.badge === 'best').slice(0, 4);
      title = '⭐ Our Best Sellers';
    }
  }

  if (brand) recs = recs.filter(p => p.brand === brand);
  if (maxPrice) recs = recs.filter(p => p.price <= maxPrice);
  recs = recs.slice(0, 4);

  if (!recs.length) return { type: 'text', content: '🤔 I couldn\'t find matching recommendations. Try specifying a category like laptop, GPU, or SSD.' };

  return {
    type: 'products',
    intro: `<strong>${title}</strong> — based on your requirements:`,
    products: recs
  };
}

function handleCompare(msg, entities) {
  const m = msg.toLowerCase();
  let prods = [];

  // More specific product keywords - order matters (more specific first)
  const productKeywords = [
    // NVIDIA GPUs - specific first
    { keywords: ['rtx 5060 ti', 'rtx5060 ti', '5060 ti', '5060ti'], match: 'RTX 5060 Ti' },
    { keywords: ['rtx 4070 super', 'rtx4070 super', '4070 super', '4070s'], match: 'RTX 4070 Super' },
    { keywords: ['rtx 4070', 'rtx4070', '4070'], match: 'RTX 4070' },
    { keywords: ['rtx 4060', 'rtx4060', '4060'], match: 'RTX 4060' },
    { keywords: ['rtx 4090', 'rtx4090', '4090'], match: 'RTX 4090' },
    { keywords: ['rtx 5060', 'rtx5060', '5060'], match: 'RTX 5060' },
    // AMD GPUs
    { keywords: ['rx 7900', 'rx7900', '7900'], match: 'RX 7900' },
    { keywords: ['rx 7600', 'rx7600', '7600'], match: 'RX 7600' },
    // AMD CPUs
    { keywords: ['ryzen 9', 'ryzen9'], match: 'Ryzen 9' },
    { keywords: ['ryzen 7', 'ryzen7'], match: 'Ryzen 7' },
    { keywords: ['ryzen 5', 'ryzen5'], match: 'Ryzen 5' },
    // Intel CPUs
    { keywords: ['core i9', 'i9-13900', 'i9'], match: 'i9' },
    { keywords: ['core i7', 'i7-13700', 'i7'], match: 'i7' },
    { keywords: ['core i5', 'i5-13600', 'i5'], match: 'i5' },
  ];

  // Find which products are mentioned
  for (const pk of productKeywords) {
    if (pk.keywords.some(k => m.includes(k))) {
      const found = PRODUCTS.find(p => p.name.includes(pk.match));
      if (found && !prods.find(x => x.id === found.id)) {
        prods.push(found);
      }
    }
  }

  // Deduplicate
  prods = prods.filter((p, i, self) => self.findIndex(q => q.id === p.id) === i);

  // If we still don't have 2, try matching by product name words
  if (prods.length < 2) {
    for (const p of PRODUCTS) {
      const nameLower = p.name.toLowerCase();
      const words = nameLower.split(/[\s-]+/).filter(w => w.length > 3);
      const matchCount = words.filter(w => m.includes(w)).length;
      if (matchCount >= 2 && !prods.find(x => x.id === p.id)) {
        prods.push(p);
        if (prods.length >= 2) break;
      }
    }
  }

  if (prods.length < 2) {
    return { type: 'text', content: '🤔 Please specify two products to compare. For example: <em>"Compare RTX 4060 vs RTX 5060 Ti"</em> or <em>"Compare Ryzen 7 and i7"</em>' };
  }

  const p1 = prods[0], p2 = prods[1];
  const allKeys = [...new Set([...Object.keys(p1.specs), ...Object.keys(p2.specs)])];
  const winner = p1.rating >= p2.rating ? p1 : p2;

  return {
    type: 'compare',
    p1, p2, allKeys, winner
  };
}

function handleCompatibility(msg) {
  const m = msg.toLowerCase();
  let result = null;

  for (const entry of COMPATIBILITY) {
    if (m.includes(entry.cpu) && m.includes(entry.board)) {
      result = entry;
      break;
    }
  }

  if (!result) {
    for (const entry of COMPATIBILITY) {
      if (m.includes(entry.cpu) || m.includes(entry.board)) {
        result = entry;
        break;
      }
    }
  }

  if (!result) {
    return { type: 'text', content: `🔧 I need more details to check compatibility. Please mention both the CPU and motherboard, for example:\n<em>"Is Ryzen 5 5600 compatible with B550 motherboard?"</em>` };
  }

  const icon = result.result ? '✅' : '❌';
  const cls = result.result ? 'compat-yes' : 'compat-no';
  return {
    type: 'text',
    content: `<strong>🔧 Compatibility Check</strong><br/><br/><span class="${cls}">${icon} ${result.result ? 'COMPATIBLE' : 'NOT COMPATIBLE'}</span><br/><br/>${result.note}`
  };
}

function handleOrderTracking(msg, entities) {
  const m = msg.toLowerCase();
  let order = null;

  if (entities.orderId) {
    order = ORDERS.find(o => o.orderId.toLowerCase() === entities.orderId.toLowerCase());
  }
  if (!order) {
    return {
      type: 'order_form',
      content: '📦 Please enter your Order ID (e.g., TM10045) to track your order:'
    };
  }

  const statusMap = {
    'Processing': { steps: 1, icon: '⚙️', color: 'text-warning' },
    'Shipped': { steps: 2, icon: '🚚', color: 'text-info' },
    'Out for Delivery': { steps: 3, icon: '🏃', color: 'text-primary' },
    'Delivered': { steps: 4, icon: '✅', color: 'text-success' },
  };
  const info = statusMap[order.status] || statusMap['Processing'];

  return {
    type: 'order_status',
    order,
    info
  };
}

function handleReturnRefund() {
  return {
    type: 'text',
    content: `<strong>🔄 Return & Refund Policy</strong><br/><br/>
<strong>Eligibility:</strong><br/>
• Products can be returned within <strong>7 days</strong> of delivery<br/>
• Item must be unused, in original packaging<br/>
• All accessories and manuals included<br/><br/>
<strong>How to return:</strong><br/>
1️⃣ Initiate return via chatbot or website<br/>
2️⃣ Our team will schedule a pickup<br/>
3️⃣ Refund processed in <strong>5–7 business days</strong><br/><br/>
<strong>Non-returnable:</strong> Opened SSDs, RAM after installation<br/><br/>
Do you want to <button class="chat-link" onclick="openChatWithMessage('I want to initiate a return for my order')">initiate a return</button>?`
  };
}

function handleComplaint() {
  return {
    type: 'ticket_form',
    content: '🎫 I\'m sorry to hear that! Let me create a support ticket for you.'
  };
}

function handlePayment() {
  return {
    type: 'text',
    content: `<strong>💳 Payment Methods at TechMart AI</strong><br/><br/>
✅ <strong>UPI:</strong> GPay, PhonePe, Paytm, BHIM<br/>
✅ <strong>Credit/Debit Cards:</strong> Visa, Mastercard, RuPay<br/>
✅ <strong>Net Banking:</strong> All major Indian banks<br/>
✅ <strong>EMI:</strong> No-cost EMI on orders above ₹3000 (3/6/12 months)<br/>
✅ <strong>COD:</strong> Cash on Delivery (orders up to ₹10,000)<br/>
✅ <strong>Buy Now Pay Later:</strong> Simpl, ZestMoney, LazyPay<br/><br/>
🔒 All transactions are secured with 256-bit SSL encryption.`
  };
}

function handleDelivery() {
  return {
    type: 'text',
    content: `<strong>🚚 Delivery Information</strong><br/><br/>
📦 <strong>Standard Delivery:</strong> 3–5 business days<br/>
⚡ <strong>Express Delivery:</strong> 1–2 business days (+₹149)<br/>
🎯 <strong>Same Day:</strong> Available in Bengaluru, Mumbai, Delhi<br/><br/>
<strong>Shipping Charges:</strong><br/>
• Orders above ₹2,999 → <strong class="text-success">FREE Shipping</strong><br/>
• Orders below ₹2,999 → ₹99 shipping charge<br/><br/>
📍 We deliver to <strong>all 28 states & 8 UTs</strong> across India.`
  };
}

function handleWarranty() {
  return {
    type: 'text',
    content: `<strong>🛡️ Warranty Information</strong><br/><br/>
All products sold at TechMart AI come with manufacturer warranty:<br/><br/>
• <strong>CPUs:</strong> 3 Years<br/>
• <strong>GPUs:</strong> 3 Years<br/>
• <strong>RAM:</strong> Lifetime (Kingston, Corsair) / 5 Years<br/>
• <strong>SSDs:</strong> 3–5 Years<br/>
• <strong>Motherboards:</strong> 3 Years<br/>
• <strong>Monitors:</strong> 1–3 Years<br/>
• <strong>Laptops:</strong> 1 Year (Onsite/Carry-in)<br/>
• <strong>Keyboards/Mice:</strong> 1–2 Years<br/><br/>
For warranty claims, contact us at <strong>support@techmart.ai</strong> or use our chatbot.`
  };
}

function handleGreeting() {
  const greetings = [
    'Hello! 👋 Welcome to TechMart AI! I\'m your intelligent shopping assistant. I can help you find products, compare specs, track orders, and much more. What can I help you with today?',
    'Hi there! 😊 Great to have you here at TechMart AI! Are you looking for a new GPU, laptop, or any other hardware? Just ask me anything!',
    'Namaste! 🙏 Welcome to TechMart AI — India\'s smartest hardware store! How can I assist you today?',
    'Kem cho!!! Maja ma?(Paise haina??)' 
  ];
  return { type: 'text', content: greetings[Math.floor(Math.random() * greetings.length)] };
}

function handleFarewell() {
  const farewells = [
    'Thank you for chatting with me! 😊 Have a great day and happy shopping at TechMart AI! 🛒',
    'You\'re welcome! 🙏 Feel free to come back anytime you need help. Take care! 👋',
    'It was my pleasure helping you! 😊 Don\'t hesitate to reach out again. Have a wonderful day! 🌟',
  ];
  return { type: 'text', content: farewells[Math.floor(Math.random() * farewells.length)] };
}

function handleAbout() {
  return {
    type: 'text',
    content: `<strong>🏪 About TechMart AI</strong><br/><br/>
TechMart AI is India's leading online computer hardware store, powered by AI-driven assistance.<br/><br/>
📍 <strong>Location:</strong> Bengaluru, Karnataka<br/>
📞 <strong>Phone:</strong> +91 98765 43210<br/>
📧 <strong>Email:</strong> support@techmart.ai<br/>
🕒 <strong>Hours:</strong> Mon–Sat, 9AM–6PM IST<br/><br/>
We sell CPUs, GPUs, RAM, SSDs, Motherboards, Monitors, Keyboards, Mice & Laptops from all top brands.`
  };
}

function handleCartCheckout(msg) {
  const m = msg.toLowerCase();
  if (/\b(empty|clear|remove all|delete|reset)\b.*\b(cart|cart)\b/.test(m)) {
    return { type: 'text', content: '🗑️ To clear your cart, please open the cart and remove items individually. We\'re working on a one-click clear feature!' };
  }
  if (/\b(add all|add everything|buy everything|order everything|purchase everything)\b/.test(m)) {
    return { type: 'text', content: '🛒 To add products to your cart, please browse our products and click "Add" on the items you want. You can also use the search to find specific products!' };
  }
  return {
    type: 'text',
    content: `🛒 <strong>Cart & Checkout</strong><br/><br/>
You can manage your cart by clicking the cart icon in the navbar. Here's what you can do:<br/><br/>
• <strong>Add items:</strong> Browse products and click "Add"<br/>
• <strong>View cart:</strong> Click the cart icon in the navbar<br/>
• <strong>Checkout:</strong> Click "Checkout" in the cart to place your order<br/>
• <strong>Track order:</strong> Use your Order ID (e.g., TM10045) to track delivery<br/><br/>
Need help with anything specific?`
  };
}

function handlePriceInquiry(msg, entities) {
  const m = msg.toLowerCase();

  // Try to find specific product price
  if (!entities.category) {
    for (const p of PRODUCTS) {
      const nameWords = p.name.toLowerCase().split(' ').filter(w => w.length > 3);
      const matchCount = nameWords.filter(w => m.includes(w)).length;
      if (matchCount >= 2 || (nameWords.length >= 3 && matchCount >= 1)) {
        const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
        return {
          type: 'text',
          content: `💰 <strong>${p.name}</strong><br/><br/>
Price: <strong>${formatPrice(p.price)}</strong>${p.oldPrice ? ` <span style="text-decoration:line-through;color:var(--text-muted)">${formatPrice(p.oldPrice)}</span>` : ''}${discount ? ` <span class="text-success">(${discount}% off)</span>` : ''}<br/>
Brand: ${p.brand} | Rating: ${p.rating}⭐<br/>
Stock: <span class="${p.stock === 'In Stock' ? 'text-success' : p.stock === 'Low Stock' ? 'text-warning' : 'text-danger'}">${p.stock}</span><br/><br/>
<button class="chat-link" onclick="openChatWithMessage('Add ${p.name} to cart')">Add to cart</button>`
        };
      }
    }
  }

  if (entities.category) {
    const catProducts = PRODUCTS.filter(p => p.category === entities.category).sort((a, b) => a.price - b.price);
    if (catProducts.length) {
      const cheapest = catProducts[0];
      const mostExpensive = catProducts[catProducts.length - 1];
      return {
        type: 'text',
        content: `💰 <strong>${entities.category.toUpperCase()} Price Range</strong><br/><br/>
Starting from: <strong>${formatPrice(cheapest.price)}</strong> (${cheapest.name})<br/>
Up to: <strong>${formatPrice(mostExpensive.price)}</strong> (${mostExpensive.name})<br/><br/>
We have ${catProducts.length} ${entities.category.toUpperCase()} products available. <button class="chat-link" onclick="openChatWithMessage('Show all ${entities.category}s')">View all</button>`
      };
    }
  }

  return {
    type: 'text',
    content: '💰 Please mention the specific product or category you\'re asking about the price for. For example: <em>"Price of RTX 4070"</em> or <em>"How much is Ryzen 7 7700X?"</em>'
  };
}

function handleStockAvailability(msg, entities) {
  const m = msg.toLowerCase();

  if (entities.category) {
    const catProducts = PRODUCTS.filter(p => p.category === entities.category);
    const inStock = catProducts.filter(p => p.stock === 'In Stock');
    const lowStock = catProducts.filter(p => p.stock === 'Low Stock');
    const outOfStock = catProducts.filter(p => p.stock === 'Out of Stock');

    return {
      type: 'text',
      content: `📦 <strong>${entities.category.toUpperCase()} Stock Status</strong><br/><br/>
✅ <strong>In Stock:</strong> ${inStock.length} products<br/>
${lowStock.length ? `⚠️ <strong>Low Stock:</strong> ${lowStock.length} products<br/>` : ''}
${outOfStock.length ? `❌ <strong>Out of Stock:</strong> ${outOfStock.length} products<br/>` : ''}<br/>
<button class="chat-link" onclick="openChatWithMessage('Show ${entities.category} in stock')">View available products</button>`
    };
  }

  // Check specific product stock
  for (const p of PRODUCTS) {
    const nameWords = p.name.toLowerCase().split(' ').filter(w => w.length > 3);
    const matchCount = nameWords.filter(w => m.includes(w)).length;
    if (matchCount >= 2 || (nameWords.length >= 3 && matchCount >= 1)) {
      const stockClass = p.stock === 'In Stock' ? 'text-success' : p.stock === 'Low Stock' ? 'text-warning' : 'text-danger';
      return {
        type: 'text',
        content: `📦 <strong>${p.name}</strong><br/><br/>
Status: <span class="${stockClass}"><strong>${p.stock}</strong></span><br/>
Brand: ${p.brand} | Price: ${formatPrice(p.price)}<br/>
${p.stock === 'In Stock' ? '✅ Ready to ship!' : p.stock === 'Low Stock' ? '⚠️ Order soon, limited stock!' : '❌ Currently unavailable. <button class="chat-link" onclick="openChatWithMessage(\'Show similar ' + p.category + ' products\')">View alternatives</button>'}`
      };
    }
  }

  return {
    type: 'text',
    content: '📦 Please specify the product or category you want to check stock for. For example: <em>"Is RTX 4070 in stock?"</em> or <em>"Laptop stock status"</em>'
  };
}

function handleOffersDeals() {
  return {
    type: 'text',
    content: `<strong>🔥 Current Offers & Deals</strong><br/>
Use code <strong>TECHMART10</strong> for 10% off on all products!<br/><br/>
🏷️ <strong>Top Deals:</strong><br/>
• NVIDIA RTX 4060 → <strong class="text-success">14% OFF</strong><br/>
• WD Black SN770 1TB → <strong class="text-success">31% OFF</strong><br/>
• HP Pavilion Gaming → <strong class="text-success">18% OFF</strong><br/>
• Corsair K70 RGB → <strong class="text-success">25% OFF</strong><br/>
• Kingston Fury DDR4 → <strong class="text-success">30% OFF</strong><br/>
• Logitech G Pro X → <strong class="text-success">21% OFF</strong><br/><br/>
🎁 <strong>Free Shipping</strong> on orders above ₹2,999<br/>
💳 <strong>No-cost EMI</strong> available on orders above ₹3,000`
  };
}

function handleHelp() {
  return {
    type: 'text',
    content: `<strong>🤖 TechMart AI Assistant</strong><br/>
I'm here to help you with anything related to TechMart! Here's what I can do:<br/><br/>
🔍 <strong>Find Products</strong> — "Show gaming laptops under ₹60000"<br/>
⭐ <strong>Recommend</strong> — "Best GPU for gaming"<br/>
⚡ <strong>Compare</strong> — "Compare RTX 4060 vs RTX 5060 Ti"<br/>
💰 <strong>Price Check</strong> — "Price of Ryzen 7 7700X"<br/>
📦 <strong>Stock Status</strong> — "Is RTX 4070 in stock?"<br/>
🔥 <strong>Offers & Deals</strong> — "Any ongoing offers?"<br/>
🔧 <strong>Compatibility</strong> — "Is Ryzen 7 compatible with B650?"<br/>
📦 <strong>Track Order</strong> — "Track my order TM10045"<br/>
🔄 <strong>Returns</strong> — "I want to return my product"<br/>
💳 <strong>Payment</strong> — "What payment methods are available?"<br/>
🚚 <strong>Delivery</strong> — "How many days for delivery?"<br/>
🛡️ <strong>Warranty</strong> — "What's the warranty on laptops?"<br/>
🏪 <strong>About Us</strong> — "Tell me about TechMart"<br/><br/>
<strong>Categories:</strong> Laptops, GPUs, CPUs, RAM, SSDs, Motherboards, Monitors, Keyboards, Mice, Headphones, Speakers, Lights, Webcams, Routers, UPS<br/><br/>
Just type your question in natural language — I understand typos and casual language too! 😊`
  };
}

function handleGeneral(msg) {
  const m = msg.toLowerCase();

  // Price-related
  if (/\b(price|cost|how much|rate|value|amount|pricing|mrp|discount|deal|offer|cheap|expensive|affordable|budget)\b/.test(m)) {
    return handlePriceInquiry(msg, {});
  }

  // Category mentioned
  const cats = ['laptop', 'gpu', 'cpu', 'ssd', 'ram', 'motherboard', 'monitor', 'keyboard', 'mouse', 'headphone', 'speaker', 'light', 'webcam', 'router', 'ups'];
  for (const cat of cats) {
    if (m.includes(cat)) {
      return handleProductSearch(msg, { category: cat });
    }
  }

  // Brand mentioned
  const brands = ['nvidia', 'amd', 'intel', 'asus', 'msi', 'hp', 'lenovo', 'dell', 'samsung', 'lg', 'corsair', 'logitech', 'razer', 'kingston', 'wd', 'gigabyte', 'steelseries', 'keychron'];
  for (const brand of brands) {
    if (m.includes(brand)) {
      return handleProductSearch(msg, { brand: brand.charAt(0).toUpperCase() + brand.slice(1) });
    }
  }

  // Specific product names
  const productKeywords = ['rtx', 'ryzen', 'core', 'geforce', 'radeon', 'gtx', 'ddr4', 'ddr5', 'nvme', 'rog', 'thinkpad', 'katana', 'pavilion', 'nitro', 'ideapad', 'g15', 'g16'];
  for (const kw of productKeywords) {
    if (m.includes(kw)) {
      return handleProductSearch(msg, {});
    }
  }

  // Question words
  if (/\b(what|which|how|where|when|why|who|can|could|would|should|is|are|do|does|did|will)\b/.test(m)) {
    return {
      type: 'text',
      content: `🤖 I'm not sure I understood that correctly. Here's what I can help with:<br/><br/>
🔍 <strong>Find Products</strong> — "Show gaming laptops under ₹60000"<br/>
⭐ <strong>Recommend</strong> — "Best GPU for gaming"<br/>
⚡ <strong>Compare</strong> — "Compare RTX 4060 vs RTX 5060"<br/>
📦 <strong>Track Order</strong> — "Track my order TM10045"<br/>
🔄 <strong>Returns</strong> — "I want to return my product"<br/>
💳 <strong>Payment</strong> — "What payment methods are available?"<br/><br/>
Try asking in a different way, or type <em>"help</em> to see all options!`
    };
  }

  // Default response
  return {
    type: 'text',
    content: `🤖 I'm here to help! Here's what I can do:<br/><br/>
🔍 <strong>Find Products</strong> — "Show gaming laptops under ₹60000"<br/>
⭐ <strong>Recommend</strong> — "Best GPU for gaming"<br/>
⚡ <strong>Compare</strong> — "Compare RTX 4060 vs RTX 5060"<br/>
🔧 <strong>Compatibility</strong> — "Is Ryzen 7 compatible with B650?"<br/>
📦 <strong>Track Order</strong> — "Track my order TM10045"<br/>
🔄 <strong>Returns</strong> — "I want to return my product"<br/>
💳 <strong>Payment</strong> — "What payment methods are available?"<br/><br/>
What would you like help with?`
  };
}

// ===== MAIN CHAT PROCESSOR =====
export async function processMessage(msg) {
  const intent = classifyIntent(msg);
  const entities = extractEntities(msg);

  // Simulate network delay (as if calling Flask backend)
  await new Promise(r => setTimeout(r, 600 + Math.random() * 600));

  switch (intent) {
    case 'product_search': return handleProductSearch(msg, entities);
    case 'recommend': return handleRecommend(msg, entities);
    case 'compare': return handleCompare(msg, entities);
    case 'compatibility': return handleCompatibility(msg);
    case 'track_order': return handleOrderTracking(msg, entities);
    case 'return_refund': return handleReturnRefund();
    case 'complaint': return handleComplaint();
    case 'payment': return handlePayment();
    case 'delivery': return handleDelivery();
    case 'warranty': return handleWarranty();
    case 'greeting': return handleGreeting();
    case 'farewell': return handleFarewell();
    case 'about': return handleAbout();
    case 'help': return handleHelp();
    case 'cart_checkout': return handleCartCheckout(msg);
    case 'price_inquiry': return handlePriceInquiry(msg, entities);
    case 'stock_availability': return handleStockAvailability(msg, entities);
    case 'offers_deals': return handleOffersDeals();
    default: return handleGeneral(msg);
  }
}
