import { useState, useMemo } from 'react';
import { ShopData, Product } from '../types';
import { THEMES } from '../constants';
import { 
  Phone, 
  MapPin, 
  MessageSquare, 
  CreditCard, 
  Search, 
  Sparkles, 
  ShoppingBag, 
  X, 
  Clock, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';

interface ShopPreviewProps {
  data: ShopData;
  onTrackProductClick?: (productId: string) => void;
  onTrackWhatsappClick?: () => void;
  isStandalone?: boolean;
}

export default function ShopPreview({
  data,
  onTrackProductClick,
  onTrackWhatsappClick,
  isStandalone = false,
}: ShopPreviewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const themeConfig = THEMES[data.theme] || THEMES.emerald;

  // Clean WhatsApp number to only contain digits
  const cleanWhatsappNumber = useMemo(() => {
    return data.whatsappNumber.replace(/\D/g, '');
  }, [data.whatsappNumber]);

  // Generate WhatsApp Order Link
  const getWhatsappOrderUrl = (product: Product) => {
    const textMessage = `Hello *${data.shopName}*! I want to buy *${product.name}* (${data.currency}${product.price.toFixed(2)}) from your website.\n\nDescription: ${product.description}\n\nPlease confirm availability and payment details. Thank you!`;
    return `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(textMessage)}`;
  };

  // Generate general contact WhatsApp Link
  const getGeneralWhatsappUrl = () => {
    const textMessage = `Hello *${data.shopName}*! I visited your website and would like to make an enquiry.`;
    return `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(textMessage)}`;
  };

  // Extract categories dynamically
  const categories = useMemo(() => {
    const cats = new Set<string>();
    data.products.forEach(p => {
      if (p.category && p.category.trim() !== '') {
        cats.add(p.category.trim());
      }
    });
    return ['All', ...Array.from(cats)];
  }, [data.products]);

  // Filter products based on category and search
  const filteredProducts = useMemo(() => {
    return data.products.filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [data.products, selectedCategory, searchQuery]);

  const handleProductCardClick = (product: Product) => {
    setSelectedProduct(product);
    if (onTrackProductClick) {
      onTrackProductClick(product.id);
    }
  };

  const handleWhatsappAction = (product: Product) => {
    if (onTrackWhatsappClick) {
      onTrackWhatsappClick();
    }
    const url = getWhatsappOrderUrl(product);
    window.open(url, '_blank');
  };

  const handleGeneralWhatsappAction = () => {
    if (onTrackWhatsappClick) {
      onTrackWhatsappClick();
    }
    const url = getGeneralWhatsappUrl();
    window.open(url, '_blank');
  };

  // Helper to safely render Google Maps embed or link
  const renderMapsEmbed = () => {
    const embedCode = data.googleMapsEmbed?.trim() || '';
    if (!embedCode) {
      return (
        <div className="flex flex-col items-center justify-center py-10 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <MapPin className="w-8 h-8 text-slate-300 mb-2 animate-bounce-slow" />
          <p className="text-sm text-slate-500 font-medium">No map location embedded yet.</p>
          <p className="text-xs text-slate-400 mt-1">Configure Maps in Admin Panel to show location.</p>
        </div>
      );
    }

    // If it is a full iframe HTML string
    if (embedCode.includes('<iframe')) {
      // Safely modify height and width to fit our container
      let modifiedCode = embedCode
        .replace(/width="[^"]*"/, 'width="100%"')
        .replace(/height="[^"]*"/, 'height="260"');
      
      return (
        <div 
          className="rounded-xl overflow-hidden shadow-sm border border-slate-100 bg-slate-100 h-[260px] w-full"
          dangerouslySetInnerHTML={{ __html: modifiedCode }}
        />
      );
    }

    // If it's a URL only, construct iframe
    if (embedCode.startsWith('http://') || embedCode.startsWith('https://')) {
      return (
        <iframe
          src={embedCode}
          width="100%"
          height="260"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          className="rounded-xl shadow-sm border border-slate-100 bg-slate-100"
          referrerPolicy="no-referrer-when-downgrade"
        />
      );
    }

    // Default return as plain text with map pin
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-200 text-center">
        <MapPin className="w-7 h-7 text-indigo-500 mb-2" />
        <span className="text-sm font-medium text-slate-800 block mb-1">Our Location</span>
        <p className="text-xs text-slate-600 max-w-sm">{embedCode}</p>
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(embedCode)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5"
        >
          Open in Google Maps
        </a>
      </div>
    );
  };

  // UPI Payment QR code generator URL
  const generatedUpiQrUrl = data.paymentUpi 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=${data.paymentUpi}&pn=${encodeURIComponent(data.shopName)}&am=0&cu=INR`)}`
    : '';

  return (
    <div className={`relative min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans transition-all selection:bg-indigo-100`}>
      
      {/* Cover / Header section */}
      <div className="relative h-44 sm:h-56 w-full bg-slate-900 overflow-hidden">
        {data.coverUrl ? (
          <img 
            src={data.coverUrl} 
            alt={data.shopName} 
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-r ${themeConfig.gradient} opacity-80`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent" />
        
        {/* Floating Standalone Back-to-Admin Link for UX */}
        {isStandalone && (
          <div className="absolute top-4 left-4 z-20">
            <div className="bg-white/95 backdrop-blur shadow-md rounded-full px-3 py-1.5 text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Live Website View
            </div>
          </div>
        )}
      </div>

      {/* Main Container */}
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 -mt-16 relative z-10 flex-grow pb-24">
        {/* Shop Branding Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 mb-8">
          {/* Logo / Avatar */}
          <div className="w-20 h-20 bg-slate-50 shadow-inner rounded-full border-4 border-white flex items-center justify-center text-4xl select-none shrink-0 -mt-10 sm:mt-0">
            {data.logoUrl?.startsWith('http') || data.logoUrl?.startsWith('data:') ? (
              <img 
                src={data.logoUrl} 
                alt={data.shopName} 
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            ) : (
              data.logoUrl || '🍞'
            )}
          </div>
          
          <div className="flex-grow space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{data.shopName || 'My Local Shop'}</h1>
            <p className="text-sm text-slate-500 font-medium">{data.shopSubtitle || 'Welcome to our shop!'}</p>
            
            {/* Quick Contact Tags */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-3">
              {data.callNumber && (
                <a 
                  href={`tel:${data.callNumber}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-medium transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  {data.callNumber}
                </a>
              )}
              {data.addressText && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate max-w-[200px]">{data.addressText}</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0 justify-center">
            {cleanWhatsappNumber && (
              <button
                onClick={handleGeneralWhatsappAction}
                type="button"
                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 cursor-pointer`}
              >
                <MessageSquare className="w-4 h-4" />
                Chat Shop
              </button>
            )}
            {data.callNumber && (
              <a
                href={`tel:${data.callNumber}`}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border border-slate-200 text-slate-700 hover:bg-slate-50 active:bg-slate-100 bg-white transition-all text-center"
              >
                <Phone className="w-4 h-4 text-slate-500" />
                Call Now
              </a>
            )}
          </div>
        </div>

        {/* Content Tabs & Search Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* LEFT: About & Store Details (1 Column on Desktop) */}
          <div className="md:col-span-1 space-y-6">
            
            {/* About Section */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <Sparkles className="w-4.5 h-4.5 text-slate-400" />
                About Us
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {data.aboutText || 'No about description provided yet. We are dedicated to providing the best local experience.'}
              </p>
            </div>

            {/* Quick Contact & Map Embedded */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <MapPin className="w-4.5 h-4.5 text-slate-400" />
                Store Location
              </h3>
              <div className="space-y-3">
                {data.addressText && (
                  <p className="text-xs text-slate-600 flex items-start gap-1.5 leading-relaxed">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    {data.addressText}
                  </p>
                )}
                {renderMapsEmbed()}
              </div>
            </div>

            {/* Payment Section QR Code */}
            {(data.paymentQrUrl || data.paymentUpi) && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3 flex flex-col items-center text-center">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 w-full flex items-center justify-center gap-1.5">
                  <CreditCard className="w-4.5 h-4.5 text-slate-400" />
                  Instant Payment
                </h3>
                
                {data.paymentQrUrl ? (
                  <img 
                    src={data.paymentQrUrl} 
                    alt="Payment QR" 
                    className="w-40 h-40 object-contain rounded-lg border border-slate-100 p-1"
                    referrerPolicy="no-referrer"
                  />
                ) : generatedUpiQrUrl ? (
                  <img 
                    src={generatedUpiQrUrl} 
                    alt="UPI Payment QR" 
                    className="w-40 h-40 object-contain rounded-lg border border-slate-100 p-1"
                    referrerPolicy="no-referrer"
                  />
                ) : null}

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-700">Scan to pay directly</span>
                  {data.paymentUpi && (
                    <p className="text-[10px] font-mono text-slate-500 mt-0.5 break-all select-all">
                      UPI ID: {data.paymentUpi}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400 max-w-[180px] leading-relaxed mx-auto">
                    Use Google Pay, PhonePe, Paytm or any banking app.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Product Catalog Grid (2 Columns on Desktop) */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Search and Filters */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all text-slate-800"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Categories Tabs Carousel */}
              {categories.length > 1 && (
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      type="button"
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? themeConfig.primary
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Products Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                  <ShoppingBag className="w-5 h-5 text-slate-700" />
                  Our Products
                  <span className="text-xs font-normal text-slate-400">({filteredProducts.length} items)</span>
                </h2>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 shadow-sm border border-slate-100 text-center space-y-3">
                  <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto animate-pulse" />
                  <p className="text-sm text-slate-500 font-medium">No products match your criteria.</p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Try adjusting your search query or select another category.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductCardClick(product)}
                      className="group bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
                    >
                      {/* Image Frame */}
                      <div className="h-44 w-full bg-slate-50 relative overflow-hidden shrink-0">
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-1">
                            <ShoppingBag className="w-8 h-8" />
                            <span className="text-[10px]">No image uploaded</span>
                          </div>
                        )}

                        {/* Stock Status Tag */}
                        <div className="absolute top-2 right-2">
                          {product.inStock ? (
                            <span className="px-2 py-0.5 bg-emerald-100/90 backdrop-blur text-emerald-800 text-[10px] font-bold rounded-full">
                              In Stock
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-rose-100/90 backdrop-blur text-rose-800 text-[10px] font-bold rounded-full">
                              Sold Out
                            </span>
                          )}
                        </div>

                        {/* Category tag */}
                        {product.category && (
                          <div className="absolute bottom-2 left-2">
                            <span className="px-2 py-0.5 bg-slate-900/70 backdrop-blur text-white text-[9px] font-semibold rounded-md uppercase tracking-wider">
                              {product.category}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info body */}
                      <div className="p-4 flex flex-col flex-grow justify-between gap-4">
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {product.name}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed min-h-[2.5rem]">
                            {product.description || 'No description provided.'}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                          <span className="text-base font-extrabold text-slate-950">
                            {data.currency}{product.price.toFixed(2)}
                          </span>

                          <button
                            type="button"
                            disabled={!product.inStock}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWhatsappAction(product);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                              product.inStock 
                                ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            Buy
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Sticky Mobile Order Widget (Bottom Right) */}
      {cleanWhatsappNumber && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={handleGeneralWhatsappAction}
            type="button"
            className="w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 group cursor-pointer"
            title="Chat directly on WhatsApp"
          >
            <MessageSquare className="w-6 h-6 animate-pulse" />
            <span className="absolute right-16 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              WhatsApp Us
            </span>
          </button>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-xl animate-scale-in">
            {/* Modal Image Header */}
            <div className="h-64 bg-slate-100 relative">
              {selectedProduct.imageUrl ? (
                <img 
                  src={selectedProduct.imageUrl} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-1.5">
                  <ShoppingBag className="w-12 h-12" />
                  <span className="text-xs">No product image uploaded</span>
                </div>
              )}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-slate-800 p-1.5 rounded-full shadow-md transition-colors border border-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {selectedProduct.category && (
                <div className="absolute bottom-4 left-4">
                  <span className="px-2.5 py-1 bg-slate-900/80 text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
                    {selectedProduct.category}
                  </span>
                </div>
              )}
            </div>

            {/* Modal Details Body */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-950">{selectedProduct.name}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    {selectedProduct.inStock ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                        In stock, ready to dispatch
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        <AlertCircle className="w-3 h-3 text-rose-500" />
                        Temporarily out of stock
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-2xl font-extrabold text-slate-950 shrink-0">
                  {data.currency}{selectedProduct.price.toFixed(2)}
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Description</span>
                <p className="text-sm text-slate-600 leading-relaxed max-h-[120px] overflow-y-auto pr-1">
                  {selectedProduct.description || 'No description provided for this product.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  disabled={!selectedProduct.inStock}
                  onClick={() => handleWhatsappAction(selectedProduct)}
                  className={`flex-grow flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm shadow-sm transition-all text-white ${
                    selectedProduct.inStock
                      ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 cursor-pointer'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Order on WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-3 text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
