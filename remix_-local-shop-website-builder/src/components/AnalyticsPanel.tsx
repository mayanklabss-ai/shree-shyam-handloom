import { Analytics, Product } from '../types';
import { Eye, MessageSquare, TrendingUp, Sparkles, RefreshCw, BarChart2 } from 'lucide-react';

interface AnalyticsPanelProps {
  analytics: Analytics;
  products: Product[];
  currency: string;
  onResetAnalytics: () => void;
  onSimulateVisit: () => void;
}

export default function AnalyticsPanel({
  analytics,
  products,
  currency,
  onResetAnalytics,
  onSimulateVisit,
}: AnalyticsPanelProps) {
  const views = analytics.views || 0;
  const clicks = analytics.whatsappClicks || 0;
  
  // Calculate Conversion Rate
  const conversionRate = views > 0 ? ((clicks / views) * 100).toFixed(1) : '0.0';

  // Calculate estimated revenue potential (assuming average item price)
  const averagePrice = products.length > 0 
    ? products.reduce((acc, p) => acc + p.price, 0) / products.length 
    : 0;
  const potentialValue = clicks * averagePrice;

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Business Performance</h3>
          <p className="text-xs text-slate-500 mt-0.5">Real-time visitor traffic and inquiry conversion metrics.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onSimulateVisit}
            type="button"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 rounded-lg transition-colors border border-indigo-100 cursor-pointer"
            title="Simulate a new customer visiting your page to increase view count"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
            Simulate Visit
          </button>
          <button
            onClick={onResetAnalytics}
            type="button"
            className="px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Grid of Key Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Stat 1: Total Views */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-start gap-4">
          <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Total Page Views</span>
            <span className="text-2xl font-bold text-slate-800 mt-1 block">
              {views.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-600 font-medium mt-0.5 block flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              100% organic traffic
            </span>
          </div>
        </div>

        {/* Stat 2: WhatsApp Clicks */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-start gap-4">
          <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-lg">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">WhatsApp Enquiries</span>
            <span className="text-2xl font-bold text-slate-800 mt-1 block">
              {clicks.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Clicks on "Buy Now" button
            </span>
          </div>
        </div>

        {/* Stat 3: Conversion Rate */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-start gap-4">
          <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Conversion Rate</span>
            <span className="text-2xl font-bold text-slate-800 mt-1 block">
              {conversionRate}%
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Visitor-to-enquiry ratio
            </span>
          </div>
        </div>
      </div>

      {/* Potential value block */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-semibold text-sm flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
            Estimated Sales Lead Value
          </h4>
          <p className="text-xs text-indigo-100 mt-0.5 max-w-md">
            Calculated based on generated WhatsApp checkout requests and average product prices.
          </p>
        </div>
        <div className="text-right sm:text-right text-center">
          <span className="text-2xl font-bold block">
            {currency}{potentialValue.toFixed(2)}
          </span>
          <span className="text-[10px] text-indigo-200 block">
            from {clicks} shopping cart clicks
          </span>
        </div>
      </div>

      {/* Product clicks breakdown */}
      <div className="border border-slate-100 rounded-xl p-4 bg-white">
        <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-slate-500" />
          Most In-Demand Products
        </h4>

        {products.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">Add products to start tracking interest.</p>
        ) : (
          <div className="space-y-4">
            {products.map((product) => {
              const productClicks = analytics.clicksByProductId?.[product.id] || 0;
              const percentage = clicks > 0 ? (productClicks / clicks) * 100 : 0;

              return (
                <div key={product.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700 truncate max-w-[200px]">{product.name}</span>
                    <span className="text-slate-500">
                      {productClicks} {productClicks === 1 ? 'click' : 'clicks'}
                    </span>
                  </div>
                  <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
