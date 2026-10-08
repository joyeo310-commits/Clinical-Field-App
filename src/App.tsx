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
import { AddClinicModal } from './components/AddClinicModal';
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
  PhoneCall,
  Plus,
  Compass,
  Building,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [clinics, setClinics] = useState<Clinic[]>(() => {
    try {
      const saved = localStorage.getItem('sg_clinics_territory_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const customClinics = parsed.filter((c: any) => c.id && c.id.startsWith('clinic-custom-'));
          return [...INITIAL_CLINICS, ...customClinics];
        }
      }
    } catch (e) {
      // ignore
    }
    return INITIAL_CLINICS;
  });
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
  const [isAddClinicOpen, setIsAddClinicOpen] = useState(false);
  const [addClinicInitialName, setAddClinicInitialName] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const completedStops = routeStops.filter(s => s.status === 'COMPLETED').length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Add new clinic to state and persist
  const handleAddClinic = (newClinic: Clinic) => {
    setClinics(prev => {
      const updated = [newClinic, ...prev];
      try {
        localStorage.setItem('sg_clinics_territory_v2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setSelectedClinic(newClinic);
    showToast(`Added "${newClinic.name}" (${newClinic.region}) to your Singapore directory.`);
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

  // Helper to test if a clinic matches a search query across any field
  const checkClinicMatchesQuery = (clinic: Clinic, query: string) => {
    if (!query) return true;
    const q = query.toLowerCase().trim();
    const matchesName = clinic.name.toLowerCase().includes(q);
    const matchesBuilding = clinic.building.toLowerCase().includes(q);
    const matchesAddress = clinic.address.toLowerCase().includes(q);
    const matchesPostal = clinic.postalCode.includes(q);
    const matchesTown = clinic.town.toLowerCase().includes(q);
    const matchesRegion = 
      clinic.region.toLowerCase().includes(q) ||
      (q.includes('north-east') && clinic.region === 'North-East') ||
      (q.includes('northeast') && clinic.region === 'North-East') ||
      (q === 'north' && clinic.region === 'North') ||
      (q.includes('east') && (clinic.region === 'East' || clinic.region === 'North-East')) ||
      (q.includes('west') && clinic.region === 'West') ||
      (q.includes('central') && clinic.region === 'Central');
    const matchesMrt = clinic.mrtStation.toLowerCase().includes(q);
    const matchesType = clinic.clinicType.toLowerCase().includes(q);
    const matchesDoctor = clinic.doctors.some(
      d =>
        d.name.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.mcrNumber.toLowerCase().includes(q)
    );
    const matchesProduct = clinic.products.some(p => 
      p.name.toLowerCase().includes(q) || 
      p.genericName.toLowerCase().includes(q) ||
      p.therapeuticArea.toLowerCase().includes(q)
    );

    return (
      matchesName || 
      matchesBuilding || 
      matchesAddress || 
      matchesPostal || 
      matchesTown || 
      matchesRegion || 
      matchesMrt || 
      matchesType ||
      matchesDoctor || 
      matchesProduct
    );
  };

  const queryTrimmed = searchQuery.trim();
  const islandWideMatchingClinics = queryTrimmed 
    ? clinics.filter(c => checkClinicMatchesQuery(c, queryTrimmed))
    : clinics;

  // Filter clinics for directory feed:
  // If user is searching and selectedHub is set, check if results exist in selectedHub.
  const filteredClinics = clinics.filter(clinic => {
    // 1. Search Query check
    if (queryTrimmed) {
      if (!checkClinicMatchesQuery(clinic, queryTrimmed)) {
        return false;
      }
    }

    // 2. Regional Filter Tabs
    if (selectedHub !== 'ALL') {
      const matchesRegion = 
        clinic.region === selectedHub || 
        clinic.hub.includes(selectedHub) || 
        clinic.town.toLowerCase() === selectedHub.toLowerCase();
      if (!matchesRegion) {
        return false;
      }
    }

    // 3. Status filter
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
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col font-sans pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-12">
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
            <div className="bg-[#ffffff] border border-[#e2e7ff] rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                {/* Search Input Box */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#6d7a77] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search any Singapore clinic, hospital, building, town, postal code, doctor..."
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

                {/* Add Clinic Action Button */}
                <button
                  onClick={() => {
                    setAddClinicInitialName(searchQuery.trim());
                    setIsAddClinicOpen(true);
                  }}
                  className="min-h-[44px] px-4 py-2 bg-[#00685f] hover:bg-[#005048] text-white rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap cursor-pointer shrink-0 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Clinic</span>
                </button>
              </div>

              {/* Singapore 5 Planning Regions Segmented Controls */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1 overflow-x-auto p-1 bg-[#f2f3ff] rounded-lg text-xs max-w-full shrink-0">
                  <button
                    onClick={() => setSelectedHub('ALL')}
                    className={`min-h-[36px] px-3 py-1 font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      selectedHub === 'ALL'
                        ? 'bg-white text-[#00685f] shadow-xs'
                        : 'text-[#3d4947] hover:text-[#131b2e]'
                    }`}
                  >
                    All Island
                  </button>
                  <button
                    onClick={() => setSelectedHub('Central')}
                    className={`min-h-[36px] px-3 py-1 font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      selectedHub === 'Central'
                        ? 'bg-white text-[#00685f] shadow-xs'
                        : 'text-[#3d4947] hover:text-[#131b2e]'
                    }`}
                  >
                    Central
                  </button>
                  <button
                    onClick={() => setSelectedHub('North')}
                    className={`min-h-[36px] px-3 py-1 font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      selectedHub === 'North'
                        ? 'bg-white text-[#00685f] shadow-xs'
                        : 'text-[#3d4947] hover:text-[#131b2e]'
                    }`}
                  >
                    North
                  </button>
                  <button
                    onClick={() => setSelectedHub('North-East')}
                    className={`min-h-[36px] px-3 py-1 font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      selectedHub === 'North-East'
                        ? 'bg-white text-[#00685f] shadow-xs'
                        : 'text-[#3d4947] hover:text-[#131b2e]'
                    }`}
                  >
                    North-East
                  </button>
                  <button
                    onClick={() => setSelectedHub('East')}
                    className={`min-h-[36px] px-3 py-1 font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      selectedHub === 'East'
                        ? 'bg-white text-[#00685f] shadow-xs'
                        : 'text-[#3d4947] hover:text-[#131b2e]'
                    }`}
                  >
                    East
                  </button>
                  <button
                    onClick={() => setSelectedHub('West')}
                    className={`min-h-[36px] px-3 py-1 font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      selectedHub === 'West'
                        ? 'bg-white text-[#00685f] shadow-xs'
                        : 'text-[#3d4947] hover:text-[#131b2e]'
                    }`}
                  >
                    West
                  </button>
                </div>

                <div className="text-xs text-[#3d4947] font-medium hidden sm:block">
                  Total <span className="font-bold text-[#131b2e]">{clinics.length}</span> clinics on file
                </div>
              </div>

              {/* Alert / Notice if region filter is active and other regions have matches */}
              {queryTrimmed && selectedHub !== 'ALL' && filteredClinics.length === 0 && islandWideMatchingClinics.length > 0 && (
                <div className="p-3 bg-[#e0f2fe] border border-[#7dd3fc] rounded-lg text-xs text-[#0369a1] flex flex-wrap items-center justify-between gap-2">
                  <span>
                    No matches in <strong>{selectedHub}</strong>, but <strong>{islandWideMatchingClinics.length}</strong> matching clinics found in other Singapore regions!
                  </span>
                  <button
                    onClick={() => setSelectedHub('ALL')}
                    className="px-3 py-1 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-md font-semibold whitespace-nowrap cursor-pointer"
                  >
                    View All Island ({islandWideMatchingClinics.length})
                  </button>
                </div>
              )}

              {queryTrimmed && selectedHub !== 'ALL' && filteredClinics.length > 0 && islandWideMatchingClinics.length > filteredClinics.length && (
                <div className="flex items-center justify-between text-xs text-[#3d4947] bg-[#f2f3ff] px-3 py-1.5 rounded-md">
                  <span>
                    Showing {filteredClinics.length} in <strong>{selectedHub}</strong> ({islandWideMatchingClinics.length - filteredClinics.length} more in other regions)
                  </span>
                  <button
                    onClick={() => setSelectedHub('ALL')}
                    className="text-[#00685f] hover:underline font-semibold cursor-pointer"
                  >
                    Show All Island ({islandWideMatchingClinics.length})
                  </button>
                </div>
              )}

              {/* Quick Browse Tags for Instant Discovery */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pt-1 border-t border-[#e2e7ff]/70">
                <span className="text-[#6d7a77] font-semibold whitespace-nowrap">Quick Browse:</span>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedHub('ALL'); setStatusFilter('ALL'); }}
                  className="px-2.5 py-1 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] rounded-md font-medium whitespace-nowrap cursor-pointer"
                >
                  All ({clinics.length})
                </button>
                <button 
                  onClick={() => { setSearchQuery('Dermatology'); setSelectedHub('ALL'); }}
                  className="px-2.5 py-1 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] rounded-md font-medium whitespace-nowrap cursor-pointer"
                >
                  Dermatology & Skin
                </button>
                <button 
                  onClick={() => { setSearchQuery('Raffles'); setSelectedHub('ALL'); }}
                  className="px-2.5 py-1 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] rounded-md font-medium whitespace-nowrap cursor-pointer"
                >
                  Raffles Medical
                </button>
                <button 
                  onClick={() => { setSearchQuery('Polyclinic'); setSelectedHub('ALL'); }}
                  className="px-2.5 py-1 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] rounded-md font-medium whitespace-nowrap cursor-pointer"
                >
                  Polyclinics
                </button>
                <button 
                  onClick={() => { setSearchQuery('Specialist'); setSelectedHub('ALL'); }}
                  className="px-2.5 py-1 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] rounded-md font-medium whitespace-nowrap cursor-pointer"
                >
                  Specialist Suites
                </button>
                <button 
                  onClick={() => { setSearchQuery('Minmed'); setSelectedHub('ALL'); }}
                  className="px-2.5 py-1 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] rounded-md font-medium whitespace-nowrap cursor-pointer"
                >
                  Minmed
                </button>
                <button 
                  onClick={() => { setSearchQuery('Healthway'); setSelectedHub('ALL'); }}
                  className="px-2.5 py-1 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] rounded-md font-medium whitespace-nowrap cursor-pointer"
                >
                  Healthway
                </button>
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

            {/* Empty State with 1-click Add Clinic */}
            {filteredClinics.length === 0 && (
              <div className="bg-[#ffffff] border border-[#e2e7ff] rounded-2xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#f2f3ff] text-[#00685f] flex items-center justify-center mx-auto">
                  <Building className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#131b2e]">
                    {queryTrimmed ? `No Pre-Configured Clinic Found for "${searchQuery}"` : 'No Clinics Matching Filters'}
                  </h3>
                  <p className="text-xs text-[#3d4947] max-w-md mx-auto mt-1.5 leading-relaxed">
                    {queryTrimmed
                      ? `If "${searchQuery}" is a clinic location in your territory, you can add it right now. Enter its postal code to auto-detect its town and planning region.`
                      : 'Try resetting your region or status filters to browse all Singapore clinic locations.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  {queryTrimmed && (
                    <button
                      onClick={() => {
                        setAddClinicInitialName(searchQuery.trim());
                        setIsAddClinicOpen(true);
                      }}
                      className="min-h-[44px] px-5 py-2.5 bg-[#00685f] hover:bg-[#005048] text-white rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add "{searchQuery}" as New Clinic</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedHub('ALL');
                      setStatusFilter('ALL');
                    }}
                    className="min-h-[44px] px-4 py-2 border border-[#bcc9c6] text-[#3d4947] hover:bg-[#f2f3ff] rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    View All Singapore Clinics ({clinics.length})
                  </button>
                </div>
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
            bagSamples={bagSamples}
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#ffffff]/95 backdrop-blur-md border-t border-[#e2e7ff] h-[calc(4rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] grid grid-cols-4 items-center px-1 shadow-lg">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-all cursor-pointer active:scale-95 ${
            activeTab === 'feed' ? 'text-[#00685f]' : 'text-[#6d7a77] hover:text-[#131b2e]'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Clinics</span>
          {activeTab === 'feed' && <span className="w-1 h-1 rounded-full bg-[#00685f] mt-0.5" />}
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-all cursor-pointer active:scale-95 ${
            activeTab === 'map' ? 'text-[#00685f]' : 'text-[#6d7a77] hover:text-[#131b2e]'
          }`}
        >
          <Navigation className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Map</span>
          {activeTab === 'map' && <span className="w-1 h-1 rounded-full bg-[#00685f] mt-0.5" />}
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-all cursor-pointer relative active:scale-95 ${
            activeTab === 'schedule' ? 'text-[#00685f]' : 'text-[#6d7a77] hover:text-[#131b2e]'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Route</span>
          <span className="absolute top-1 right-5 sm:right-6 w-4 h-4 rounded-full bg-[#00685f] text-white font-mono text-[9px] flex items-center justify-center font-bold">
            {routeStops.length}
          </span>
          {activeTab === 'schedule' && <span className="w-1 h-1 rounded-full bg-[#00685f] mt-0.5" />}
        </button>

        <button
          onClick={() => setActiveTab('samples')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-all cursor-pointer active:scale-95 ${
            activeTab === 'samples' ? 'text-[#00685f]' : 'text-[#6d7a77] hover:text-[#131b2e]'
          }`}
        >
          <Package className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Samples</span>
          {activeTab === 'samples' && <span className="w-1 h-1 rounded-full bg-[#00685f] mt-0.5" />}
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

      {/* Add New Clinic to Territory Modal */}
      <AddClinicModal
        isOpen={isAddClinicOpen}
        onClose={() => setIsAddClinicOpen(false)}
        onAddClinic={handleAddClinic}
        initialName={addClinicInitialName}
      />

      {/* Operational Toast Feedback */}
      <QuickToast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
