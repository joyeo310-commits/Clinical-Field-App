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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Brand title wordmark (single text element) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#00685f] text-white flex items-center justify-center font-bold text-base sm:text-lg shadow-xs">
            CP
          </div>
          <button 
            onClick={() => setActiveTab('feed')} 
            className="text-left group cursor-pointer focus:outline-hidden"
          >
            <div className="text-base sm:text-lg font-bold tracking-tight text-[#131b2e] group-hover:text-[#00685f] transition-colors leading-tight">
              Clinical Field App
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#3d4947] tracking-wider uppercase font-semibold">
              Singapore Rep Suite
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
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-semibold text-[#131b2e] leading-tight">Marcus Lee</span>
            <span className="text-[11px] text-[#3d4947]">Novena & Central</span>
          </div>

          <button
            onClick={onOpenQuickLog}
            className="min-h-[40px] sm:min-h-[44px] px-3 sm:px-4 py-1.5 sm:py-2 bg-[#00685f] text-white rounded-lg hover:bg-[#005049] transition-all text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-xs active:scale-[0.98]"
            title="Log rep interaction with doctor"
          >
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Check In</span>
          </button>
        </div>
      </div>

      {/* Sub-strip: Operational territory status banner (compact on mobile) */}
      <div className="bg-[#f2f3ff] border-t border-[#dae2fd] px-3 sm:px-6 py-1 sm:py-1.5 text-[11px] sm:text-xs text-[#3d4947]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse shrink-0"></span>
            <span className="font-medium text-[#131b2e] truncate">SG Central & Novena</span>
            <span className="text-[#6d7a77] hidden md:inline">·</span>
            <span className="text-[#3d4947] hidden md:inline">Visiting Window: 12:30 PM – 2:30 PM</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 tabular-nums font-mono text-[10px] sm:text-[11px] shrink-0">
            <span className="text-[#00685f] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{completedStopsCount}/{totalStopsCount} Done</span>
            </span>
            <span className="text-[#6d7a77] hidden xs:inline">|</span>
            <span className="text-[#3d4947] hidden xs:inline">4.2°C Cold Chain</span>
          </div>
        </div>
      </div>
    </header>
  );
};
