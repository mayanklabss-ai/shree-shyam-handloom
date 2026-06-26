import React, { useState } from 'react';
import { ShopData, Product, ShopTheme } from '../types';
import { THEMES, PLACEHOLDER_IMAGES } from '../constants';
import QRGenerator from './QRGenerator';
import AnalyticsPanel from './AnalyticsPanel';
import { 
  Settings, 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  BarChart2, 
  Share2, 
  Plus, 
  Trash2, 
  Edit2, 
  Upload, 
  Check, 
  Image as ImageIcon,
  Sparkles,
  Phone,
  HelpCircle,
  Eye,
  Smartphone,
  ExternalLink,
  ChevronRight,
  UserCheck
} from 'lucide-react';

interface AdminPanelProps {
  data: ShopData;
  onUpdateData: (newData: Partial<ShopData>) => void;
  shopUrl: string;
}

export default function AdminPanel({ data, onUpdateData, shopUrl }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'products' | 'location' | 'payments' | 'analytics' | 'share'>('general');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  
  // Local states for product forms
  const [pName, setPName] = useState('');
  const [pPrice, setPPrice] = useState(0);
  const [pDesc, setPDesc] = useState('');
  const [pCategory, setPCategory] = useState('');
  const [pInStock, setPInStock] = useState(true);
  const [pImageUrl, setPImageUrl] = useState('');
  const [imageTab, setImageTab] = useState<'preset' | 'url' | 'upload'>('preset');

  const themeConfig = THEMES[data.theme] || THEMES.emerald;

  // File to base64 helper
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'logo' | 'cover' | 'product' | 'qr') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (target === 'logo') onUpdateData({ logoUrl: base64 });
      else if (target === 'cover') onUpdateData({ coverUrl: base64 });
      else if (target === 'qr') onUpdateData({ paymentQrUrl: base64 });
      else if (target === 'product') setPImageUrl(base64);
    };
    reader.readAsDataURL(file);
  };

  // Preset Selection for products
  const selectPresetImage = (url: string) => {
    setPImageUrl(url);
  };

  // Open Add Product Form
  const openAddProduct = () => {
    setEditingProduct(null);
    setPName('');
    setPPrice(0);
    setPDesc('');
    setPCategory('');
    setPInStock(true);
    setPImageUrl('');
    setImageTab('preset');
    setIsAddingProduct(true);
  };

  // Open Edit Product Form
  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setPName(product.name);
    setPPrice(product.price);
    setPDesc(product.description);
    setPCategory(product.category || '');
    setPInStock(product.inStock);
    setPImageUrl(product.imageUrl || '');
    setImageTab(product.imageUrl?.startsWith('http') && !product.imageUrl.includes('unsplash') ? 'url' : 'preset');
    setIsAddingProduct(true);
  };

  // Handle Save Product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || pPrice < 0) return;

    let updatedProducts = [...data.products];

    if (editingProduct) {
      // Edit existing product
      updatedProducts = updatedProducts.map(p => 
        p.id === editingProduct.id 
          ? { ...p, name: pName, price: pPrice, description: pDesc, category: pCategory, inStock: pInStock, imageUrl: pImageUrl }
          : p
      );
    } else {
      // Add new product
      const newProduct: Product = {
        id: Date.now().toString(),
        name: pName,
        price: pPrice,
        description: pDesc,
        category: pCategory || 'Uncategorized',
        inStock: pInStock,
        imageUrl: pImageUrl
      };
      updatedProducts.push(newProduct);
    }

    onUpdateData({ products: updatedProducts });
    setIsAddingProduct(false);
    setEditingProduct(null);
  };

  // Handle Delete Product
  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = data.products.filter(p => p.id !== productId);
      onUpdateData({ products: updatedProducts });
    }
  };

  // Sync analytics resetting
  const handleResetAnalytics = () => {
    if (confirm('Reset visitor views and click metrics? This cannot be undone.')) {
      onUpdateData({
        analytics: {
          views: 0,
          whatsappClicks: 0,
          clicksByProductId: {}
        }
      });
    }
  };

  const handleSimulateVisit = () => {
    onUpdateData({
      analytics: {
        ...data.analytics,
        views: (data.analytics.views || 0) + 1
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-white text-slate-800">
      
      {/* Top Banner Branding */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500 rounded-lg text-white font-extrabold text-xs tracking-wider">
            L S B
          </div>
          <div>
            <h1 className="font-extrabold text-sm flex items-center gap-1">
              Local Shop Builder
              <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] rounded-full font-medium">MVP</span>
            </h1>
            <p className="text-[10px] text-slate-400">Zero-code merchant commerce generator</p>
          </div>
        </div>

        {/* Demo Tag */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <UserCheck className="w-3.5 h-3.5" />
          No login required
        </div>
      </div>

      {/* Admin Panel Layout */}
      <div className="flex flex-grow overflow-hidden">
        
        {/* Left Tab Sidebar (Slim on mobile, expanded on desktop) */}
        <div className="w-16 md:w-56 bg-slate-50 border-r border-slate-100 flex flex-col justify-between py-4 select-none">
          <div className="space-y-1 px-2">
            {[
              { id: 'general', label: 'General Settings', icon: Settings },
              { id: 'products', label: 'Product Catalog', icon: ShoppingBag },
              { id: 'location', label: 'Map & Location', icon: MapPin },
              { id: 'payments', label: 'Payments & QR', icon: CreditCard },
              { id: 'analytics', label: 'Metrics & Data', icon: BarChart2 },
              { id: 'share', label: 'Share & Flyers', icon: Share2 },
            ].map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setIsAddingProduct(false);
                  }}
                  type="button"
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                  title={tab.label}
                >
                  <IconComp className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="hidden md:inline truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="px-3">
            <div className="hidden md:block bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-xl border border-indigo-100/50 text-[10px] text-indigo-700 leading-relaxed">
              <span className="font-bold block mb-0.5">💡 Pro Tip</span>
              Changes update the live preview panel immediately. No save button required!
            </div>
          </div>
        </div>

        {/* Workspace Body */}
        <div className="flex-grow p-6 overflow-y-auto bg-white">
          
          {!isAddingProduct ? (
            <>
              {/* TAB 1: General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                      <Settings className="w-5 h-5 text-slate-500" />
                      General Shop Identity
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">Customize your brand logo, name, header, and visual theme color.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Shop Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Shop Name</label>
                      <input
                        type="text"
                        value={data.shopName}
                        onChange={(e) => onUpdateData({ shopName: e.target.value })}
                        placeholder="e.g. Bella's Artisan Bakery"
                        className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-100 focus:outline-none"
                      />
                    </div>

                    {/* Shop Subtitle */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Shop Subtitle / Tagline</label>
                      <input
                        type="text"
                        value={data.shopSubtitle}
                        onChange={(e) => onUpdateData({ shopSubtitle: e.target.value })}
                        placeholder="e.g. Handmade pastries & custom bakery logs"
                        className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-100 focus:outline-none"
                      />
                    </div>

                    {/* WhatsApp Contact */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block flex items-center gap-1">
                        WhatsApp Business Number
                        <span className="text-[9px] font-normal text-slate-400">(incl. Country Code)</span>
                      </label>
                      <input
                        type="text"
                        value={data.whatsappNumber}
                        onChange={(e) => onUpdateData({ whatsappNumber: e.target.value })}
                        placeholder="e.g. 15550199999"
                        className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-100 focus:outline-none"
                      />
                      <span className="text-[9px] text-slate-400 leading-relaxed block mt-0.5">Used for instant Click-to-Order WhatsApp routes. Numbers only, no spaces.</span>
                    </div>

                    {/* Regular Call Contact */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Direct Call Contact</label>
                      <input
                        type="text"
                        value={data.callNumber}
                        onChange={(e) => onUpdateData({ callNumber: e.target.value })}
                        placeholder="e.g. +1 (555) 019-9999"
                        className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-100 focus:outline-none"
                      />
                    </div>

                    {/* Logo upload / icon */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 block">Shop Logo / Avatar</label>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl select-none">
                          {data.logoUrl?.startsWith('http') || data.logoUrl?.startsWith('data:') ? (
                            <img src={data.logoUrl} alt="Logo preview" className="w-full h-full object-cover rounded-full" />
                          ) : (
                            data.logoUrl || '🍞'
                          )}
                        </div>
                        <div className="flex-grow flex gap-1.5">
                          <input
                            type="text"
                            value={data.logoUrl}
                            onChange={(e) => onUpdateData({ logoUrl: e.target.value })}
                            placeholder="Enter single emoji or Image URL"
                            className="flex-grow px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-100 focus:outline-none"
                          />
                          <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-600 text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                            <Upload className="w-3.5 h-3.5" />
                            File
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, 'logo')}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Cover image upload */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 block">Cover / Header Banner Image</label>
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-10 rounded bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
                          {data.coverUrl ? (
                            <img src={data.coverUrl} alt="Cover preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-slate-100" />
                          )}
                        </div>
                        <div className="flex-grow flex gap-1.5">
                          <input
                            type="text"
                            value={data.coverUrl}
                            onChange={(e) => onUpdateData({ coverUrl: e.target.value })}
                            placeholder="Cover image Unsplash URL"
                            className="flex-grow px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-100 focus:outline-none"
                          />
                          <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-600 text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                            <Upload className="w-3.5 h-3.5" />
                            File
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, 'cover')}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* About shop */}
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">About Shop Description</label>
                      <textarea
                        value={data.aboutText}
                        onChange={(e) => onUpdateData({ aboutText: e.target.value })}
                        placeholder="Write a brief background about your local store, products, and community connection..."
                        rows={3}
                        className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-100 focus:outline-none"
                      />
                    </div>

                    {/* Currency selection & theme color selection */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Pricing Currency Sign</label>
                      <select
                        value={data.currency}
                        onChange={(e) => onUpdateData({ currency: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-100 focus:outline-none bg-white"
                      >
                        <option value="$">USD ($)</option>
                        <option value="₹">INR (₹)</option>
                        <option value="€">EUR (€)</option>
                        <option value="£">GBP (£)</option>
                        <option value="¥">JPY/CNY (¥)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 block">Brand Accent Theme</label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {(Object.keys(THEMES) as ShopTheme[]).map((tId) => {
                          const t = THEMES[tId];
                          const isSelected = data.theme === tId;
                          return (
                            <button
                              key={tId}
                              onClick={() => onUpdateData({ theme: tId })}
                              type="button"
                              className={`py-1.5 px-2 rounded-lg text-[10px] font-semibold text-center border transition-all cursor-pointer ${
                                isSelected 
                                  ? `${t.bgLight} border-slate-900 ring-1 ring-slate-900`
                                  : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                              }`}
                            >
                              <div className={`w-3 h-3 rounded-full mx-auto mb-1 bg-gradient-to-tr ${t.gradient}`} />
                              <span className="block truncate">{t.name.split(' ')[0]}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 2: Products List */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                        <ShoppingBag className="w-5 h-5 text-slate-500" />
                        Products Catalog
                        <span className="text-xs font-normal text-slate-400">({data.products.length} items)</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">Manage products showcased on your public website.</p>
                    </div>
                    <button
                      onClick={openAddProduct}
                      type="button"
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Product
                    </button>
                  </div>

                  {data.products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center">
                      <ShoppingBag className="w-12 h-12 text-slate-300 mb-3 animate-pulse" />
                      <h3 className="font-bold text-slate-800 text-sm">Your catalog is completely empty</h3>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
                        Create your first product to begin. Customers will be able to order them directly on WhatsApp.
                      </p>
                      <button
                        onClick={openAddProduct}
                        type="button"
                        className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
                      >
                        Create First Product
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {data.products.map((p) => (
                        <div key={p.id} className="flex gap-4 p-4 rounded-xl border border-slate-100 shadow-xs bg-slate-50 hover:bg-slate-100/50 transition-colors">
                          <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-slate-300">
                            {p.imageUrl ? (
                              <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <ShoppingBag className="w-6 h-6" />
                            )}
                          </div>
                          
                          <div className="flex-grow min-w-0 flex flex-col justify-between">
                            <div className="space-y-0.5">
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold text-xs text-slate-800 truncate pr-2">{p.name}</h4>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                  p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {p.inStock ? 'In Stock' : 'Sold Out'}
                                </span>
                              </div>
                              <span className="text-[10px] font-semibold text-slate-400 block tracking-wider uppercase">{p.category}</span>
                              <span className="text-xs font-black text-slate-900 block mt-1">{data.currency}{p.price.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-end gap-1.5 pt-2">
                              <button
                                onClick={() => openEditProduct(p)}
                                type="button"
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 cursor-pointer"
                                title="Edit product"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                type="button"
                                className="p-1.5 rounded-lg border border-slate-200 text-rose-600 bg-white hover:bg-rose-50 cursor-pointer"
                                title="Delete product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Location / Map */}
              {activeTab === 'location' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-5 h-5 text-slate-500" />
                      Location & Google Maps Integration
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">Embed your shop address and coordinates to let customers locate you.</p>
                  </div>

                  <div className="space-y-4">
                    {/* Plain Text Address */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Shop Street Address</label>
                      <input
                        type="text"
                        value={data.addressText}
                        onChange={(e) => onUpdateData({ addressText: e.target.value })}
                        placeholder="e.g. 124 Baker's Lane, Downtown Commercial District"
                        className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-100 focus:outline-none"
                      />
                    </div>

                    {/* Google Maps Embed Input */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block flex items-center justify-between">
                        Google Maps Embed Link / Code
                        <span className="text-[10px] font-normal text-slate-400">Copy iframe or Maps URL</span>
                      </label>
                      <textarea
                        value={data.googleMapsEmbed}
                        onChange={(e) => onUpdateData({ googleMapsEmbed: e.target.value })}
                        placeholder="Paste Google Maps iframe HTML or regular map link..."
                        rows={4}
                        className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-100 focus:outline-none font-mono"
                      />
                    </div>

                    {/* Instructions Block */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs text-slate-600 leading-relaxed space-y-2">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <HelpCircle className="w-4 h-4 text-slate-400" />
                        How to get your Google Maps Embed code:
                      </span>
                      <ol className="list-decimal pl-4 space-y-1.5">
                        <li>Go to <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-semibold underline inline-flex items-center gap-0.5">Google Maps <ExternalLink className="w-3 h-3" /></a> and search for your shop name or address.</li>
                        <li>Click the <strong>"Share"</strong> button on the left sidebar.</li>
                        <li>Select the <strong>"Embed a map"</strong> tab.</li>
                        <li>Click <strong>"Copy HTML"</strong> and paste the code directly in the box above!</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Payments / QR */}
              {activeTab === 'payments' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                      <CreditCard className="w-5 h-5 text-slate-500" />
                      Payments Configurations
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">Let clients pay you instantly. QR codes appear beautifully at shop checkout.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* UPI Identifier for Auto Generator */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">UPI ID / Address (India QR payments)</label>
                      <input
                        type="text"
                        value={data.paymentUpi}
                        onChange={(e) => onUpdateData({ paymentUpi: e.target.value })}
                        placeholder="e.g. yourname@paytm or shop@upi"
                        className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-100 focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        If provided, LSB automatically generates a compliant UPI QR code dynamically for GPay, PhonePe, and Paytm!
                      </span>
                    </div>

                    {/* Custom upload QR */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 block">Custom QR Code Image (Alternative)</label>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={data.paymentQrUrl}
                          onChange={(e) => onUpdateData({ paymentQrUrl: e.target.value })}
                          placeholder="Or paste QR Code image link..."
                          className="flex-grow px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-100 focus:outline-none"
                        />
                        <label className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-600 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0">
                          <Upload className="w-4 h-4" />
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'qr')}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Live Flyer Mock */}
                    {(data.paymentQrUrl || data.paymentUpi) && (
                      <div className="sm:col-span-2 p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex flex-col sm:flex-row items-center gap-5 justify-between">
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded-full uppercase tracking-wider">Payments Active</span>
                          <h4 className="font-bold text-sm text-slate-800 mt-1">Live Payment Section Configured Successfully</h4>
                          <p className="text-xs text-slate-500 max-w-md">
                            Customers can now view, download, or scan your pay flyer from any device during checkouts or browsing.
                          </p>
                        </div>
                        
                        <div className="shrink-0 bg-white p-2 rounded-xl shadow-xs border border-slate-100 text-center">
                          {data.paymentQrUrl ? (
                            <img src={data.paymentQrUrl} alt="QR preview" className="w-24 h-24 object-contain" />
                          ) : (
                            <img 
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=${data.paymentUpi}&pn=${encodeURIComponent(data.shopName)}`)}`} 
                              alt="UPI QR preview" 
                              className="w-24 h-24 object-contain" 
                            />
                          )}
                          <span className="text-[9px] font-mono font-semibold text-slate-400 mt-1 block">Scannable pay preview</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: Analytics Panel */}
              {activeTab === 'analytics' && (
                <AnalyticsPanel
                  analytics={data.analytics}
                  products={data.products}
                  currency={data.currency}
                  onResetAnalytics={handleResetAnalytics}
                  onSimulateVisit={handleSimulateVisit}
                />
              )}

              {/* TAB 6: Share and Flyers */}
              {activeTab === 'share' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                      <Share2 className="w-5 h-5 text-slate-500" />
                      Promote Your Shop
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">Export custom store scannable flyers, share links, and start driving instant sales.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
                    {/* Left flyer representation */}
                    <div className="sm:col-span-1">
                      <QRGenerator
                        data={shopUrl}
                        title={data.shopName || 'Local Shop'}
                        logoEmoji={data.logoUrl?.startsWith('http') ? '🏪' : data.logoUrl || '🏪'}
                        accentColor="#4f46e5"
                      />
                    </div>

                    {/* Right Instructions */}
                    <div className="sm:col-span-2 space-y-4">
                      {/* Active Shop Link card */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Your Public Shop URL</span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            readOnly
                            value={shopUrl}
                            onClick={(e) => (e.target as any).select()}
                            className="flex-grow px-3 py-2 text-xs border border-slate-200 bg-white rounded-xl focus:outline-none font-mono text-slate-600 cursor-pointer"
                          />
                          <a
                            href={shopUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            Visit
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      {/* Instructions */}
                      <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                        <h4 className="font-bold text-slate-800 flex items-center gap-1 text-sm">
                          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                          Start Selling Immediately:
                        </h4>
                        <ul className="space-y-2 list-disc pl-4">
                          <li><strong>Download Scannable Flyer</strong>: Hit the export button on the QR card. Print the PNG file and place it on your store front or billing desk.</li>
                          <li><strong>WhatsApp QR Share</strong>: Customers can scan this code to browse your catalog and order items while sitting at home.</li>
                          <li><strong>Social Media Bio</strong>: Copy the live shop URL and paste it in your Instagram, Facebook, or WhatsApp business bio.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* PRODUCT EDIT/ADD SUB-FORM VIEW */
            <form onSubmit={handleSaveProduct} className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {editingProduct ? 'Edit Product Details' : 'Add New Product'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Specify product specs, price, categories, and inventory status.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="px-3 py-1.5 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Product Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 block">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    placeholder="e.g. Fresh Artisanal Sourdough"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-100 focus:outline-none"
                  />
                </div>

                {/* Product Price */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 block">Price ({data.currency}) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={pPrice || ''}
                    onChange={(e) => setPPrice(parseFloat(e.target.value) || 0)}
                    placeholder="e.g. 8.50"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-100 focus:outline-none"
                  />
                </div>

                {/* Product Category */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 block">Category</label>
                  <input
                    type="text"
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value)}
                    placeholder="e.g. Breads, Pastries, Apparel"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-100 focus:outline-none"
                    list="category-suggestions"
                  />
                  <datalist id="category-suggestions">
                    <option value="Breads" />
                    <option value="Pastries" />
                    <option value="Desserts" />
                    <option value="Apparel" />
                    <option value="Mugs" />
                    <option value="Wellness" />
                  </datalist>
                </div>

                {/* Stock Toggle */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 block">Availability Status</label>
                  <div className="flex items-center gap-4 pt-1.5">
                    <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        checked={pInStock}
                        onChange={() => setPInStock(true)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      In Stock
                    </label>
                    <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        checked={!pInStock}
                        onChange={() => setPInStock(false)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      Sold Out
                    </label>
                  </div>
                </div>

                {/* Product Description */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-600 block">Product Description</label>
                  <textarea
                    value={pDesc}
                    onChange={(e) => setPDesc(e.target.value)}
                    placeholder="Describe product highlights, ingredients, sizing, and dimensions..."
                    rows={3}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-100 focus:outline-none"
                  />
                </div>

                {/* Product Image Section */}
                <div className="sm:col-span-2 space-y-3">
                  <label className="text-xs font-bold text-slate-600 block">Product Image Setup</label>
                  
                  {/* Selector tabs for Image setups */}
                  <div className="flex border-b border-slate-100 text-xs font-semibold">
                    {[
                      { id: 'preset', label: 'Preset Gallery' },
                      { id: 'url', label: 'Remote Image URL' },
                      { id: 'upload', label: 'Upload Local File' }
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setImageTab(t.id as any)}
                        className={`px-4 py-2 border-b-2 cursor-pointer ${
                          imageTab === t.id 
                            ? 'border-indigo-600 text-indigo-600 font-bold' 
                            : 'border-transparent text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab 1: Presets selection */}
                  {imageTab === 'preset' && (
                    <div className="space-y-4 pt-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-500 font-medium">Select a high-resolution placeholder matching your shop niche:</p>
                      <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                        {PLACEHOLDER_IMAGES.map((group) => (
                          <div key={group.category} className="space-y-1.5">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{group.category}</span>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                              {group.images.map((img) => {
                                const isSelected = pImageUrl === img.url;
                                return (
                                  <button
                                    key={img.name}
                                    type="button"
                                    onClick={() => selectPresetImage(img.url)}
                                    className={`relative aspect-square rounded-lg border-2 overflow-hidden hover:scale-102 transition-all cursor-pointer ${
                                      isSelected ? 'border-indigo-600 shadow-sm' : 'border-slate-200'
                                    }`}
                                    title={img.name}
                                  >
                                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                                    {isSelected && (
                                      <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                                        <div className="p-0.5 bg-indigo-600 text-white rounded-full">
                                          <Check className="w-3.5 h-3.5" />
                                        </div>
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Custom URL */}
                  {imageTab === 'url' && (
                    <div className="pt-1">
                      <input
                        type="url"
                        value={pImageUrl}
                        onChange={(e) => setPImageUrl(e.target.value)}
                        placeholder="Paste Unsplash or direct image link URL..."
                        className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-100 focus:outline-none"
                      />
                    </div>
                  )}

                  {/* Tab 3: Local Upload */}
                  {imageTab === 'upload' && (
                    <div className="pt-1">
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-slate-100/50 p-6 rounded-xl cursor-pointer transition-colors text-center">
                        <Upload className="w-6 h-6 text-slate-400 mb-2" />
                        <span className="text-xs font-bold text-slate-600">Click to upload product photo</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Supports PNG, JPG, or WebP up to 3MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'product')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}

                  {/* Image Preview Window */}
                  {pImageUrl && (
                    <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100 w-fit">
                      <div className="w-10 h-10 rounded border border-slate-200 overflow-hidden shrink-0">
                        <img src={pImageUrl} alt="Product preview" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-700 block">Image Assigned Successfully</span>
                        <button 
                          onClick={() => setPImageUrl('')}
                          type="button" 
                          className="text-[9px] text-rose-600 font-semibold hover:underline cursor-pointer"
                        >
                          Remove Photo
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Product Button */}
              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <button
                  type="submit"
                  className="flex-grow py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  {editingProduct ? 'Update Product specifications' : 'Add Product to Catalog'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="px-5 py-3 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 cursor-pointer"
                >
                  Back
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
