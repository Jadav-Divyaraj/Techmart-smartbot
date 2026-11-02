// ===== TECHMART AI - PRODUCT DATABASE =====
// Simulates the backend SQLite database in the frontend

// Real product images from Unsplash/Pexels
const IMG = {
  // CPUs
  ryzen5600x:    'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop',
  i513600k:      'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop',
  ryzen7700x:    'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400&h=300&fit=crop',
  i913900k:      'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400&h=300&fit=crop',
  ryzen5760:     'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop',
  // GPUs
  rtx4060:       'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop',
  rtx4070s:      'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop',
  rx7600:        'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop',
  rtx5060ti:     'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop',
  rtx4090:       'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop',
  // RAM
  corsairDdr5:   'https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=400&h=300&fit=crop',
  gskillRgb:     'https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=400&h=300&fit=crop',
  kingstonDdr4:  'https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=400&h=300&fit=crop',
  corsair64gb:   'https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=400&h=300&fit=crop',
  // SSDs
  samsung870:    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop',
  wdSn770:       'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop',
  samsung990:    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop',
  kingstonA400:  'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop',
  // Motherboards
  asusB650:      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
  msiB660:       'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
  gigabyteB550:  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
  asusZ790:      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
  // Monitors
  lg27gp850:     'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop',
  samsungG5:     'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop',
  asusTuf27:     'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop',
  dellS2722:     'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop',
  // Keyboards
  corsairK70:    'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=300&fit=crop',
  logitechProX:  'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=300&fit=crop',
  keychronK2:    'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=300&fit=crop',
  razerBwV4:     'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=300&fit=crop',
  // Mice
  logitechSuper: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
  razerDaV3:     'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
  steelRival5:   'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
  asusRogGlad:   'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
  // Laptops
  asusRogG15:    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
  msiKatana15:   'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
  hpPavilion:    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
  lenovoThink:   'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
  asusVivo:      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
  dellG15:       'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
  acerNitro5:    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
  lenovoIdea:    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
  // Headphones
  SonyWh1000xm5: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
  airPodsPro:    'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=300&fit=crop',
  boseQuiet:     'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop',
  razerBlack:    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=300&fit=crop',
  // Speakers
  jblFlip6:      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop',
 Marshall:      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=300&fit=crop',
  sonosOne:      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  boseSound:     'https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&h=300&fit=crop',
  // Lights
  philipsHue:    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  nanoleaf:      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=300&fit=crop',
  logitechG:     'https://images.unsplash.com/photo-1565636192335-f2e4b8f9c0a9?w=400&h=300&fit=crop',
  corsairLx:     'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=300&fit=crop',
  // Webcams
  logitechC920:  'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=300&fit=crop',
  elgatoFace:    'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop',
  // Routers
  asusRt:        'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop',
  tpLinkArcher:  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  // UPS
  apcUps:        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  cyberPower:    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
};

export const PRODUCTS = [
  // ===== CPUs =====
  { id: 1, category: 'cpu', brand: 'AMD', name: 'AMD Ryzen 5 5600X', price: 14999, oldPrice: 19999, rating: 4.7, reviews: 2341, stock: 'In Stock', badge: 'hot', emoji: '💻', img: IMG.ryzen5600x, specs: { Cores: '6C/12T', Speed: '3.7 GHz (4.6 Boost)', TDP: '65W', Socket: 'AM4', Cache: '32MB L3' }, desc: 'Best mid-range gaming CPU with PCIe 4.0 support.' },
  { id: 2, category: 'cpu', brand: 'Intel', name: 'Intel Core i5-13600K', price: 21999, oldPrice: 27999, rating: 4.8, reviews: 1876, stock: 'In Stock', badge: 'best', emoji: '💻', img: IMG.i513600k, specs: { Cores: '14C/20T', Speed: '3.5 GHz (5.1 Boost)', TDP: '125W', Socket: 'LGA1700', Cache: '24MB L3' }, desc: 'Exceptional gaming & productivity CPU.' },
  { id: 3, category: 'cpu', brand: 'AMD', name: 'AMD Ryzen 7 7700X', price: 29999, oldPrice: 36999, rating: 4.9, reviews: 987, stock: 'In Stock', badge: 'new', emoji: '💻', img: IMG.ryzen7700x, specs: { Cores: '8C/16T', Speed: '4.5 GHz (5.4 Boost)', TDP: '105W', Socket: 'AM5', Cache: '32MB L3' }, desc: 'Top-tier gaming CPU for AM5 platform.' },
  { id: 4, category: 'cpu', brand: 'Intel', name: 'Intel Core i9-13900K', price: 54999, oldPrice: 64999, rating: 4.9, reviews: 652, stock: 'Low Stock', badge: 'best', emoji: '💻', img: IMG.i913900k, specs: { Cores: '24C/32T', Speed: '3.0 GHz (5.8 Boost)', TDP: '125W', Socket: 'LGA1700', Cache: '36MB L3' }, desc: 'Fastest consumer desktop CPU available.' },
  { id: 5, category: 'cpu', brand: 'AMD', name: 'AMD Ryzen 5 7600', price: 17999, oldPrice: 21999, rating: 4.6, reviews: 1432, stock: 'In Stock', badge: 'sale', emoji: '💻', img: IMG.ryzen5760, specs: { Cores: '6C/12T', Speed: '3.8 GHz (5.1 Boost)', TDP: '65W', Socket: 'AM5', Cache: '32MB L3' }, desc: 'Value king for AM5 platform.' },

  // ===== GPUs =====
  { id: 6, category: 'gpu', brand: 'NVIDIA', name: 'NVIDIA RTX 4060', price: 29999, oldPrice: 34999, rating: 4.7, reviews: 3241, stock: 'In Stock', badge: 'hot', emoji: '🖥️', img: IMG.rtx4060, specs: { VRAM: '8GB GDDR6', Cores: '3072 CUDA', TDP: '115W', Interface: 'PCIe 4.0', Output: 'HDMI 2.1, 3x DP' }, desc: 'Best 1080p gaming GPU with DLSS 3.' },
  { id: 7, category: 'gpu', brand: 'NVIDIA', name: 'NVIDIA RTX 4070 Super', price: 49999, oldPrice: 57999, rating: 4.9, reviews: 1876, stock: 'In Stock', badge: 'best', emoji: '🖥️', img: IMG.rtx4070s, specs: { VRAM: '12GB GDDR6X', Cores: '7168 CUDA', TDP: '220W', Interface: 'PCIe 4.0', Output: 'HDMI 2.1, 3x DP' }, desc: 'Excellent 1440p and 4K gaming GPU.' },
  { id: 8, category: 'gpu', brand: 'AMD', name: 'AMD Radeon RX 7600', price: 24999, oldPrice: 29999, rating: 4.5, reviews: 1243, stock: 'In Stock', badge: 'sale', emoji: '🖥️', img: IMG.rx7600, specs: { VRAM: '8GB GDDR6', Cores: '2048 SPs', TDP: '165W', Interface: 'PCIe 4.0', Output: 'HDMI 2.1, 3x DP' }, desc: 'Great 1080p GPU with FSR 3 support.' },
  { id: 9, category: 'gpu', brand: 'NVIDIA', name: 'NVIDIA RTX 5060 Ti', price: 42999, oldPrice: 49999, rating: 4.8, reviews: 876, stock: 'In Stock', badge: 'new', emoji: '🖥️', img: IMG.rtx5060ti, specs: { VRAM: '16GB GDDR7', Cores: '4608 CUDA', TDP: '180W', Interface: 'PCIe 5.0', Output: 'HDMI 2.1a, 3x DP 2.1' }, desc: 'Next-gen architecture with massive VRAM.' },
  { id: 10, category: 'gpu', brand: 'NVIDIA', name: 'NVIDIA RTX 4090', price: 149999, oldPrice: 169999, rating: 5.0, reviews: 342, stock: 'Low Stock', badge: 'best', emoji: '🖥️', img: IMG.rtx4090, specs: { VRAM: '24GB GDDR6X', Cores: '16384 CUDA', TDP: '450W', Interface: 'PCIe 4.0', Output: 'HDMI 2.1, 3x DP' }, desc: 'The ultimate graphics card for 4K gaming.' },

  // ===== RAM =====
  { id: 11, category: 'ram', brand: 'Corsair', name: 'Corsair Vengeance DDR5 32GB', price: 8999, oldPrice: 11999, rating: 4.8, reviews: 2341, stock: 'In Stock', badge: 'hot', emoji: '🔋', img: IMG.corsairDdr5, specs: { Capacity: '32GB (2x16GB)', Speed: 'DDR5-5600', Latency: 'CL36', Type: 'DDR5', Voltage: '1.25V' }, desc: 'High-speed DDR5 RAM for next-gen builds.' },
  { id: 12, category: 'ram', brand: 'G.Skill', name: 'G.Skill Trident Z5 RGB 16GB', price: 5999, oldPrice: 7999, rating: 4.7, reviews: 1876, stock: 'In Stock', badge: 'sale', emoji: '🔋', img: IMG.gskillRgb, specs: { Capacity: '16GB (2x8GB)', Speed: 'DDR5-6000', Latency: 'CL30', Type: 'DDR5', Voltage: '1.35V' }, desc: 'Premium RGB DDR5 for enthusiast systems.' },
  { id: 13, category: 'ram', brand: 'Kingston', name: 'Kingston Fury Beast DDR4 16GB', price: 3499, oldPrice: 4999, rating: 4.6, reviews: 3241, stock: 'In Stock', badge: 'best', emoji: '🔋', img: IMG.kingstonDdr4, specs: { Capacity: '16GB (2x8GB)', Speed: 'DDR4-3200', Latency: 'CL16', Type: 'DDR4', Voltage: '1.35V' }, desc: 'Reliable DDR4 for budget & mid-range builds.' },
  { id: 14, category: 'ram', brand: 'Corsair', name: 'Corsair Dominator Platinum 64GB', price: 18999, oldPrice: 22999, rating: 4.9, reviews: 432, stock: 'In Stock', badge: 'new', emoji: '🔋', img: IMG.corsair64gb, specs: { Capacity: '64GB (2x32GB)', Speed: 'DDR5-6000', Latency: 'CL30', Type: 'DDR5', Voltage: '1.40V' }, desc: 'Max capacity RAM for creators and workstations.' },

  // ===== SSDs =====
  { id: 15, category: 'ssd', brand: 'Samsung', name: 'Samsung 870 EVO 500GB', price: 3999, oldPrice: 5499, rating: 4.8, reviews: 5672, stock: 'In Stock', badge: 'best', emoji: '💾', img: IMG.samsung870, specs: { Capacity: '500GB', Type: 'SATA SSD', Read: '560 MB/s', Write: '530 MB/s', Interface: 'SATA III' }, desc: 'Most reliable SATA SSD for budget builds.' },
  { id: 16, category: 'ssd', brand: 'WD', name: 'WD Black SN770 1TB NVMe', price: 5499, oldPrice: 7999, rating: 4.9, reviews: 3241, stock: 'In Stock', badge: 'hot', emoji: '💾', img: IMG.wdSn770, specs: { Capacity: '1TB', Type: 'NVMe SSD', Read: '5150 MB/s', Write: '4900 MB/s', Interface: 'PCIe 4.0 x4' }, desc: 'Blazing-fast NVMe SSD for gaming & work.' },
  { id: 17, category: 'ssd', brand: 'Samsung', name: 'Samsung 990 Pro 2TB NVMe', price: 11999, oldPrice: 14999, rating: 4.9, reviews: 1432, stock: 'In Stock', badge: 'new', emoji: '💾', img: IMG.samsung990, specs: { Capacity: '2TB', Type: 'NVMe SSD', Read: '7450 MB/s', Write: '6900 MB/s', Interface: 'PCIe 4.0 x4' }, desc: 'Top-tier NVMe for professionals and gamers.' },
  { id: 18, category: 'ssd', brand: 'Kingston', name: 'Kingston A400 240GB SATA', price: 1999, oldPrice: 2999, rating: 4.4, reviews: 8765, stock: 'In Stock', badge: 'sale', emoji: '💾', img: IMG.kingstonA400, specs: { Capacity: '240GB', Type: 'SATA SSD', Read: '500 MB/s', Write: '350 MB/s', Interface: 'SATA III' }, desc: 'Entry-level SSD for budget upgrades.' },

  // ===== MOTHERBOARDS =====
  { id: 19, category: 'motherboard', brand: 'ASUS', name: 'ASUS ROG Strix B650E-F', price: 24999, oldPrice: 29999, rating: 4.8, reviews: 876, stock: 'In Stock', badge: 'best', emoji: '🔌', img: IMG.asusB650, specs: { Socket: 'AM5', Chipset: 'B650E', RAM: 'DDR5 (4x)', PCIe: 'PCIe 5.0 x16', Form: 'ATX' }, desc: 'Premium AM5 board with PCIe 5.0 support.' },
  { id: 20, category: 'motherboard', brand: 'MSI', name: 'MSI MAG B660M Mortar WiFi', price: 13999, oldPrice: 17999, rating: 4.7, reviews: 1243, stock: 'In Stock', badge: 'hot', emoji: '🔌', img: IMG.msiB660, specs: { Socket: 'LGA1700', Chipset: 'B660M', RAM: 'DDR4 (4x)', PCIe: 'PCIe 4.0 x16', Form: 'mATX' }, desc: 'Excellent mid-range Intel motherboard.' },
  { id: 21, category: 'motherboard', brand: 'Gigabyte', name: 'Gigabyte B550 AORUS Elite', price: 12999, oldPrice: 15999, rating: 4.6, reviews: 2134, stock: 'In Stock', badge: 'sale', emoji: '🔌', img: IMG.gigabyteB550, specs: { Socket: 'AM4', Chipset: 'B550', RAM: 'DDR4 (4x)', PCIe: 'PCIe 4.0 x16', Form: 'ATX' }, desc: 'Solid AM4 board for Ryzen 5000 series.' },
  { id: 22, category: 'motherboard', brand: 'ASUS', name: 'ASUS Prime Z790-P WiFi', price: 18999, oldPrice: 23999, rating: 4.7, reviews: 654, stock: 'In Stock', badge: 'new', emoji: '🔌', img: IMG.asusZ790, specs: { Socket: 'LGA1700', Chipset: 'Z790', RAM: 'DDR5 (4x)', PCIe: 'PCIe 5.0 x16', Form: 'ATX' }, desc: 'High-end Intel Z790 board with DDR5 support.' },

  // ===== MONITORS =====
  { id: 23, category: 'monitor', brand: 'LG', name: 'LG 27GP850-B 27" QHD 165Hz', price: 26999, oldPrice: 33999, rating: 4.9, reviews: 2341, stock: 'In Stock', badge: 'best', emoji: '🖥️', img: IMG.lg27gp850, specs: { Size: '27 inch', Resolution: '2560×1440 QHD', Panel: 'IPS', RefreshRate: '165Hz', ResponseTime: '1ms GtG' }, desc: 'Best gaming monitor for 1440p gaming.' },
  { id: 24, category: 'monitor', brand: 'Samsung', name: 'Samsung Odyssey G5 32" WQHD', price: 22999, oldPrice: 28999, rating: 4.7, reviews: 1876, stock: 'In Stock', badge: 'hot', emoji: '🖥️', img: IMG.samsungG5, specs: { Size: '32 inch', Resolution: '2560×1440 WQHD', Panel: 'VA', RefreshRate: '144Hz', ResponseTime: '1ms MPRT' }, desc: 'Curved gaming monitor with deep blacks.' },
  { id: 25, category: 'monitor', brand: 'ASUS', name: 'ASUS TUF Gaming VG27AQ', price: 24999, oldPrice: 29999, rating: 4.8, reviews: 1432, stock: 'In Stock', badge: 'sale', emoji: '🖥️', img: IMG.asusTuf27, specs: { Size: '27 inch', Resolution: '2560×1440 QHD', Panel: 'IPS', RefreshRate: '165Hz', ResponseTime: '1ms' }, desc: 'Excellent QHD gaming monitor for all setups.' },
  { id: 26, category: 'monitor', brand: 'Dell', name: 'Dell S2722DGM 27" 165Hz', price: 19999, oldPrice: 24999, rating: 4.6, reviews: 987, stock: 'In Stock', badge: 'new', emoji: '🖥️', img: IMG.dellS2722, specs: { Size: '27 inch', Resolution: '2560×1440', Panel: 'VA', RefreshRate: '165Hz', ResponseTime: '1ms MPRT' }, desc: 'Affordable QHD monitor from Dell.' },

  // ===== KEYBOARDS =====
  { id: 27, category: 'keyboard', brand: 'Corsair', name: 'Corsair K70 RGB Mechanical', price: 8999, oldPrice: 11999, rating: 4.8, reviews: 4532, stock: 'In Stock', badge: 'best', emoji: '⌨️', img: IMG.corsairK70, specs: { Type: 'Mechanical', Switch: 'Cherry MX Red', Backlight: 'RGB', Layout: 'Full Size', Connection: 'USB-A' }, desc: 'Premium mechanical gaming keyboard.' },
  { id: 28, category: 'keyboard', brand: 'Logitech', name: 'Logitech G Pro X TKL', price: 7499, oldPrice: 9999, rating: 4.7, reviews: 3241, stock: 'In Stock', badge: 'hot', emoji: '⌨️', img: IMG.logitechProX, specs: { Type: 'Mechanical', Switch: 'GX Red Linear', Backlight: 'RGB', Layout: 'TKL', Connection: 'USB-A' }, desc: 'Pro gaming TKL keyboard used by esports pros.' },
  { id: 29, category: 'keyboard', brand: 'Keychron', name: 'Keychron K2 Hot-Swap', price: 5499, oldPrice: 6999, rating: 4.9, reviews: 2341, stock: 'In Stock', badge: 'new', emoji: '⌨️', img: IMG.keychronK2, specs: { Type: 'Mechanical', Switch: 'Gateron Red (Hot-swap)', Backlight: 'RGB', Layout: '75%', Connection: 'USB-C / BT 5.1' }, desc: 'Best budget mechanical keyboard with hot-swap.' },
  { id: 30, category: 'keyboard', brand: 'Razer', name: 'Razer BlackWidow V4', price: 9999, oldPrice: 12999, rating: 4.6, reviews: 1876, stock: 'In Stock', badge: 'sale', emoji: '⌨️', img: IMG.razerBwV4, specs: { Type: 'Mechanical', Switch: 'Razer Green Clicky', Backlight: 'RGB', Layout: 'Full Size', Connection: 'USB-A' }, desc: 'Razer flagship mechanical keyboard with tactile feel.' },

  // ===== MICE =====
  { id: 31, category: 'mouse', brand: 'Logitech', name: 'Logitech G Pro X Superlight 2', price: 10999, oldPrice: 13999, rating: 4.9, reviews: 5432, stock: 'In Stock', badge: 'best', emoji: '🖱️', img: IMG.logitechSuper, specs: { DPI: '100–32000', Weight: '60g', Sensor: 'HERO 2 25K', Buttons: '5', Connection: 'USB Wireless' }, desc: 'Lightest wireless gaming mouse for pros.' },
  { id: 32, category: 'mouse', brand: 'Razer', name: 'Razer DeathAdder V3 HyperSpeed', price: 5999, oldPrice: 7999, rating: 4.8, reviews: 3241, stock: 'In Stock', badge: 'hot', emoji: '🖱️', img: IMG.razerDaV3, specs: { DPI: '100–26000', Weight: '75g', Sensor: 'Focus Pro 30K', Buttons: '6', Connection: 'USB Wireless' }, desc: 'Ergonomic wireless mouse with legendary sensor.' },
  { id: 33, category: 'mouse', brand: 'SteelSeries', name: 'SteelSeries Rival 5', price: 3999, oldPrice: 5499, rating: 4.7, reviews: 1876, stock: 'In Stock', badge: 'sale', emoji: '🖱️', img: IMG.steelRival5, specs: { DPI: '100–18000', Weight: '85g', Sensor: 'TrueMove Air', Buttons: '9', Connection: 'USB Wired' }, desc: 'Versatile wired gaming mouse with 9 buttons.' },
  { id: 34, category: 'mouse', brand: 'ASUS', name: 'ASUS ROG Gladius III AimPoint', price: 6499, oldPrice: 8499, rating: 4.8, reviews: 987, stock: 'In Stock', badge: 'new', emoji: '🖱️', img: IMG.asusRogGlad, specs: { DPI: '100–36000', Weight: '79g', Sensor: 'ROG AimPoint', Buttons: '6', Connection: 'USB Wired/Wireless' }, desc: 'High-precision gaming mouse with hot-swap buttons.' },

  // ===== LAPTOPS =====
  { id: 35, category: 'laptop', brand: 'ASUS', name: 'ASUS ROG Strix G15 (Ryzen 9)', price: 89999, oldPrice: 109999, rating: 4.8, reviews: 2341, stock: 'In Stock', badge: 'best', emoji: '💼', img: IMG.asusRogG15, specs: { CPU: 'AMD Ryzen 9 7945HX', GPU: 'RTX 4070', RAM: '16GB DDR5', Storage: '1TB NVMe', Display: '15.6" 240Hz FHD' }, desc: 'Top gaming laptop for serious gamers.' },
  { id: 36, category: 'laptop', brand: 'MSI', name: 'MSI Katana 15 (i7 + RTX 4060)', price: 69999, oldPrice: 84999, rating: 4.7, reviews: 1876, stock: 'In Stock', badge: 'hot', emoji: '💼', img: IMG.msiKatana15, specs: { CPU: 'Intel Core i7-13620H', GPU: 'RTX 4060', RAM: '16GB DDR5', Storage: '512GB NVMe', Display: '15.6" 144Hz FHD' }, desc: 'Best mid-range gaming laptop under ₹70000.' },
  { id: 37, category: 'laptop', brand: 'HP', name: 'HP Pavilion Gaming 15 (i5)', price: 52999, oldPrice: 64999, rating: 4.5, reviews: 3241, stock: 'In Stock', badge: 'sale', emoji: '💼', img: IMG.hpPavilion, specs: { CPU: 'Intel Core i5-12500H', GPU: 'RTX 3050', RAM: '8GB DDR4', Storage: '512GB SSD', Display: '15.6" 144Hz FHD' }, desc: 'Budget gaming laptop with great display.' },
  { id: 38, category: 'laptop', brand: 'Lenovo', name: 'Lenovo ThinkPad E15 (Ryzen 7)', price: 58999, oldPrice: 72999, rating: 4.7, reviews: 2134, stock: 'In Stock', badge: 'new', emoji: '💼', img: IMG.lenovoThink, specs: { CPU: 'AMD Ryzen 7 5700U', GPU: 'Radeon Vega 8', RAM: '16GB DDR4', Storage: '512GB NVMe', Display: '15.6" FHD IPS' }, desc: 'Perfect laptop for programming and business.' },
  { id: 39, category: 'laptop', brand: 'ASUS', name: 'ASUS VivoBook 15 (Ryzen 5)', price: 44999, oldPrice: 54999, rating: 4.4, reviews: 4321, stock: 'In Stock', badge: 'sale', emoji: '💼', img: IMG.asusVivo, specs: { CPU: 'AMD Ryzen 5 5500U', GPU: 'AMD Radeon', RAM: '8GB DDR4', Storage: '512GB SSD', Display: '15.6" FHD' }, desc: 'Slim everyday laptop for students.' },
  { id: 40, category: 'laptop', brand: 'Dell', name: 'Dell G15 Gaming (i7 + RTX 4060)', price: 74999, oldPrice: 89999, rating: 4.8, reviews: 1432, stock: 'In Stock', badge: 'hot', emoji: '💼', img: IMG.dellG15, specs: { CPU: 'Intel Core i7-13650HX', GPU: 'RTX 4060', RAM: '16GB DDR5', Storage: '512GB NVMe', Display: '15.6" 165Hz FHD' }, desc: 'Dell gaming powerhouse with great thermals.' },
  { id: 41, category: 'laptop', brand: 'Acer', name: 'Acer Nitro 5 (Ryzen 5 + RTX 3050)', price: 54999, oldPrice: 65999, rating: 4.5, reviews: 2876, stock: 'In Stock', badge: 'sale', emoji: '💼', img: IMG.acerNitro5, specs: { CPU: 'AMD Ryzen 5 7535HS', GPU: 'RTX 3050', RAM: '8GB DDR5', Storage: '512GB NVMe', Display: '15.6" 144Hz FHD' }, desc: 'Best entry-level gaming laptop with RTX.' },
  { id: 42, category: 'laptop', brand: 'Lenovo', name: 'Lenovo IdeaPad Gaming 3 (i5)', price: 56999, oldPrice: 68999, rating: 4.6, reviews: 1987, stock: 'Low Stock', badge: 'new', emoji: '💼', img: IMG.lenovoIdea, specs: { CPU: 'Intel Core i5-12450H', GPU: 'RTX 3050 Ti', RAM: '8GB DDR4', Storage: '512GB SSD', Display: '15.6" 120Hz FHD' }, desc: 'Gaming on a budget with Intel Arc graphics.' },

  // ===== HEADPHONES =====
  { id: 43, category: 'headphone', brand: 'Sony', name: 'Sony WH-1000XM5', price: 24999, oldPrice: 29999, rating: 4.9, reviews: 8765, stock: 'In Stock', badge: 'best', emoji: '🎧', img: IMG.sonyWh1000xm5, specs: { Type: 'Over-ear', ANC: 'Yes (Industry-leading)', Battery: '30 hrs', Driver: '30mm', Connection: 'Bluetooth 5.2 + 3.5mm' }, desc: 'Best noise-cancelling headphones in the world.' },
  { id: 44, category: 'headphone', brand: 'Apple', name: 'Apple AirPods Pro 2', price: 20999, oldPrice: 24999, rating: 4.8, reviews: 12341, stock: 'In Stock', badge: 'hot', emoji: '🎧', img: IMG.airPodsPro, specs: { Type: 'In-ear', ANC: 'Yes (Adaptive)', Battery: '6 hrs (30 with case)', Driver: 'Custom Apple', Connection: 'Bluetooth 5.3' }, desc: 'Premium earbuds with spatial audio.' },
  { id: 45, category: 'headphone', brand: 'Bose', name: 'Bose QuietComfort Ultra', price: 28999, oldPrice: 34999, rating: 4.9, reviews: 5432, stock: 'In Stock', badge: 'new', emoji: '🎧', img: IMG.boseQuiet, specs: { Type: 'Over-ear', ANC: 'Yes (World-class)', Battery: '24 hrs', Driver: 'Custom Bose', Connection: 'Bluetooth 5.3' }, desc: 'Immersive audio with world-class noise cancellation.' },
  { id: 46, category: 'headphone', brand: 'Razer', name: 'Razer BlackShark V2 Pro', price: 12999, oldPrice: 15999, rating: 4.7, reviews: 6789, stock: 'In Stock', badge: 'sale', emoji: '🎧', img: IMG.razerBlack, specs: { Type: 'Over-ear', ANC: 'THX Spatial Audio', Battery: '24 hrs', Driver: '50mm Titanium', Connection: 'USB Wireless + 3.5mm' }, desc: 'Pro gaming headset with THX spatial audio.' },

  // ===== SPEAKERS =====
  { id: 47, category: 'speaker', brand: 'JBL', name: 'JBL Flip 6', price: 8999, oldPrice: 11999, rating: 4.8, reviews: 15678, stock: 'In Stock', badge: 'best', emoji: '🔊', img: IMG.jblFlip6, specs: { Type: 'Portable Bluetooth', Power: '30W', Battery: '12 hrs', Waterproof: 'IP67', Connection: 'Bluetooth 5.1' }, desc: 'Best portable speaker with powerful bass.' },
  { id: 48, category: 'speaker', brand: 'Marshall', name: 'Marshall Emberton II', price: 14999, oldPrice: 17999, rating: 4.7, reviews: 4321, stock: 'In Stock', badge: 'hot', emoji: '🔊', img: IMG.marshall, specs: { Type: 'Portable Bluetooth', Power: '20W', Battery: '20 hrs', Waterproof: 'IP67', Connection: 'Bluetooth 5.0' }, desc: 'Iconic design with rich 360° sound.' },
  { id: 49, category: 'speaker', brand: 'Sonos', name: 'Sonos One (Gen 2)', price: 19999, oldPrice: 23999, rating: 4.9, reviews: 8765, stock: 'In Stock', badge: 'new', emoji: '🔊', img: IMG.sonosOne, specs: { Type: 'Smart Speaker', Power: '60W', Voice: 'Alexa Built-in', Connection: 'WiFi + Bluetooth' }, desc: 'Premium smart speaker with amazing sound.' },
  { id: 50, category: 'speaker', brand: 'Bose', name: 'Bose SoundLink Flex', price: 11999, oldPrice: 14999, rating: 4.8, reviews: 9876, stock: 'In Stock', badge: 'sale', emoji: '🔊', img: IMG.boseSound, specs: { Type: 'Portable Bluetooth', Power: '20W', Battery: '12 hrs', Waterproof: 'IP67', Connection: 'Bluetooth 4.2' }, desc: 'Portable speaker with deep, clear sound.' },

  // ===== LIGHTS =====
  { id: 51, category: 'light', brand: 'Philips', name: 'Philips Hue White & Color', price: 4999, oldPrice: 6999, rating: 4.8, reviews: 23456, stock: 'In Stock', badge: 'best', emoji: '💡', img: IMG.philipsHue, specs: { Type: 'Smart Bulb', Wattage: '9W (60W equiv)', Colors: '16 million', Connection: 'Zigbee + Bluetooth' }, desc: 'Smart bulb with 16 million colors & voice control.' },
  { id: 52, category: 'light', brand: 'Nanoleaf', name: 'Nanoleaf Shapes Hexagon', price: 7999, oldPrice: 9999, rating: 4.7, reviews: 5678, stock: 'In Stock', badge: 'new', emoji: '💡', img: IMG.nanoleaf, specs: { Type: 'Smart Panel Light', Wattage: '2W per panel', Colors: 'RGB + White', Connection: 'WiFi + Touch' }, desc: 'Modular smart lighting panels for gaming setups.' },
  { id: 53, category: 'light', brand: 'Logitech', name: 'Logitech G Lightsync Strip', price: 3999, oldPrice: 5499, rating: 4.6, reviews: 8765, stock: 'In Stock', badge: 'sale', emoji: '💡', img: IMG.logitechG, specs: { Type: 'LED Strip', Length: '2m', Colors: '16.8 million RGB', Connection: 'USB + Software' }, desc: 'Gaming LED strip with screen sync.' },
  { id: 54, category: 'light', brand: 'Corsair', name: 'Corsair iCUE QL120 RGB', price: 2999, oldPrice: 3999, rating: 4.7, reviews: 6543, stock: 'In Stock', badge: 'hot', emoji: '💡', img: IMG.corsairLx, specs: { Type: 'Case Fan + LED', Size: '120mm', LEDs: '34 RGB LEDs', Connection: 'USB + iCUE' }, desc: 'RGB fan with 34 individually addressable LEDs.' },

  // ===== WEBCAMS =====
  { id: 55, category: 'webcam', brand: 'Logitech', name: 'Logitech C920 HD Pro', price: 6999, oldPrice: 8999, rating: 4.7, reviews: 34567, stock: 'In Stock', badge: 'best', emoji: '📷', img: IMG.logitechC920, specs: { Resolution: '1080p 30fps', FOV: '78°', Autofocus: 'Yes', Mic: 'Dual Stereo' }, desc: 'Most popular webcam for streaming & meetings.' },
  { id: 56, category: 'webcam', brand: 'Elgato', name: 'Elgato Facecam MK.2', price: 12999, oldPrice: 15999, rating: 4.8, reviews: 8765, stock: 'In Stock', badge: 'new', emoji: '📷', img: IMG.elgatoFace, specs: { Resolution: '1080p 60fps', FOV: '82°', Autofocus: 'Yes', Mic: 'No (use external)' }, desc: 'Pro webcam for streamers with uncompressed video.' },

  // ===== ROUTERS =====
  { id: 57, category: 'router', brand: 'ASUS', name: 'ASUS RT-AX86U Pro', price: 18999, oldPrice: 22999, rating: 4.8, reviews: 12345, stock: 'In Stock', badge: 'best', emoji: '📡', img: IMG.asusRt, specs: { Standard: 'WiFi 6 (802.11ax)', Speed: '5700 Mbps', Range: '5,000 sq ft', Ports: '2.5G WAN/LAN' }, desc: 'Gaming router with mobile game acceleration.' },
  { id: 58, category: 'router', brand: 'TP-Link', name: 'TP-Link Archer AX73', price: 7999, oldPrice: 9999, rating: 4.7, reviews: 18765, stock: 'In Stock', badge: 'sale', emoji: '📡', img: IMG.tpLinkArcher, specs: { Standard: 'WiFi 6 (802.11ax)', Speed: '5400 Mbps', Range: '4,000 sq ft', Ports: 'Gigabit WAN/LAN' }, desc: 'Best budget WiFi 6 router for gaming.' },

  // ===== UPS (Power Backup) =====
  { id: 59, category: 'ups', brand: 'APC', name: 'APC Back-UPS Pro 1500VA', price: 12999, oldPrice: 15999, rating: 4.7, reviews: 8765, stock: 'In Stock', badge: 'best', emoji: '🔋', img: IMG.apcUps, specs: { Capacity: '1500VA / 900W', Runtime: '10 min (full load)', Outlets: '10 (Battery + Surge)', Type: 'Line-interactive' }, desc: 'Best UPS for desktop PCs and gaming setups.' },
  { id: 60, category: 'ups', brand: 'CyberPower', name: 'CyberPower CP1500AVRLCD', price: 10999, oldPrice: 13999, rating: 4.6, reviews: 5432, stock: 'In Stock', badge: 'sale', emoji: '🔋', img: IMG.cyberPower, specs: { Capacity: '1500VA / 900W', Runtime: '12 min (full load)', Outlets: '8 (Battery + Surge)', Type: 'Line-interactive' }, desc: 'Reliable UPS with AVR and LCD display.' },
];

export const ORDERS = [
  { orderId: 'TM10045', customerName: 'Rahul Sharma', status: 'Delivered', trackingNo: 'FEDEX9834723', orderDate: '2025-07-01', product: 'NVIDIA RTX 4060', steps: 4 },
  { orderId: 'TM10046', customerName: 'Priya Patel', status: 'Out for Delivery', trackingNo: 'DTDC8723461', orderDate: '2025-07-05', product: 'AMD Ryzen 7 7700X', steps: 3 },
  { orderId: 'TM10047', customerName: 'Amit Singh', status: 'Shipped', trackingNo: 'BLUEDART7234651', orderDate: '2025-07-07', product: 'Samsung 990 Pro 2TB', steps: 2 },
  { orderId: 'TM10048', customerName: 'Sneha Kumar', status: 'Processing', trackingNo: 'TM-PROC-48', orderDate: '2025-07-08', product: 'Corsair K70 RGB', steps: 1 },
  { orderId: 'TM10049', customerName: 'Rohan Verma', status: 'Delivered', trackingNo: 'ECOM8873421', orderDate: '2025-06-28', product: 'LG 27GP850 Monitor', steps: 4 },
];

export const COMPATIBILITY = [
  { cpu: 'ryzen 7 7700', board: 'b650', result: true, note: 'AMD Ryzen 7000 series is fully compatible with B650 motherboards (AM5 socket).' },
  { cpu: 'ryzen 7 7700', board: 'x670', result: true, note: 'AMD Ryzen 7000 series is fully compatible with X670 motherboards (AM5 socket).' },
  { cpu: 'ryzen 5 5600', board: 'b550', result: true, note: 'AMD Ryzen 5000 series is compatible with B550 (AM4 socket). Ensure BIOS is updated.' },
  { cpu: 'ryzen 5 5600', board: 'b650', result: false, note: 'AMD Ryzen 5000 series uses AM4 socket. B650 uses AM5 socket. They are NOT compatible.' },
  { cpu: 'i5-13600k', board: 'z790', result: true, note: 'Intel 13th Gen i5-13600K is fully compatible with Z790 motherboards (LGA1700).' },
  { cpu: 'i5-13600k', board: 'b660', result: true, note: 'Intel 13th Gen CPUs work on B660 boards with BIOS update. No overclocking support.' },
  { cpu: 'i9-13900k', board: 'b660', result: false, note: 'i9-13900K requires Z-series board for full performance. B660 limits overclocking.' },
  { cpu: 'ryzen 9 7900x', board: 'b650', result: true, note: 'Ryzen 9 7900X works on B650 but overclocking is limited. X670 is recommended.' },
];

export const DEALS = [
  { id: 6, name: 'NVIDIA RTX 4060', oldPrice: 34999, price: 29999, save: '14% OFF' },
  { id: 16, name: 'WD Black SN770 1TB NVMe', oldPrice: 7999, price: 5499, save: '31% OFF' },
  { id: 37, name: 'HP Pavilion Gaming 15', oldPrice: 64999, price: 52999, save: '18% OFF' },
  { id: 27, name: 'Corsair K70 RGB Mechanical', oldPrice: 11999, price: 8999, save: '25% OFF' },
  { id: 13, name: 'Kingston Fury Beast DDR4 16GB', oldPrice: 4999, price: 3499, save: '30% OFF' },
  { id: 31, name: 'Logitech G Pro X Superlight 2', oldPrice: 13999, price: 10999, save: '21% OFF' },
];

// Format price in Indian Rupee
export function formatPrice(price) {
  return '₹' + price.toLocaleString('en-IN');
}
