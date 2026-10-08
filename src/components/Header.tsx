import React from 'react';
import { MapPin, Navigation, Package, Calendar, Clock, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'feed' | 'map' | 'schedule' | 'samples';
  setActiveTab: (tab: 'feed' | 'map' | 'schedule' | 'samples') => void;
  completedStopsCount: number;
  totalStopsCount: number;
  onOpenQuickLog?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  completedStopsCount,
  totalStopsCount,
  onOpenQuickLog,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#ffffff] border-b border-[#e2e7ff] shadow-xs">
      {/* Top Bar Contract: 3 zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand title wordmark (single text element) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-[#00685f] text-white flex items-center justify-center font-bold text-lg shadow-xs">
            CP
          </div>
          <button 
            onClick={() => setActiveTab('feed')} 
            className="text-left group cursor-pointer focus:outline-hidden"
          >
            <div className="text-lg font-bold tracking-tight text-[#131b2e] group-hover:text-[#00685f] transition-colors leading-tight">
              Clinical Field App
            </div>
            <div className="text-[11px] text-[#3d4947] tracking-wider uppercase font-semibold">
              Singapore Medical Rep Suite
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Clean text links with active indicator) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => setActiveTab('feed')}
            className={`min-h-[44px] px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'feed'
                ? 'bg-[#eaedff] text-[#00685f] font-semibold'
                : 'text-[#3d4947] hover:text-[#131b2e] hover:bg-[#f2f3ff]'
            }`}
          >
            <MapPin className="w-4 h-4 shrink-0 text-[#00685f]" />
            <span>Clinic Directory</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`min-h-[44px] px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'map'
                ? 'bg-[#eaedff] text-[#00685f] font-semibold'
                : 'text-[#3d4947] hover:text-[#131b2e] hover:bg-[#f2f3ff]'
            }`}
          >
            <Navigation className="w-4 h-4 shrink-0 text-[#006398]" />
            <span>Territory Map</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`min-h-[44px] px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'schedule'
                ? 'bg-[#eaedff] text-[#00685f] font-semibold'
                : 'text-[#3d4947] hover:text-[#131b2e] hover:bg-[#f2f3ff]'
            }`}
          >
            <Calendar className="w-4 h-4 shrink-0 text-[#006948]" />
            <span>Today's Route</span>
            <span className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded-full bg-[#dae2fd] text-[#131b2e]">
              {completedStopsCount}/{totalStopsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('samples')}
            className={`min-h-[44px] px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'samples'
                ? 'bg-[#eaedff] text-[#00685f] font-semibold'
                : 'text-[#3d4947] hover:text-[#131b2e] hover:bg-[#f2f3ff]'
            }`}
          >
            <Package className="w-4 h-4 shrink-0 text-[#00685f]" />
            <span>Sample Bag</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary contextual actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-semibold text-[#131b2e] leading-tight">Marcus Lee</span>
            <span className="text-[11px] text-[#3d4947]">Novena & Central Rep</span>
          </div>

          <button
            onClick={onOpenQuickLog}
            className="min-h-[44px] px-4 py-2 bg-[#00685f] text-white rounded-lg hover:bg-[#005049] transition-all text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs active:scale-[0.98]"
            title="Log rep interaction with doctor"
          >
            <Clock className="w-4 h-4 shrink-0" />
            <span className="hidden xs:inline">Check In Visit</span>
            <span className="xs:hidden">Log</span>
          </button>
        </div>
      </div>

      {/* Sub-strip: Operational territory status banner */}
      <div className="bg-[#f2f3ff] border-t border-[#dae2fd] px-4 sm:px-6 py-1.5 text-xs text-[#3d4947]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"></span>
            <span className="font-medium text-[#131b2e]">Territory Live: Singapore Central & Novena</span>
            <span className="text-[#6d7a77] hidden sm:inline">·</span>
            <span className="text-[#3d4947] hidden sm:inline">Peak Rep Visiting Window: 12:30 PM – 2:30 PM</span>
          </div>
          <div className="flex items-center gap-3 tabular-nums font-mono text-[11px]">
            <span className="text-[#00685f] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {completedStopsCount} of {totalStopsCount} Visited
            </span>
            <span className="text-[#6d7a77]">|</span>
            <span className="text-[#3d4947]">Cold Chain: 4.2°C (Compliant)</span>
          </div>
        </div>
      </div>
    </header>
  );
};
