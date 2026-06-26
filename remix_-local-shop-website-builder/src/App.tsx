import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ShopData, Product, Analytics, ShopTheme } from './types';
import { TEMPLATES } from './constants';
import AdminPanel from './components/AdminPanel';
import ShopPreview from './components/ShopPreview';
import { 
  Laptop, 
  Smartphone, 
  Columns, 
  Sparkles, 
  ExternalLink, 
  RotateCcw, 
  TrendingUp, 
  ShoppingBag, 
  HelpCircle,
  Eye,
  CheckCircle2,
  Download,
  Upload,
  Trash2,
  Check
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'lsb_shop_data';

export default function App() {
  const [data, setData] = useState<ShopData>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Guarantee analytics objects exist
        if (!parsed.analytics) {
          parsed.analytics = { views: 142, whatsappClicks: 24, clicksByProductId: {} };
        }
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load shop data', e);
    }
    return TEMPLATES.bakery; // Fallback default
  });

  // Client Hash Router state
  const [viewMode, setViewMode] = useState<'builder' | 'admin' | 'shop'>('builder');
  // Interactive device frame mode in Shop view ('desktop' or 'mobile')
  const [deviceFrame, setDeviceFrame] = useState<'desktop' | 'mobile'>('desktop');
  // Success toast config
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState({
    title: 'Template Applied!',
    desc: 'Products & info loaded successfully.'
  });

  // Save status indicator ('idle' or 'saved')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
  const isFirstRender = useRef(true);

  // Synchronize state changes to localStorage
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      setSaveStatus('saved');
      const timer = setTimeout(() => {
        setSaveStatus('idle');
      }, 1500);
      return () => clearTimeout(timer);
    } catch (e) {
      console.error('Failed to save shop data', e);
    }
  }, [data]);

  // Handle standard Hash Router
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/shop' || hash.includes('/shop')) {
        setViewMode('shop');
      } else if (hash === '#/admin' || hash.includes('/admin')) {
        setViewMode('admin');
      } else {
        setViewMode('builder'); // Split builder mode
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Increment view counter on load for Shop preview (simulating a real customer entry)
  useEffect(() => {
    if (viewMode === 'shop') {
      setData(prev => ({
        ...prev,
        analytics: {
          ...prev.analytics,
          views: (prev.analytics?.views || 0) + 1
        }
      }));
    }
  }, [viewMode]);

  // Handle general state updates
  const handleUpdateData = (newData: Partial<ShopData>) => {
    setData(prev => ({
      ...prev,
      ...newData
    }));
  };

  // Callback to track individual product details views
  const handleTrackProductClick = (productId: string) => {
    setData(prev => {
      const currentClicks = prev.analytics?.clicksByProductId || {};
      return {
        ...prev,
        analytics: {
          ...prev.analytics,
          clicksByProductId: {
            ...currentClicks,
            [productId]: (currentClicks[productId] || 0) + 1
          }
        }
      };
    });
  };

  // Callback to track WhatsApp inquiries clicks
  const handleTrackWhatsappClick = () => {
    setData(prev => ({
      ...prev,
      analytics: {
        ...prev.analytics,
        whatsappClicks: (prev.analytics?.whatsappClicks || 0) + 1
      }
    }));
  };

  // Reset or Load alternate template directly
  const handleLoadTemplate = (templateId: keyof typeof TEMPLATES) => {
    const template = TEMPLATES[templateId];
    if (template) {
      setData(template);
      setToastContent({
        title: 'Template Applied!',
        desc: 'Products & info loaded successfully.'
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  // Export all builder configuration as a downloadable JSON backup
  const handleExportBackup = () => {
    try {
      const dataStr = JSON.stringify(data, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `${data.shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-backup.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      setToastContent({
        title: 'Backup Exported!',
        desc: `Configuration saved to ${exportFileDefaultName}`
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (e) {
      console.error('Failed to export backup', e);
      alert('Error exporting backup file.');
    }
  };

  // Import JSON backup configuration file and apply to builder
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = e.target.files?.[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        
        if (typeof parsed !== 'object' || parsed === null) {
          throw new Error('Invalid backup file format');
        }
        
        if (!parsed.shopName || !Array.isArray(parsed.products)) {
          throw new Error('Incompatible shop builder template format');
        }

        if (!parsed.analytics) {
          parsed.analytics = { views: 0, whatsappClicks: 0, clicksByProductId: {} };
        }

        setData(parsed);
        setToastContent({
          title: 'Backup Imported!',
          desc: 'Shop configuration restored successfully.'
        });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (error: any) {
        alert(`Failed to import backup: ${error.message || 'Invalid JSON format'}`);
      }
    };
    fileReader.readAsText(file);
    e.target.value = ''; // Clear value for consecutive same-file imports
  };

  // Reset entire builder dataset to a completely empty state template
  const handleClearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This will delete all products, reset the shop identity, and start completely fresh from scratch.')) {
      const blankShop: ShopData = {
        shopName: "My New Shop",
        shopSubtitle: "Welcome to my store",
        aboutText: "Tell your customers about your shop here.",
        whatsappNumber: "",
        callNumber: "",
        addressText: "",
        googleMapsEmbed: "",
        theme: 'slate',
        currency: '$',
        logoUrl: '🛍️',
        coverUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
        paymentUpi: '',
        paymentQrUrl: '',
        products: [],
        analytics: {
          views: 0,
          whatsappClicks: 0,
          clicksByProductId: {}
        }
      };
      
      setData(blankShop);
      setToastContent({
        title: 'All Data Cleared!',
        desc: 'Shop has been reset to a blank slate.'
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  // Calculate live shop standalone URL for clipboard
  const liveShopUrl = useMemo(() => {
    return `${window.location.origin}${window.location.pathname}#/shop`;
  }, []);

  const handleRouteTo = (mode: 'builder' | 'admin' | 'shop') => {
    if (mode === 'shop') window.location.hash = '/shop';
    else if (mode === 'admin') window.location.hash = '/admin';
    else window.location.hash = '';
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans select-none overflow-hidden">
      
      {/* Dynamic top builder control panel */}
      {viewMode !== 'shop' && (
        <div className="bg-slate-950 text-white border-b border-slate-800 px-6 py-3 shrink-0 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-slate-100 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
                {data.shopName}
              </span>
              <span className="text-xs text-slate-400 mr-2">Website Editor</span>
              
              {/* Auto-save saved status indicator */}
              {saveStatus === 'saved' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold transition-all animate-scale-in">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Saved ✓
                </span>
              )}
            </div>

            {/* Quick Template Switcher presets */}
            <div className="hidden lg:flex items-center gap-1.5 border-l border-slate-800 pl-4">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Starter:</span>
              <button
                onClick={() => handleLoadTemplate('bakery')}
                type="button"
                className={`px-2.5 py-1 text-[10px] rounded-md font-semibold transition-colors cursor-pointer ${
                  data.shopName.includes('Bakery') 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                    : 'text-slate-400 hover:text-white bg-slate-800/40'
                }`}
              >
                Bakery
              </button>
              <button
                onClick={() => handleLoadTemplate('boutique')}
                type="button"
                className={`px-2.5 py-1 text-[10px] rounded-md font-semibold transition-colors cursor-pointer ${
                  data.shopName.includes('Atelier') 
                    ? 'bg-slate-500/30 text-slate-300 border border-slate-500/30' 
                    : 'text-slate-400 hover:text-white bg-slate-800/40'
                }`}
              >
                Fashion
              </button>
              <button
                onClick={() => handleLoadTemplate('crafts')}
                type="button"
                className={`px-2.5 py-1 text-[10px] rounded-md font-semibold transition-colors cursor-pointer ${
                  data.shopName.includes('Clay') 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'text-slate-400 hover:text-white bg-slate-800/40'
                }`}
              >
                Crafts
              </button>
            </div>
          </div>

          {/* Center view toggler */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
            <button
              onClick={() => handleRouteTo('builder')}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === 'builder'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Split View: Builder + Live Preview side-by-side"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split Builder</span>
            </button>
            <button
              onClick={() => handleRouteTo('admin')}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === 'admin'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Full Screen Workspace Backoffice"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Full Admin</span>
            </button>
            <button
              onClick={() => handleRouteTo('shop')}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === 'shop'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Standalone Public Customer View"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Full Shop View</span>
            </button>
          </div>

          {/* Controls & Live link box */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={liveShopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer mr-2 shrink-0"
            >
              Open Standalone Shop
              <ExternalLink className="w-3 h-3" />
            </a>

            {/* Divider */}
            <div className="h-4 w-[1px] bg-slate-800 hidden sm:block shrink-0" />

            {/* Backup Export Button */}
            <button
              onClick={handleExportBackup}
              type="button"
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg border border-slate-800 transition-all cursor-pointer font-medium"
              title="Download backup file of your shop configuration (JSON)"
            >
              <Download className="w-3 h-3" />
              <span>Export Backup</span>
            </button>

            {/* Backup Import Button */}
            <label
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg border border-slate-800 transition-all cursor-pointer font-medium"
              title="Upload previous backup file to restore shop (JSON)"
            >
              <Upload className="w-3 h-3" />
              <span>Import Backup</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>

            {/* Clear All Data Button */}
            <button
              onClick={handleClearAllData}
              type="button"
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg border border-rose-500/20 transition-all cursor-pointer font-medium"
              title="Delete all custom data and start with a blank shop"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          </div>
        </div>
      )}

      {/* Workspace Display Container */}
      <div className="flex-grow flex overflow-hidden">
        
        {/* VIEW MODE 1: Split Builder (Split Screen) */}
        {viewMode === 'builder' && (
          <div className="w-full flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-800">
            
            {/* Left Frame: Admin Workspace Builder */}
            <div className="w-full md:w-1/2 h-full overflow-hidden bg-white">
              <AdminPanel
                data={data}
                onUpdateData={handleUpdateData}
                shopUrl={liveShopUrl}
              />
            </div>

            {/* Right Frame: Live Interactive Shop Preview with frame selector */}
            <div className="w-full md:w-1/2 h-full bg-slate-950 flex flex-col overflow-hidden">
              {/* Frame size selector toolbar */}
              <div className="px-5 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Website Preview
                </span>
                
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
                  <button
                    onClick={() => setDeviceFrame('desktop')}
                    type="button"
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                      deviceFrame === 'desktop' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                    }`}
                    title="Desktop Preview mode"
                  >
                    <Laptop className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeviceFrame('mobile')}
                    type="button"
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                      deviceFrame === 'mobile' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                    }`}
                    title="Mobile View Simulator mode"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Render viewport */}
              <div className="flex-grow p-4 overflow-y-auto flex items-start justify-center">
                {deviceFrame === 'mobile' ? (
                  /* Elegant Mobile Device Frame */
                  <div className="relative mx-auto w-[320px] h-[580px] bg-slate-900 rounded-[40px] border-[8px] border-slate-800 shadow-2xl overflow-hidden flex flex-col shrink-0">
                    {/* Device Speaker */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-slate-800 rounded-full z-20" />
                    <div className="flex-grow overflow-y-auto no-scrollbar rounded-[28px]">
                      <ShopPreview
                        data={data}
                        onTrackProductClick={handleTrackProductClick}
                        onTrackWhatsappClick={handleTrackWhatsappClick}
                      />
                    </div>
                  </div>
                ) : (
                  /* Fluid responsive simulated screen */
                  <div className="w-full h-full max-w-4xl bg-slate-50 rounded-xl overflow-hidden border border-slate-800 shadow-xl flex flex-col">
                    <div className="flex-grow overflow-y-auto">
                      <ShopPreview
                        data={data}
                        onTrackProductClick={handleTrackProductClick}
                        onTrackWhatsappClick={handleTrackWhatsappClick}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* VIEW MODE 2: Full Admin Only */}
        {viewMode === 'admin' && (
          <div className="w-full h-full bg-white">
            <AdminPanel
              data={data}
              onUpdateData={handleUpdateData}
              shopUrl={liveShopUrl}
            />
          </div>
        )}

        {/* VIEW MODE 3: Full Standalone Shop View (For Customer Presentation) */}
        {viewMode === 'shop' && (
          <div className="w-full h-full overflow-y-auto bg-slate-50 relative">
            <ShopPreview
              data={data}
              onTrackProductClick={handleTrackProductClick}
              onTrackWhatsappClick={handleTrackWhatsappClick}
              isStandalone={true}
            />

            {/* Hidden float return back button for mock design testing */}
            <div className="fixed top-4 right-4 z-40">
              <button
                onClick={() => handleRouteTo('builder')}
                type="button"
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-full text-xs font-bold shadow-lg transition-all flex items-center gap-1.5 hover:scale-103 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Return to Editor
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Dynamic Action Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-950 text-white border border-slate-800 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <div className="text-left">
            <span className="text-xs font-bold block">{toastContent.title}</span>
            <span className="text-[10px] text-slate-400">{toastContent.desc}</span>
          </div>
        </div>
      )}

    </div>
  );
}
