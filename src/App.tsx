import React, { useState } from 'react';
import { 
  INITIAL_CLINICS, 
  INITIAL_BAG_SAMPLES, 
  INITIAL_TODAY_ROUTE 
} from './data/clinicsData';
import { Clinic, RouteStop, BagSampleItem, HubRegion } from './types';
import { Header } from './components/Header';
import { ClinicCard } from './components/ClinicCard';
import { SingaporeMap } from './components/SingaporeMap';
import { RoutePlanner } from './components/RoutePlanner';
import { SampleBagManager } from './components/SampleBagManager';
import { ClinicDetailModal } from './components/ClinicDetailModal';
import { VisitLogModal } from './components/VisitLogModal';
import { QuickToast } from './components/QuickToast';
import { 
  Search, 
  Filter, 
  MapPin, 
  Navigation, 
  Calendar, 
  Package, 
  X,
  Stethoscope,
  Sparkles,
  PhoneCall
} from 'lucide-react';

export default function App() {
  const [clinics, setClinics] = useState<Clinic[]>(INITIAL_CLINICS);
  const [routeStops, setRouteStops] = useState<RouteStop[]>(INITIAL_TODAY_ROUTE);
  const [bagSamples, setBagSamples] = useState<BagSampleItem[]>(INITIAL_BAG_SAMPLES);
  
  // Navigation View State
  const [activeTab, setActiveTab] = useState<'feed' | 'map' | 'schedule' | 'samples'>('feed');

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHub, setSelectedHub] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE_NOW' | 'OPEN' | 'CHAS'>('ALL');

  // Modals & Popovers
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [visitLogClinic, setVisitLogClinic] = useState<Clinic | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const completedStops = routeStops.filter(s => s.status === 'COMPLETED').length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Toggle clinic in/out of today's route
  const handleToggleRoute = (clinic: Clinic) => {
    const isCurrentlyIn = clinic.inTodayRoute;
    if (isCurrentlyIn) {
      // Remove from route
      setRouteStops(prev => {
        const filtered = prev.filter(s => s.clinicId !== clinic.id);
        return filtered.map((s, idx) => ({ ...s, stopNumber: idx + 1 }));
      });
      setClinics(prev =>
        prev.map(c => (c.id === clinic.id ? { ...c, inTodayRoute: false } : c))
      );
      if (selectedClinic?.id === clinic.id) {
        setSelectedClinic({ ...selectedClinic, inTodayRoute: false });
      }
      showToast(`Removed "${clinic.name}" from today's field schedule.`);
    } else {
      // Add to route
      const nextStopNum = routeStops.length + 1;
      const newStop: RouteStop = {
        stopNumber: nextStopNum,
        clinicId: clinic.id,
        scheduledTime: nextStopNum === 1 ? '10:00 AM' : '02:30 PM',
        status: 'PENDING',
        transitMinutesFromPrev: 12,
        transitMode: 'Drive / CTE',
      };
      setRouteStops(prev => [...prev, newStop]);
      setClinics(prev =>
        prev.map(c => (c.id === clinic.id ? { ...c, inTodayRoute: true } : c))
      );
      if (selectedClinic?.id === clinic.id) {
        setSelectedClinic({ ...selectedClinic, inTodayRoute: true });
      }
      showToast(`Added Stop #${nextStopNum}: "${clinic.name}" to route.`);
    }
  };

  // Quick call clinic reception
  const handleCall = (phone: string, clinicName: string) => {
    showToast(`Calling Reception at ${clinicName} (${phone})...`);
  };

  // Disburse samples to clinic
  const handleDisburseSample = (clinicId: string, productId: string, count: number) => {
    // Check if bag has stock
    const bagItem = bagSamples.find(s => s.id.includes(productId.replace('prod-', 'bag-')));
    if (bagItem && bagItem.quantityInBag < count) {
      showToast(`Insufficient quantity in rep bag for ${bagItem.name}.`);
      return;
    }

    // Update clinic stock
    setClinics(prev =>
      prev.map(c => {
        if (c.id === clinicId) {
          const updatedProds = c.products.map(p => {
            if (p.id === productId) {
              return {
                ...p,
                sampleStockInClinic: p.sampleStockInClinic + count,
                reorderStatus: 'Adequate Stock' as const,
              };
            }
            return p;
          });
          const updatedClinic = { ...c, products: updatedProds };
          if (selectedClinic?.id === clinicId) {
            setSelectedClinic(updatedClinic);
          }
          return updatedClinic;
        }
        return c;
      })
    );

    // Update bag stock
    setBagSamples(prev =>
      prev.map(s => {
        if (s.id.includes(productId.replace('prod-', 'bag-'))) {
          return {
            ...s,
            quantityInBag: Math.max(0, s.quantityInBag - count),
            allocatedToday: Math.max(0, s.allocatedToday - count),
          };
        }
        return s;
      })
    );

    showToast(`Disbursed ${count} starter packs to clinic cupboard. HSA record updated.`);
  };

  // Save detailed visit log
  const handleSaveVisit = (
    clinicId: string,
    doctorName: string,
    visitType: any,
    durationMinutes: number,
    summary: string,
    sentiment: any,
    samplesDropped: Array<{ productName: string; quantity: number }>,
    actionItems: string
  ) => {
    const newRecord = {
      id: `vh-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      repName: 'Marcus Lee',
      doctorName,
      type: visitType,
      durationMinutes,
      discussionSummary: summary,
      sentimentRating: sentiment,
      samplesDropped,
      actionItems,
    };

    // Update clinic history
    setClinics(prev =>
      prev.map(c => {
        if (c.id === clinicId) {
          const updatedClinic = {
            ...c,
            visitHistory: [newRecord, ...c.visitHistory],
          };
          if (selectedClinic?.id === clinicId) {
            setSelectedClinic(updatedClinic);
          }
          return updatedClinic;
        }
        return c;
      })
    );

    // Deduct samples from bag
    samplesDropped.forEach(drop => {
      setBagSamples(prev =>
        prev.map(s => {
          if (s.name.toLowerCase().includes(drop.productName.toLowerCase())) {
            return {
              ...s,
              quantityInBag: Math.max(0, s.quantityInBag - drop.quantity),
            };
          }
          return s;
        })
      );
    });

    // Mark route stop as completed if in today's route
    setRouteStops(prev =>
      prev.map(s => {
        if (s.clinicId === clinicId) {
          const now = new Date();
          return {
            ...s,
            status: 'COMPLETED',
            completedAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        }
        return s;
      })
    );

    setVisitLogClinic(null);
    showToast(`Visit recorded with ${doctorName} (${durationMinutes}m). Added to physician profile.`);
  };

  // Optimize route sequence
  const handleOptimizeRoute = () => {
    // Cluster Novena first, then Orchard, then Heritage/Heartlands
    const priorityOrder: Record<string, number> = {
      'Novena Hub': 1,
      'Orchard / Tanglin': 2,
      'Central / Heritage': 3,
      'Heartlands West': 4,
      'Heartlands East': 5,
    };

    const sortedStops = [...routeStops].sort((a, b) => {
      const clinicA = clinics.find(c => c.id === a.clinicId);
      const clinicB = clinics.find(c => c.id === b.clinicId);
      const scoreA = clinicA ? priorityOrder[clinicA.hub] || 99 : 99;
      const scoreB = clinicB ? priorityOrder[clinicB.hub] || 99 : 99;
      return scoreA - scoreB;
    });

    sortedStops.forEach((s, idx) => {
      s.stopNumber = idx + 1;
      s.scheduledTime = idx === 0 ? '09:30 AM' : idx === 1 ? '11:15 AM' : idx === 2 ? '01:45 PM' : '03:30 PM';
    });

    setRouteStops(sortedStops);
    showToast('Route re-ordered: Novena clusters sequenced first to reduce CTE peak transit.');
  };

  // Filter clinics for directory feed
  const filteredClinics = clinics.filter(clinic => {
    // Search query matching clinic name, doctor, specialty, building, postal code
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      const matchesName = clinic.name.toLowerCase().includes(query);
      const matchesBuilding = clinic.building.toLowerCase().includes(query);
      const matchesPostal = clinic.postalCode.includes(query);
      const matchesDoctor = clinic.doctors.some(
        d =>
          d.name.toLowerCase().includes(query) ||
          d.specialty.toLowerCase().includes(query) ||
          d.mcrNumber.toLowerCase().includes(query)
      );
      const matchesProduct = clinic.products.some(p => p.name.toLowerCase().includes(query));
      if (!matchesName && !matchesBuilding && !matchesPostal && !matchesDoctor && !matchesProduct) {
        return false;
      }
    }

    // Hub filter
    if (selectedHub !== 'ALL' && clinic.hub !== selectedHub) {
      return false;
    }

    // Status filter
    if (statusFilter === 'ACTIVE_NOW' && clinic.status !== 'VISITING_WINDOW_ACTIVE') {
      return false;
    }
    if (statusFilter === 'OPEN' && clinic.status === 'CLOSED') {
      return false;
    }
    if (statusFilter === 'CHAS' && !clinic.chasTier.includes('CHAS') && !clinic.chasTier.includes('Pioneer')) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col font-sans pb-24 md:pb-12">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        completedStopsCount={completedStops}
        totalStopsCount={routeStops.length}
        onOpenQuickLog={() => setVisitLogClinic(clinics[0])}
      />

      {/* Main Content Viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1">
        {/* VIEW 1: CLINIC DIRECTORY & FEED */}
        {activeTab === 'feed' && (
          <div className="space-y-6">
            {/* Search and Tactical Filter Bar */}
            <div className="bg-[#ffffff] border border-[#e2e7ff] rounded-xl p-4 sm:p-5 shadow-xs space-y-3.5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Search Input Box */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#6d7a77] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search Singapore clinic, specialist name, MCR#, postal code (e.g. 329565, Royal Square, Dr. Tan)..."
                    className="w-full min-h-[44px] pl-10 pr-9 py-2 bg-[#f8faff] border border-[#bcc9c6] rounded-lg text-xs sm:text-sm text-[#131b2e] placeholder-[#6d7a77] focus:outline-hidden focus:border-[#00685f]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7a77] hover:text-[#131b2e] cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Hub Segmented Controls (Functional buttons per Zero-Pill rule) */}
                <div className="flex items-center gap-1 overflow-x-auto p-1 bg-[#f2f3ff] rounded-lg text-xs shrink-0">
                  <button
                    onClick={() => setSelectedHub('ALL')}
                    className={`min-h-[38px] px-3 py-1 font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      selectedHub === 'ALL'
                        ? 'bg-white text-[#00685f] shadow-xs'
                        : 'text-[#3d4947] hover:text-[#131b2e]'
                    }`}
                  >
                    All Hubs
                  </button>
                  <button
                    onClick={() => setSelectedHub('Novena Hub')}
                    className={`min-h-[38px] px-3 py-1 font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      selectedHub === 'Novena Hub'
                        ? 'bg-white text-[#00685f] shadow-xs'
                        : 'text-[#3d4947] hover:text-[#131b2e]'
                    }`}
                  >
                    Novena Hub
                  </button>
                  <button
                    onClick={() => setSelectedHub('Orchard / Tanglin')}
                    className={`min-h-[38px] px-3 py-1 font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      selectedHub === 'Orchard / Tanglin'
                        ? 'bg-white text-[#00685f] shadow-xs'
                        : 'text-[#3d4947] hover:text-[#131b2e]'
                    }`}
                  >
                    Orchard
                  </button>
                  <button
                    onClick={() => setSelectedHub('Heartlands East')}
                    className={`min-h-[38px] px-3 py-1 font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      selectedHub === 'Heartlands East'
                        ? 'bg-white text-[#00685f] shadow-xs'
                        : 'text-[#3d4947] hover:text-[#131b2e]'
                    }`}
                  >
                    East Coast
                  </button>
                  <button
                    onClick={() => setSelectedHub('Heartlands West')}
                    className={`min-h-[38px] px-3 py-1 font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      selectedHub === 'Heartlands West'
                        ? 'bg-white text-[#00685f] shadow-xs'
                        : 'text-[#3d4947] hover:text-[#131b2e]'
                    }`}
                  >
                    Jurong West
                  </button>
                  <button
                    onClick={() => setSelectedHub('Central / Heritage')}
                    className={`min-h-[38px] px-3 py-1 font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      selectedHub === 'Central / Heritage'
                        ? 'bg-white text-[#00685f] shadow-xs'
                        : 'text-[#3d4947] hover:text-[#131b2e]'
                    }`}
                  >
                    Tiong Bahru
                  </button>
                </div>
              </div>

              {/* Status Secondary Filter Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#e2e7ff] text-xs">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <span className="text-[#6d7a77] font-medium mr-1 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Status:</span>
                  </span>
                  <button
                    onClick={() => setStatusFilter('ALL')}
                    className={`min-h-[34px] px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                      statusFilter === 'ALL'
                        ? 'bg-[#eaedff] text-[#00685f] font-semibold'
                        : 'text-[#3d4947] hover:text-[#131b2e]'
                    }`}
                  >
                    Any Window
                  </button>
                  <button
                    onClick={() => setStatusFilter('ACTIVE_NOW')}
                    className={`min-h-[34px] px-2.5 py-1 rounded-md font-medium flex items-center gap-1 cursor-pointer ${
                      statusFilter === 'ACTIVE_NOW'
                        ? 'bg-[#eaedff] text-[#059669] font-semibold'
                        : 'text-[#3d4947] hover:text-[#131b2e]'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                    <span>Rep Window Active Now</span>
                  </button>
                  <button
                    onClick={() => setStatusFilter('CHAS')}
                    className={`min-h-[34px] px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                      statusFilter === 'CHAS'
                        ? 'bg-[#eaedff] text-[#00685f] font-semibold'
                        : 'text-[#3d4947] hover:text-[#131b2e]'
                    }`}
                  >
                    CHAS / Pioneer Subsidized
                  </button>
                </div>

                {/* Counter */}
                <div className="text-xs text-[#3d4947] font-medium">
                  Showing <span className="font-bold text-[#131b2e]">{filteredClinics.length}</span> practices
                </div>
              </div>
            </div>

            {/* Clinics Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5">
              {filteredClinics.map(clinic => (
                <ClinicCard
                  key={clinic.id}
                  clinic={clinic}
                  onSelect={c => setSelectedClinic(c)}
                  onToggleRoute={handleToggleRoute}
                  onLogVisit={c => setVisitLogClinic(c)}
                  onCall={handleCall}
                />
              ))}
            </div>

            {filteredClinics.length === 0 && (
              <div className="bg-[#ffffff] border border-[#e2e7ff] rounded-xl p-10 text-center">
                <Stethoscope className="w-12 h-12 text-[#6d7a77] mx-auto mb-2 opacity-40" />
                <h3 className="text-base font-bold text-[#131b2e]">No Matching Clinics Found</h3>
                <p className="text-xs text-[#3d4947] max-w-sm mx-auto mt-1">
                  Adjust your search keywords or reset filter tags to browse the full territory database.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedHub('ALL');
                    setStatusFilter('ALL');
                  }}
                  className="mt-4 min-h-[44px] px-4 py-2 bg-[#00685f] text-white rounded-lg text-xs font-semibold hover:bg-[#005049] cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: INTERACTIVE TERRITORY MAP */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <SingaporeMap
              clinics={clinics}
              routeStops={routeStops}
              selectedClinic={selectedClinic}
              onSelectClinic={c => setSelectedClinic(c)}
              onToggleRoute={handleToggleRoute}
              onCall={handleCall}
            />

            {/* Accompanying Quick Route Bar under Map */}
            <div className="bg-[#ffffff] border border-[#e2e7ff] rounded-xl p-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-[#00685f]" />
                  <h3 className="text-sm font-bold text-[#131b2e]">
                    Today's Active Navigational Sequence
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className="text-xs font-semibold text-[#00685f] hover:underline cursor-pointer"
                >
                  Open Full Itinerary Planner →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {routeStops.map(stop => {
                  const cl = clinics.find(c => c.id === stop.clinicId);
                  if (!cl) return null;
                  return (
                    <div
                      key={stop.clinicId}
                      onClick={() => setSelectedClinic(cl)}
                      className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                        selectedClinic?.id === cl.id
                          ? 'border-[#00685f] bg-[#f2f3ff]'
                          : 'border-[#e2e7ff] hover:bg-[#faf8ff]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] text-[#3d4947] mb-1">
                        <span className="font-bold text-[#00685f]">Stop #{stop.stopNumber}</span>
                        <span>{stop.scheduledTime}</span>
                      </div>
                      <div className="font-bold text-[#131b2e] truncate">{cl.name}</div>
                      <div className="text-[11px] text-[#3d4947] truncate">{cl.building}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: TODAY'S FIELD ROUTE SCHEDULE */}
        {activeTab === 'schedule' && (
          <RoutePlanner
            clinics={clinics}
            routeStops={routeStops}
            onUpdateStops={setRouteStops}
            onSelectClinic={c => setSelectedClinic(c)}
            onLogVisit={c => setVisitLogClinic(c)}
            onCall={handleCall}
            onOptimizeRoute={handleOptimizeRoute}
          />
        )}

        {/* VIEW 4: REP SAMPLE BAG & TRUNK INVENTORY */}
        {activeTab === 'samples' && (
          <SampleBagManager
            samples={bagSamples}
            onUpdateSamples={setBagSamples}
            onToast={showToast}
          />
        )}
      </main>

      {/* Floating Bottom Navigation Bar for Mobile (Strict Pattern 1 from Mobile Skill) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#ffffff]/95 backdrop-blur-md border-t border-[#e2e7ff] h-16 grid grid-cols-4 items-center px-2 shadow-lg">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'feed' ? 'text-[#00685f]' : 'text-[#6d7a77]'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Clinics</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'map' ? 'text-[#00685f]' : 'text-[#6d7a77]'
          }`}
        >
          <Navigation className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Map</span>
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors relative ${
            activeTab === 'schedule' ? 'text-[#00685f]' : 'text-[#6d7a77]'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Route</span>
          <span className="absolute top-1 right-5 w-4 h-4 rounded-full bg-[#00685f] text-white font-mono text-[9px] flex items-center justify-center font-bold">
            {routeStops.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('samples')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'samples' ? 'text-[#00685f]' : 'text-[#6d7a77]'
          }`}
        >
          <Package className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Samples</span>
        </button>
      </nav>

      {/* Specialist & Practice Detail Modal */}
      <ClinicDetailModal
        clinic={selectedClinic}
        onClose={() => setSelectedClinic(null)}
        onToggleRoute={handleToggleRoute}
        onLogVisit={c => setVisitLogClinic(c)}
        onCall={handleCall}
        onDisburseSample={handleDisburseSample}
      />

      {/* Live Visit Logger Modal */}
      <VisitLogModal
        clinic={visitLogClinic}
        bagSamples={bagSamples}
        onClose={() => setVisitLogClinic(null)}
        onSaveVisit={handleSaveVisit}
      />

      {/* Operational Toast Feedback */}
      <QuickToast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
