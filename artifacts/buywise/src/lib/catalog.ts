export type Currency = 'NEAR';

export type ProductCategoryId =
  | 'phones-tablets'
  | 'computers'
  | 'monitors-displays'
  | 'computer-accessories'
  | 'audio'
  | 'wearables'
  | 'chargers-power'
  | 'storage'
  | 'networking'
  | 'cameras-photography'
  | 'gaming'
  | 'smart-home'
  | 'printers-projectors-electronics';

export type Specification = {
  label: string;
  value: string;
};

export type Offer = {
  id: string;
  name: string;
  categoryId: ProductCategoryId;
  category: string;
  price: number;
  currency: Currency;
  description: string;
  specifications: Specification[];
  features: string[];
  compatibility: string[];
  simulated: true;
};

export type ProductCategory = {
  id: ProductCategoryId;
  label: string;
  keywords: string[];
  productSuggestions: string[];
  offers: Offer[];
};

type OfferSeed = Omit<
  Offer,
  'id' | 'categoryId' | 'category' | 'currency' | 'simulated'
>;

type CategorySeed = Omit<ProductCategory, 'offers'> & {
  offers: OfferSeed[];
};

const categorySeeds: CategorySeed[] = [
  {
    id: 'phones-tablets',
    label: 'Phones and tablets',
    keywords: [
      'phone',
      'phones',
      'smartphone',
      'smartphones',
      'smart phone',
      'smart phones',
      'mobile phone',
      'cell phone',
      'iphone',
      'ipad',
      'tablet',
      'tablets',
      'phone case',
      'tablet case',
    ],
    productSuggestions: [
      '5G smartphone',
      'Android smartphone',
      'iPhone',
      'Android tablet',
      'iPad',
      'phone case',
    ],
    offers: [
      {
        name: 'Novaline S 5G',
        price: 25,
        description: 'A balanced phone sample with a vivid display and everyday battery life.',
        specifications: [
          { label: 'Storage', value: '128GB' },
          { label: 'Display', value: '6.2-inch OLED' },
          { label: 'Network', value: '5G' },
        ],
        features: ['Dual SIM', '24-hour battery', 'NFC'],
        compatibility: ['USB-C accessories', 'Android apps'],
      },
      {
        name: 'Pocketwave Tab 11',
        price: 31,
        description: 'An 11-inch tablet sample with pen input and ample storage.',
        specifications: [
          { label: 'Storage', value: '256GB' },
          { label: 'Display', value: '11-inch LCD' },
          { label: 'Network', value: 'Wi-Fi 6' },
        ],
        features: ['Stylus support', 'Quad speakers', '8000mAh battery'],
        compatibility: ['USB-C accessories', 'Android apps'],
      },
      {
        name: 'Evermark Note X',
        price: 29,
        description: 'A larger-screen phone sample with fast refresh and expanded storage.',
        specifications: [
          { label: 'Storage', value: '256GB' },
          { label: 'Display', value: '6.7-inch OLED, 120Hz' },
          { label: 'Network', value: '5G' },
        ],
        features: ['Dual SIM', 'Wireless charging', 'IP67 water resistance'],
        compatibility: ['USB-C accessories', 'Android apps'],
      },
    ],
  },
  {
    id: 'computers',
    label: 'Laptops and desktop computers',
    keywords: [
      'laptop',
      'laptops',
      'notebook',
      'notebooks',
      'macbook',
      'chromebook',
      'desktop',
      'desktop computer',
      'desktop pc',
      'computer',
      'computers',
      'pc',
      'workstation',
      'all in one computer',
    ],
    productSuggestions: [
      'lightweight laptop',
      'gaming laptop',
      'Chromebook',
      'desktop PC',
      'all-in-one computer',
    ],
    offers: [
      {
        name: 'Aster Air 14',
        price: 38,
        description: 'A lightweight everyday laptop sample with a sharp display and practical ports.',
        specifications: [
          { label: 'Memory', value: '16GB RAM' },
          { label: 'Storage', value: '512GB SSD' },
          { label: 'Display', value: '14-inch' },
        ],
        features: ['Wi-Fi 6E', 'USB-C charging', '12-hour battery'],
        compatibility: ['Windows apps', 'USB-C displays'],
      },
      {
        name: 'Meridian Pro 15',
        price: 64,
        description: 'A higher-capacity workstation-style laptop sample for demanding projects.',
        specifications: [
          { label: 'Memory', value: '32GB RAM' },
          { label: 'Storage', value: '1TB SSD' },
          { label: 'Display', value: '15-inch' },
        ],
        features: ['Wi-Fi 7', 'Backlit keyboard', 'Thunderbolt 4'],
        compatibility: ['Windows apps', 'USB-C displays'],
      },
      {
        name: 'Fieldbook Flex 13',
        price: 34,
        description: 'A compact convertible laptop sample with touch input and flexible setup.',
        specifications: [
          { label: 'Memory', value: '16GB RAM' },
          { label: 'Storage', value: '256GB SSD' },
          { label: 'Display', value: '13-inch touchscreen' },
        ],
        features: ['Wi-Fi 6E', 'USB-C charging', '360-degree hinge'],
        compatibility: ['Windows apps', 'USB-C displays'],
      },
    ],
  },
  {
    id: 'monitors-displays',
    label: 'Monitors and displays',
    keywords: [
      'monitor',
      'monitors',
      'computer display',
      'external display',
      'desktop display',
      'gaming display',
      'monitor stand',
    ],
    productSuggestions: ['27-inch monitor', '4K monitor', 'gaming monitor', 'portable display'],
    offers: [
      {
        name: 'Frameview 27 QHD',
        price: 23.5,
        description: 'A 27-inch IPS monitor sample with a crisp QHD picture.',
        specifications: [
          { label: 'Size', value: '27-inch' },
          { label: 'Resolution', value: '1440p' },
          { label: 'Panel', value: 'IPS' },
        ],
        features: ['100Hz refresh rate', 'USB-C', 'Height-adjustable stand'],
        compatibility: ['Windows', 'macOS', 'HDMI and USB-C devices'],
      },
      {
        name: 'Clarity 27 UHD',
        price: 34.9,
        description: 'A 27-inch 4K monitor sample suited to detailed work and media.',
        specifications: [
          { label: 'Size', value: '27-inch' },
          { label: 'Resolution', value: '4K' },
          { label: 'Panel', value: 'IPS' },
        ],
        features: ['60Hz refresh rate', 'USB-C', 'HDR support'],
        compatibility: ['Windows', 'macOS', 'HDMI and USB-C devices'],
      },
      {
        name: 'Apex 24 Fastview',
        price: 19.2,
        description: 'A compact gaming monitor sample with a fast refresh and HDMI input.',
        specifications: [
          { label: 'Size', value: '24-inch' },
          { label: 'Resolution', value: '1080p' },
          { label: 'Panel', value: 'VA' },
        ],
        features: ['165Hz refresh rate', 'HDMI 2.1', 'Adaptive sync'],
        compatibility: ['PC gaming', 'Console gaming'],
      },
    ],
  },
  {
    id: 'computer-accessories',
    label: 'Keyboards, mice and computer accessories',
    keywords: [
      'keyboard',
      'keyboards',
      'mouse',
      'mice',
      'computer mouse',
      'gaming mouse',
      'trackball',
      'webcam',
      'web camera',
      'computer accessory',
      'computer accessories',
      'usb hub',
      'hub',
      'dock',
      'docking station',
      'laptop stand',
      'mouse pad',
      'monitor stand',
      'keyboard mouse',
    ],
    productSuggestions: ['mechanical keyboard', 'wireless mouse', 'USB-C hub', 'laptop dock', 'webcam'],
    offers: [
      {
        name: 'Tactile 75 Wireless',
        price: 7.8,
        description: 'A compact mechanical keyboard sample with multi-device pairing.',
        specifications: [
          { label: 'Layout', value: '75% mechanical' },
          { label: 'Connection', value: 'Bluetooth 5.2 and USB-C' },
          { label: 'Battery', value: '3000mAh' },
        ],
        features: ['Hot-swappable switches', 'Backlit keys', 'Multi-device pairing'],
        compatibility: ['Windows', 'macOS', 'Android'],
      },
      {
        name: 'Arc Precision Mouse',
        price: 3.6,
        description: 'An ergonomic wireless mouse sample with adjustable sensitivity.',
        specifications: [
          { label: 'Connection', value: '2.4GHz and Bluetooth' },
          { label: 'Sensitivity', value: 'Up to 8000 DPI' },
          { label: 'Battery', value: 'Rechargeable USB-C' },
        ],
        features: ['Silent switches', '5 programmable buttons', 'Ergonomic shape'],
        compatibility: ['Windows', 'macOS', 'Linux'],
      },
      {
        name: 'Portway 8-in-1 Hub',
        price: 4.9,
        description: 'A travel USB-C hub sample for displays, storage, and wired accessories.',
        specifications: [
          { label: 'Ports', value: '8' },
          { label: 'Video', value: '4K HDMI' },
          { label: 'Power', value: '100W USB-C passthrough' },
        ],
        features: ['USB-A', 'SD card reader', 'Gigabit Ethernet'],
        compatibility: ['USB-C laptops and tablets'],
      },
    ],
  },
  {
    id: 'audio',
    label: 'Headphones, earbuds, speakers and microphones',
    keywords: [
      'headphone',
      'headphones',
      'earbud',
      'earbuds',
      'earphone',
      'earphones',
      'wireless earphones',
      'bluetooth earbuds',
      'speaker',
      'speakers',
      'bluetooth speaker',
      'soundbar',
      'microphone',
      'microphones',
      'mic',
      'mics',
      'headset',
      'headsets',
    ],
    productSuggestions: [
      'wireless over-ear headphones',
      'wireless earphones',
      'Bluetooth earbuds',
      'portable speaker',
      'USB microphone',
    ],
    offers: [
      {
        name: 'Sonora QuietComfort 45',
        price: 16.8,
        description: 'A comfortable over-ear headphone sample with dependable all-day sound.',
        specifications: [
          { label: 'Connection', value: 'Bluetooth 5.3' },
          { label: 'Battery', value: '30 hours' },
          { label: 'Weight', value: '240g' },
        ],
        features: ['Active noise cancellation', 'Multipoint pairing', 'USB-C charging'],
        compatibility: ['Bluetooth audio devices', '3.5mm audio cable'],
      },
      {
        name: 'Auralis Studio Max',
        price: 21.2,
        description: 'A studio-tuned over-ear headphone sample with spatial audio.',
        specifications: [
          { label: 'Connection', value: 'Bluetooth 5.3' },
          { label: 'Battery', value: '40 hours' },
          { label: 'Weight', value: '265g' },
        ],
        features: ['Active noise cancellation', 'Spatial audio', 'USB-C charging'],
        compatibility: ['Bluetooth audio devices', 'USB-C audio'],
      },
      {
        name: 'Northline Travel One',
        price: 14.4,
        description: 'A lightweight travel headphone sample with fold-flat storage.',
        specifications: [
          { label: 'Connection', value: 'Bluetooth 5.2' },
          { label: 'Battery', value: '32 hours' },
          { label: 'Weight', value: '215g' },
        ],
        features: ['Active noise cancellation', 'Fold-flat design', 'USB-C charging'],
        compatibility: ['Bluetooth audio devices'],
      },
    ],
  },
  {
    id: 'wearables',
    label: 'Smartwatches and wearable devices',
    keywords: [
      'smartwatch',
      'smartwatches',
      'smart watch',
      'smart watches',
      'fitness band',
      'fitness bands',
      'fitness tracker',
      'fitness trackers',
      'wearable',
      'wearables',
      'activity tracker',
      'fitness watch',
    ],
    productSuggestions: ['smartwatch', 'smart watch', 'fitness band', 'fitness tracker'],
    offers: [
      {
        name: 'Loop Active Watch',
        price: 8.4,
        description: 'A fitness smartwatch sample with GPS and health tracking.',
        specifications: [
          { label: 'Display', value: '1.4-inch AMOLED' },
          { label: 'Battery', value: '7 days typical use' },
          { label: 'Water rating', value: '5 ATM' },
        ],
        features: ['GPS', 'Heart-rate sensor', 'Sleep tracking'],
        compatibility: ['iOS companion app', 'Android companion app'],
      },
      {
        name: 'Pulse Fit Band',
        price: 3.2,
        description: 'A slim fitness band sample focused on activity and recovery.',
        specifications: [
          { label: 'Display', value: '0.9-inch OLED' },
          { label: 'Battery', value: '12 days typical use' },
          { label: 'Water rating', value: '5 ATM' },
        ],
        features: ['Heart-rate sensor', 'Sleep tracking', 'Step counter'],
        compatibility: ['iOS companion app', 'Android companion app'],
      },
      {
        name: 'Summit Connect Watch',
        price: 13.6,
        description: 'A rugged smartwatch sample with offline maps and cellular support.',
        specifications: [
          { label: 'Display', value: '1.5-inch AMOLED' },
          { label: 'Battery', value: '10 days typical use' },
          { label: 'Water rating', value: '10 ATM' },
        ],
        features: ['GPS', 'LTE', 'Offline maps'],
        compatibility: ['iOS companion app', 'Android companion app'],
      },
    ],
  },
  {
    id: 'chargers-power',
    label: 'Chargers, cables, power banks and adapters',
    keywords: [
      'charger',
      'chargers',
      'phone charger',
      'charging cable',
      'cable',
      'cables',
      'usb cable',
      'power bank',
      'powerbank',
      'adapter',
      'adapters',
      'wall adapter',
      'power adapter',
      'usb charger',
      'charging adapter',
      'wireless charger',
      'power supply',
    ],
    productSuggestions: ['USB-C charger', '65W wall charger', 'USB-C cable', 'power bank', 'travel adapter'],
    offers: [
      {
        name: 'VoltFold 65W Charger',
        price: 2.8,
        description: 'A compact multi-port USB-C charger sample for travel and desk use.',
        specifications: [
          { label: 'Output', value: '65W' },
          { label: 'Ports', value: '2 USB-C, 1 USB-A' },
          { label: 'Plug', value: 'Foldable US plug' },
        ],
        features: ['GaN design', 'Over-current protection', 'Fast charging'],
        compatibility: ['USB-C phones, tablets, and laptops'],
      },
      {
        name: 'Tanglefree USB-C Cable',
        price: 1.1,
        description: 'A braided charging cable sample with data transfer support.',
        specifications: [
          { label: 'Length', value: '2m' },
          { label: 'Power', value: '100W' },
          { label: 'Data', value: 'USB 2.0' },
        ],
        features: ['Braided jacket', 'USB-C to USB-C', 'Fast charging'],
        compatibility: ['USB-C devices'],
      },
      {
        name: 'Waypoint 20K Power Bank',
        price: 9.8,
        description: 'A high-capacity power bank sample with a built-in status display.',
        specifications: [
          { label: 'Capacity', value: '20000mAh' },
          { label: 'Output', value: '45W USB-C' },
          { label: 'Ports', value: '2 USB-C, 1 USB-A' },
        ],
        features: ['Pass-through charging', 'Battery display', 'Airline carry-on size'],
        compatibility: ['USB-C phones, tablets, and accessories'],
      },
    ],
  },
  {
    id: 'storage',
    label: 'Storage devices and memory cards',
    keywords: [
      'ssd',
      'solid state drive',
      'nvme',
      'hard drive',
      'hdd',
      'usb drive',
      'flash drive',
      'thumb drive',
      'memory card',
      'sd card',
      'microsd',
      'storage device',
      'portable ssd',
      'external drive',
    ],
    productSuggestions: ['portable SSD', 'NVMe SSD', 'USB flash drive', 'microSD card', 'external hard drive'],
    offers: [
      {
        name: 'EdgeDrive Portable SSD',
        price: 15.9,
        description: 'A pocket-sized portable SSD sample with a durable enclosure.',
        specifications: [
          { label: 'Capacity', value: '1TB' },
          { label: 'Interface', value: 'USB 3.2 Gen 2' },
          { label: 'Read speed', value: 'Up to 1000MB/s' },
        ],
        features: ['Shock-resistant', 'USB-C cable included', 'Hardware encryption'],
        compatibility: ['Windows', 'macOS', 'USB-C and USB-A'],
      },
      {
        name: 'PocketFlash 256',
        price: 3.4,
        description: 'A compact USB flash drive sample for everyday file transfer.',
        specifications: [
          { label: 'Capacity', value: '256GB' },
          { label: 'Interface', value: 'USB 3.2' },
          { label: 'Connector', value: 'USB-A' },
        ],
        features: ['Retractable connector', 'Water-resistant casing'],
        compatibility: ['USB-A ports', 'Windows', 'macOS'],
      },
      {
        name: 'TrailCard 512',
        price: 5.7,
        description: 'A high-capacity microSD sample for portable devices and cameras.',
        specifications: [
          { label: 'Capacity', value: '512GB' },
          { label: 'Read speed', value: 'Up to 160MB/s' },
          { label: 'Speed class', value: 'U3, V30' },
        ],
        features: ['A2 app performance', 'SD adapter included'],
        compatibility: ['microSD slots', 'SD slots with adapter'],
      },
    ],
  },
  {
    id: 'networking',
    label: 'Routers and networking equipment',
    keywords: [
      'router',
      'routers',
      'wifi router',
      'wi fi router',
      'wi-fi router',
      'mesh system',
      'mesh router',
      'access point',
      'network switch',
      'range extender',
      'wifi extender',
      'wi fi extender',
      'modem',
      'networking equipment',
      'wifi device',
      'wi fi device',
    ],
    productSuggestions: ['Wi-Fi 6 router', 'mesh Wi-Fi system', 'network switch', 'Wi-Fi extender'],
    offers: [
      {
        name: 'HomeMesh AX3000',
        price: 12.4,
        description: 'A dual-band mesh router sample for apartments and small homes.',
        specifications: [
          { label: 'Wi-Fi', value: 'Wi-Fi 6, AX3000' },
          { label: 'Coverage', value: 'Up to 1800 sq ft' },
          { label: 'Ethernet', value: '3 gigabit ports' },
        ],
        features: ['Mesh roaming', 'WPA3 security', 'Parental controls'],
        compatibility: ['IPv4 and IPv6', 'Most cable and fiber modems'],
      },
      {
        name: 'Linkwave Wi-Fi 7',
        price: 28.6,
        description: 'A tri-band Wi-Fi 7 router sample with a multi-gig port.',
        specifications: [
          { label: 'Wi-Fi', value: 'Wi-Fi 7, BE7200' },
          { label: 'Coverage', value: 'Up to 2500 sq ft' },
          { label: 'Ethernet', value: '1x 2.5GbE, 3x gigabit' },
        ],
        features: ['Multi-link operation', 'WPA3 security', 'Guest network'],
        compatibility: ['IPv4 and IPv6', 'Most cable and fiber modems'],
      },
      {
        name: 'Airpoint AX1800 Extender',
        price: 5.6,
        description: 'A plug-in Wi-Fi extender sample to improve coverage in a dead zone.',
        specifications: [
          { label: 'Wi-Fi', value: 'Wi-Fi 6, AX1800' },
          { label: 'Bands', value: 'Dual-band' },
          { label: 'Ethernet', value: '1 gigabit port' },
        ],
        features: ['Access point mode', 'Signal indicator', 'WPA3 security'],
        compatibility: ['Existing Wi-Fi routers', 'IPv4 and IPv6'],
      },
    ],
  },
  {
    id: 'cameras-photography',
    label: 'Cameras, drones and photography gear',
    keywords: [
      'camera',
      'cameras',
      'action camera',
      'digital camera',
      'dslr',
      'mirrorless camera',
      'drone',
      'drones',
      'camera lens',
      'lens',
      'tripod',
      'gimbal',
      'photography accessory',
      'photography accessories',
    ],
    productSuggestions: ['action camera', 'mirrorless camera', 'camera drone', 'camera lens', 'tripod'],
    offers: [
      {
        name: 'TrailCam 4K Action',
        price: 18.9,
        description: 'A compact action camera sample with stabilization and waterproof housing.',
        specifications: [
          { label: 'Video', value: '4K at 60fps' },
          { label: 'Photo', value: '20MP' },
          { label: 'Screen', value: 'Front and rear LCD' },
        ],
        features: ['Image stabilization', 'Waterproof to 10m', 'Wi-Fi transfer'],
        compatibility: ['microSD cards', 'USB-C charging'],
      },
      {
        name: 'SkyPath Mini Drone',
        price: 34.5,
        description: 'A foldable camera drone sample with assisted flight modes.',
        specifications: [
          { label: 'Camera', value: '4K, 3-axis gimbal' },
          { label: 'Flight time', value: 'Up to 28 minutes' },
          { label: 'Weight', value: '249g' },
        ],
        features: ['GPS return-to-home', 'Obstacle sensing', 'Foldable arms'],
        compatibility: ['iOS flight app', 'Android flight app'],
      },
      {
        name: 'Lenscraft Mirrorless Kit',
        price: 58,
        description: 'A mirrorless camera sample kit with a versatile starter lens.',
        specifications: [
          { label: 'Sensor', value: '24MP APS-C' },
          { label: 'Video', value: '4K at 30fps' },
          { label: 'Lens mount', value: 'LC mount' },
        ],
        features: ['In-body stabilization', 'Microphone input', 'USB-C transfer'],
        compatibility: ['LC-mount lenses', 'UHS-I SD cards'],
      },
    ],
  },
  {
    id: 'gaming',
    label: 'Gaming consoles, controllers and accessories',
    keywords: [
      'gaming console',
      'console',
      'game controller',
      'controller',
      'gamepad',
      'gamepads',
      'xbox',
      'playstation',
      'nintendo switch',
      'gaming headset',
      'gaming accessories',
      'gaming mouse',
      'gaming keyboard',
    ],
    productSuggestions: ['wireless game controller', 'gaming console', 'gaming headset', 'gaming keyboard'],
    offers: [
      {
        name: 'Playpad Wireless Controller',
        price: 7.9,
        description: 'A wireless game controller sample with programmable back buttons.',
        specifications: [
          { label: 'Connection', value: 'Bluetooth and USB-C' },
          { label: 'Battery', value: '20 hours' },
          { label: 'Buttons', value: '2 programmable rear buttons' },
        ],
        features: ['Hall-effect sticks', 'Motion controls', 'USB-C charging'],
        compatibility: ['Windows', 'Android', 'Bluetooth-enabled devices'],
      },
      {
        name: 'Arcadebox Compact',
        price: 36,
        description: 'A compact game console sample with expandable digital storage.',
        specifications: [
          { label: 'Output', value: '4K at 60Hz' },
          { label: 'Storage', value: '512GB' },
          { label: 'Connection', value: 'Wi-Fi 6, HDMI 2.1' },
        ],
        features: ['Quick resume', 'Expandable storage', 'Wireless controller included'],
        compatibility: ['HDMI displays', 'Bluetooth audio devices'],
      },
      {
        name: 'Arena Closed-Back Headset',
        price: 10.2,
        description: 'A wired gaming headset sample with a detachable microphone.',
        specifications: [
          { label: 'Connection', value: '3.5mm wired' },
          { label: 'Drivers', value: '50mm' },
          { label: 'Weight', value: '285g' },
        ],
        features: ['Detachable boom mic', 'Inline volume control', 'Memory foam pads'],
        compatibility: ['PC', 'Console controllers', '3.5mm audio devices'],
      },
    ],
  },
  {
    id: 'smart-home',
    label: 'Smart-home devices and security',
    keywords: [
      'smart home',
      'smart light',
      'smart lights',
      'smart bulb',
      'smart bulbs',
      'security camera',
      'security cameras',
      'smart camera',
      'video doorbell',
      'doorbell',
      'smart plug',
      'smart thermostat',
      'thermostat',
      'motion sensor',
      'home security',
      'smart speaker',
    ],
    productSuggestions: ['smart lights', 'security camera', 'video doorbell', 'smart plug', 'smart thermostat'],
    offers: [
      {
        name: 'GlowHome Color Kit',
        price: 3.1,
        description: 'A starter smart-light sample kit with tunable white and color.',
        specifications: [
          { label: 'Bulbs', value: '3 A19 bulbs' },
          { label: 'Brightness', value: '800 lumens each' },
          { label: 'Connection', value: 'Wi-Fi and Bluetooth' },
        ],
        features: ['16 million colors', 'Scheduling', 'Voice control'],
        compatibility: ['Matter', 'Major smart-home platforms'],
      },
      {
        name: 'SecureNest Indoor Cam',
        price: 8.8,
        description: 'An indoor security camera sample with motion alerts and local storage.',
        specifications: [
          { label: 'Video', value: '2K resolution' },
          { label: 'Field of view', value: '130 degrees' },
          { label: 'Storage', value: 'microSD and cloud-ready' },
        ],
        features: ['Two-way audio', 'Privacy shutter', 'Person detection'],
        compatibility: ['2.4GHz Wi-Fi', 'iOS and Android apps'],
      },
      {
        name: 'Roomwise Smart Thermostat',
        price: 15.5,
        description: 'A learning thermostat sample with room scheduling and energy reports.',
        specifications: [
          { label: 'Display', value: '3.5-inch color touchscreen' },
          { label: 'Sensors', value: 'Temperature and humidity' },
          { label: 'Power', value: '24V HVAC wiring' },
        ],
        features: ['Auto scheduling', 'Energy reports', 'Remote access'],
        compatibility: ['Most 24V HVAC systems', 'Matter'],
      },
    ],
  },
  {
    id: 'printers-projectors-electronics',
    label: 'Printers, projectors and other electronics',
    keywords: [
      'printer',
      'printers',
      'scanner',
      'scanners',
      'document scanner',
      'projector',
      'projectors',
      '3d printer',
      'label printer',
      'e reader',
      'ereader',
      'e-book reader',
      'television',
      'tv',
      'digital photo frame',
      'calculator',
      'portable radio',
    ],
    productSuggestions: ['color printer', 'flatbed scanner', 'portable projector', 'e-reader', '3D printer'],
    offers: [
      {
        name: 'Paperline Color 4-in-1',
        price: 17.6,
        description: 'A compact color printer sample with scan and copy functions.',
        specifications: [
          { label: 'Print', value: 'Color inkjet' },
          { label: 'Resolution', value: '4800 x 1200 dpi' },
          { label: 'Paper size', value: 'Up to A4' },
        ],
        features: ['Wi-Fi printing', 'Automatic duplex', 'Flatbed scan'],
        compatibility: ['Windows', 'macOS', 'iOS and Android print apps'],
      },
      {
        name: 'Beamview Portable Projector',
        price: 28.4,
        description: 'A portable projector sample for presentations and home viewing.',
        specifications: [
          { label: 'Resolution', value: '1080p native' },
          { label: 'Brightness', value: '650 ANSI lumens' },
          { label: 'Projection size', value: 'Up to 120-inch' },
        ],
        features: ['Auto keystone', 'Built-in speakers', 'USB-C input'],
        compatibility: ['HDMI', 'USB-C video', 'Wireless casting'],
      },
      {
        name: 'ScanDesk Flatbed 1200',
        price: 7.2,
        description: 'A flatbed document scanner sample with a high-resolution sensor.',
        specifications: [
          { label: 'Optical resolution', value: '1200 dpi' },
          { label: 'Scan area', value: 'A4 and letter' },
          { label: 'Connection', value: 'USB 3.0' },
        ],
        features: ['One-touch scan', 'OCR-ready software', 'Lid extension'],
        compatibility: ['Windows', 'macOS'],
      },
    ],
  },
];

export const PRODUCT_CATEGORIES: ProductCategory[] = categorySeeds.map(
  (category) => ({
    ...category,
    offers: category.offers.map((offer, index) => ({
      ...offer,
      id: `${category.id}-${index + 1}`,
      categoryId: category.id,
      category: category.label,
      currency: 'NEAR',
      simulated: true,
    })),
  }),
);
