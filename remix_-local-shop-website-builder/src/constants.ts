import { ShopData, ShopTheme } from './types';

export interface ThemeConfig {
  id: ShopTheme;
  name: string;
  primary: string;
  bgLight: string;
  textPrimary: string;
  badge: string;
  accent: string;
  gradient: string;
  ring: string;
}

export const THEMES: Record<ShopTheme, ThemeConfig> = {
  emerald: {
    id: 'emerald',
    name: 'Emerald Oasis',
    primary: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white',
    bgLight: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    textPrimary: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-800',
    accent: 'border-emerald-600 text-emerald-600 focus:ring-emerald-500',
    gradient: 'from-emerald-600 to-teal-500',
    ring: 'focus:ring-emerald-500 focus:border-emerald-500',
  },
  indigo: {
    id: 'indigo',
    name: 'Royal Indigo',
    primary: 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white',
    bgLight: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    textPrimary: 'text-indigo-700',
    badge: 'bg-indigo-100 text-indigo-800',
    accent: 'border-indigo-600 text-indigo-600 focus:ring-indigo-500',
    gradient: 'from-indigo-600 to-violet-500',
    ring: 'focus:ring-indigo-500 focus:border-indigo-500',
  },
  amber: {
    id: 'amber',
    name: 'Amber Hearth',
    primary: 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white',
    bgLight: 'bg-amber-50 text-amber-700 border-amber-200',
    textPrimary: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-800',
    accent: 'border-amber-600 text-amber-600 focus:ring-amber-500',
    gradient: 'from-amber-600 to-orange-500',
    ring: 'focus:ring-amber-500 focus:border-amber-500',
  },
  rose: {
    id: 'rose',
    name: 'Rose Petal',
    primary: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white',
    bgLight: 'bg-rose-50 text-rose-700 border-rose-200',
    textPrimary: 'text-rose-700',
    badge: 'bg-rose-100 text-rose-800',
    accent: 'border-rose-600 text-rose-600 focus:ring-rose-500',
    gradient: 'from-rose-600 to-pink-500',
    ring: 'focus:ring-rose-500 focus:border-rose-500',
  },
  slate: {
    id: 'slate',
    name: 'Charcoal Slate',
    primary: 'bg-slate-800 hover:bg-slate-950 active:bg-black text-white',
    bgLight: 'bg-slate-100 text-slate-800 border-slate-300',
    textPrimary: 'text-slate-800',
    badge: 'bg-slate-200 text-slate-800',
    accent: 'border-slate-800 text-slate-800 focus:ring-slate-800',
    gradient: 'from-slate-800 to-zinc-700',
    ring: 'focus:ring-slate-800 focus:border-slate-800',
  },
  violet: {
    id: 'violet',
    name: 'Violet Aura',
    primary: 'bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white',
    bgLight: 'bg-violet-50 text-violet-700 border-violet-200',
    textPrimary: 'text-violet-700',
    badge: 'bg-violet-100 text-violet-800',
    accent: 'border-violet-600 text-violet-600 focus:ring-violet-500',
    gradient: 'from-violet-600 to-fuchsia-500',
    ring: 'focus:ring-violet-500 focus:border-violet-500',
  }
};

export const PLACEHOLDER_IMAGES = [
  {
    category: 'Bakery & Cafe',
    images: [
      { name: 'Sourdough Bread', url: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80' },
      { name: 'Gourmet Croissants', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80' },
      { name: 'Strawberry Cupcakes', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80' },
      { name: 'Macarons Box', url: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=600&q=80' },
      { name: 'Custom Birthday Cake', url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80' },
      { name: 'Iced Latte', url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80' }
    ]
  },
  {
    category: 'Boutique & Fashion',
    images: [
      { name: 'Linen Dress', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80' },
      { name: 'Leather Tote Bag', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80' },
      { name: 'Gold Pendant', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80' },
      { name: 'Retro Sunglasses', url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80' },
      { name: 'Classic Sneakers', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80' },
      { name: 'Scented Candle', url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80' }
    ]
  },
  {
    category: 'Handmade Crafts',
    images: [
      { name: 'Ceramic Mug', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80' },
      { name: 'Woven Wall Hanging', url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=600&q=80' },
      { name: 'Clay Earrings', url: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=600&q=80' },
      { name: 'Leather Journal', url: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&w=600&q=80' },
      { name: 'Organic Soap Bar', url: 'https://images.unsplash.com/photo-1607006342460-7a32c0202951?auto=format&fit=crop&w=600&q=80' },
      { name: 'Terrarium', url: 'https://images.unsplash.com/photo-1446071103104-61585481601a?auto=format&fit=crop&w=600&q=80' }
    ]
  }
];

export const TEMPLATES: Record<string, ShopData> = {
  bakery: {
    shopName: "Bella's Artisan Bakery",
    shopSubtitle: "Freshly baked sourdough, hand-rolled pastries & custom cakes",
    aboutText: "Welcome to Bella's! We are a cozy, family-owned local micro-bakery located in the heart of the community. Every single loaf of bread is naturally leavened, hand-shaped, and slow-baked using only certified organic, locally sourced flour. Our pastries are rolled with pure, pasture-raised butter for a flaky, golden exterior. Come in, smell the hot ovens, and take home something truly wholesome!",
    whatsappNumber: "15550199999",
    callNumber: "+1 (555) 019-9999",
    addressText: "124 Baker's Lane, Millwood Downtown",
    googleMapsEmbed: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2157071618335!2d-73.987844!3d40.7484405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1655849887132!5m2!1sen!2sus" width="100%" height="300" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`,
    theme: 'amber',
    currency: '$',
    logoUrl: '🍞', // Emoji logo fallback
    coverUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    paymentUpi: 'bellasbakery@pay',
    paymentQrUrl: '', // Will fall back to custom generator
    products: [
      {
        id: '1',
        name: 'Signature Organic Sourdough',
        price: 8.50,
        description: 'Our flagship 36-hour slow fermented sourdough loaf. Crisp, bubbly crust with a moist, open, and tangily perfect crumb. Flour, water, sea salt, and love.',
        imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80',
        category: 'Breads',
        inStock: true
      },
      {
        id: '2',
        name: 'French Butter Croissant',
        price: 4.25,
        description: 'Made with French AOP butter, laminated over 3 days, and baked to crisp, golden-brown perfection. Delicate shatteringly flaky layers inside.',
        imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
        category: 'Pastries',
        inStock: true
      },
      {
        id: '3',
        name: 'Belgian Chocolate Cupcake',
        price: 4.75,
        description: 'Rich dark Belgian cocoa sponge topped with a velvety, whipped, dark chocolate ganache and a delicate sprinkle of edible gold flakes.',
        imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
        category: 'Desserts',
        inStock: true
      },
      {
        id: '4',
        name: 'Fresh Iced Latte',
        price: 5.00,
        description: 'Double shot of locally roasted espresso, chilled milk, and a touch of house-made vanilla bean syrup over ice blocks.',
        imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
        category: 'Drinks',
        inStock: true
      }
    ],
    analytics: {
      views: 142,
      whatsappClicks: 24,
      clicksByProductId: { '1': 14, '2': 6, '3': 4 }
    }
  },
  boutique: {
    shopName: "Atelier Noire",
    shopSubtitle: "Curated slow fashion, organic linen garments & minimalist design",
    aboutText: "Atelier Noire is a modern clothing studio built on the ethos of simplicity, ethical craftsmanship, and timeless elegance. We source fine European flax linen and organic GOTS-certified cotton to build silhouettes that outlast seasonal trends. Every piece is tailored by local dressmakers under fair wages and in limited batches to reduce ecological impact.",
    whatsappNumber: "15550188888",
    callNumber: "+1 (555) 018-8888",
    addressText: "88 Gallery Row, Arts District",
    googleMapsEmbed: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2157071618335!2d-73.987844!3d40.7484405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1655849887132!5m2!1sen!2sus" width="100%" height="300" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`,
    theme: 'slate',
    currency: '$',
    logoUrl: '👗',
    coverUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    paymentUpi: 'ateliernoire@pay',
    paymentQrUrl: '',
    products: [
      {
        id: '1',
        name: 'Elysian Linen Dress',
        price: 110.00,
        description: 'Made from 100% pre-washed French flax linen, featuring an elegant low back, practical side seam pockets, and a fluid, floating drape. Breathable and luxurious.',
        imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
        category: 'Apparel',
        inStock: true
      },
      {
        id: '2',
        name: 'The Daily Leather Tote',
        price: 145.00,
        description: 'Full-grain vegetable tanned leather with hand-stitched details and matching copper hardware. Spacious enough for a 15" laptop and all daily essentials.',
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
        category: 'Bags',
        inStock: true
      },
      {
        id: '3',
        name: '18k Minimalist Gold Pendant',
        price: 85.00,
        description: 'A solid sterling silver base thick-plated with 18k yellow gold (vermeil). A raw organic circle motif on a delicate 18-inch cable chain.',
        imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
        category: 'Jewelry',
        inStock: true
      }
    ],
    analytics: {
      views: 308,
      whatsappClicks: 18,
      clicksByProductId: { '1': 10, '2': 5, '3': 3 }
    }
  },
  crafts: {
    shopName: "Clay & Co. Studios",
    shopSubtitle: "Hand-thrown functional stoneware & botanical clay crafts",
    aboutText: "We make muddy fingers make happy homes! Our studio produces small-batch functional ceramic tableware designed to bring tactile joy to your everyday morning coffee, lunch, and family gatherings. Each cup is personally thrown on the wheel and custom-glazed by hand in our wood-fired kiln, creating organic variations so no two pieces are identical.",
    whatsappNumber: "15550177777",
    callNumber: "+1 (555) 017-7777",
    addressText: "44 Hearthside Plaza, Clay Valley",
    googleMapsEmbed: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2157071618335!2d-73.987844!3d40.7484405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1655849887132!5m2!1sen!2sus" width="100%" height="300" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`,
    theme: 'emerald',
    currency: '$',
    logoUrl: '🏺',
    coverUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
    paymentUpi: 'clayco@pay',
    paymentQrUrl: '',
    products: [
      {
        id: '1',
        name: 'Speckled Oatmeal Mug',
        price: 32.00,
        description: 'Dishwasher and microwave safe. Features a rustic, speckled raw-clay exterior with a glossy cream-oatmeal interior glaze. Large comfortable handle for cozy mornings.',
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
        category: 'Mugs',
        inStock: true
      },
      {
        id: '2',
        name: 'Terracotta Desktop Planter',
        price: 24.00,
        description: 'Fired at high temp with hand-stamped line detailing and a pre-drilled water drainage hole. Comes with an matching unglazed clay drainage saucer.',
        imageUrl: 'https://images.unsplash.com/photo-1446071103104-61585481601a?auto=format&fit=crop&w=600&q=80',
        category: 'Planters',
        inStock: true
      },
      {
        id: '3',
        name: 'Handcrafted Lavender Soap',
        price: 9.50,
        description: 'Cold-process artisanal bar enriched with wild lavender buds, organic shea butter, and essential oil blends for a rich, aromatic, skin-loving lather.',
        imageUrl: 'https://images.unsplash.com/photo-1607006342460-7a32c0202951?auto=format&fit=crop&w=600&q=80',
        category: 'Wellness',
        inStock: true
      }
    ],
    analytics: {
      views: 92,
      whatsappClicks: 11,
      clicksByProductId: { '1': 7, '2': 3, '3': 1 }
    }
  }
};
