export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  inStock: boolean;
}

export interface Analytics {
  views: number;
  whatsappClicks: number;
  clicksByProductId: Record<string, number>;
}

export type ShopTheme = 'emerald' | 'indigo' | 'amber' | 'rose' | 'slate' | 'violet';

export interface ShopData {
  shopName: string;
  shopSubtitle: string;
  aboutText: string;
  whatsappNumber: string;
  callNumber: string;
  addressText: string;
  googleMapsEmbed: string;
  theme: ShopTheme;
  currency: string;
  logoUrl: string;
  coverUrl: string;
  paymentUpi: string;
  paymentQrUrl: string;
  products: Product[];
  analytics: Analytics;
}
