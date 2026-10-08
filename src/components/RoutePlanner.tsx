import React from 'react';
import { Clinic, RouteStop } from '../types';
import { 
  Navigation, 
  Clock, 
  CheckCircle2, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Play, 
  MapPin, 
  Sparkles, 
  Car, 
  Footprints, 
  Building,
  Phone
} from 'lucide-react';

interface RoutePlannerProps {
  clinics: Clinic[];
  routeStops: RouteStop[];
  onUpdateStops: (newStops: RouteStop[]) => void;
  onSelectClinic: (clinic: Clinic) => void;
  onLogVisit: (clinic: Clinic) => void;
  onCall: (phone: string, clinicName: string) => void;
  onOptimizeRoute: () => void;
}

export const RoutePlanner: React.FC<RoutePlannerProps> = ({
  clinics,
  routeStops,
  onUpdateStops,
  onSelectClinic,
  onLogVisit,
  onCall,
  onOptimizeRoute,
}) => {
  const getClinic = (id: string) => clinics.find(c => c.id === id);

  const completedCount = routeStops.filter(s => s.status === 'COMPLETED').length;
  const inProgressStop = routeStops.find(s => s.status === 'IN_PROGRESS');
  const totalTransitMinutes = routeStops.reduce((acc, s) => acc + s.transitMinutesFromPrev, 0);

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newStops = [...routeStops];
    const temp = newStops[index];
    newStops[index] = newStops[index - 1];
    newStops[index - 1] = temp;
    // Re-index stop numbers
    newStops.forEach((s, idx) => {
      s.stopNumber = idx + 1;
    });
    onUpdateStops(newStops);
  };

  const handleMoveDown = (index: number) => {
    if (index === routeStops.length - 1) return;
    const newStops = [...routeStops];
    const temp = newStops[index];
    newStops[index] = newStops[index + 1];
    newStops[index + 1] = temp;
    newStops.forEach((s, idx) => {
      s.stopNumber = idx + 1;
    });
    onUpdateStops(newStops);
  };

  const handleRemove = (index: number) => {
    const targetClinicId = routeStops[index].clinicId;
    const targetClinic = getClinic(targetClinicId);
    if (targetClinic) {
      targetClinic.inTodayRoute = false;
    }
    const newStops = routeStops.filter((_, idx) => idx !== index);
    newStops.forEach((s, idx) => {
      s.stopNumber = idx + 1;
    });
    onUpdateStops(newStops);
  };

  const handleStatusChange = (index: number, newStatus: RouteStop['status']) => {
    const newStops = [...routeStops];
    newStops[index].status = newStatus;
    if (newStatus === 'COMPLETED') {
      const now = new Date();
      newStops[index].completedAt = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    onUpdateStops(newStops);
  };

  return (
    <div className="space-y-6">
      {/* Route Dashboard Header */}
      <div className="bg-[#ffffff] border border-[#e2e7ff] rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#00685f] mb-1">
              <Navigation className="w-4 h-4" />
              <span>TODAY'S FIELD SEQUENCE · SINGAPORE METROPOLITAN</span>
            </div>
            <h2 className="text-xl font-bold text-[#131b2e]">
              Field Route Optimization & Execution
            </h2>
            <p className="text-xs text-[#3d4947] mt-0.5">
              Sequence calibrated to minimize CTE and Orchard road transit during Singapore peak hours.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOptimizeRoute}
              className="min-h-[44px] px-4 py-2 bg-[#eaedff] text-[#00685f] hover:bg-[#dae2fd] rounded-lg transition-colors text-xs font-semibold flex items-center gap-2 cursor-pointer active:scale-95"
              title="Automatically arrange stops by geographic proximity"
            >
              <Sparkles className="w-4 h-4 text-[#00685f]" />
              <span>Auto-Optimize Routing</span>
            </button>
          </div>
        </div>

        {/* Tactical Key Numbers (Tabular Discipline) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-[#e2e7ff]">
          <div className="bg-[#f2f3ff] p-3 rounded-lg">
            <div className="text-[11px] text-[#3d4947] font-medium">Progress Today</div>
            <div className="text-2xl font-bold text-[#131b2e] font-mono tabular-nums mt-0.5">
              {completedCount} / {routeStops.length}
            </div>
            <div className="text-[11px] text-[#006948] font-semibold mt-0.5">
              {Math.round((completedCount / (routeStops.length || 1)) * 100)}% Complete
            </div>
          </div>

          <div className="bg-[#f2f3ff] p-3 rounded-lg">
            <div className="text-[11px] text-[#3d4947] font-medium">Est. Transit Time</div>
            <div className="text-2xl font-bold text-[#006398] font-mono tabular-nums mt-0.5">
              {totalTransitMinutes} min
            </div>
            <div className="text-[11px] text-[#3d4947] mt-0.5">
              Across all route legs
            </div>
          </div>

          <div className="bg-[#f2f3ff] p-3 rounded-lg">
            <div className="text-[11px] text-[#3d4947] font-medium">Current Status</div>
            <div className="text-base font-bold text-[#00685f] mt-1 truncate">
              {inProgressStop ? `At Stop #${inProgressStop.stopNumber}` : 'In Transit'}
            </div>
            <div className="text-[11px] text-[#3d4947] mt-0.5 truncate">
              {inProgressStop ? getClinic(inProgressStop.clinicId)?.name : 'Ready for next call'}
            </div>
          </div>

          <div className="bg-[#f2f3ff] p-3 rounded-lg">
            <div className="text-[11px] text-[#3d4947] font-medium">Sample Drop Target</div>
            <div className="text-2xl font-bold text-[#131b2e] font-mono tabular-nums mt-0.5">
              15 Units
            </div>
            <div className="text-[11px] text-[#059669] font-semibold mt-0.5">
              11 Units Available in Bag
            </div>
          </div>
        </div>
      </div>

      {/* Stop by Stop Timeline */}
      <div className="space-y-3">
        {routeStops.length === 0 ? (
          <div className="bg-[#ffffff] border border-[#e2e7ff] rounded-xl p-8 text-center">
            <MapPin className="w-10 h-10 text-[#6d7a77] mx-auto mb-2 opacity-50" />
            <h3 className="text-base font-bold text-[#131b2e]">No Clinics in Today's Route</h3>
            <p className="text-xs text-[#3d4947] max-w-md mx-auto mt-1 mb-4">
              Browse the clinic directory and tap "Add to Route" on target practices to construct your daily field schedule.
            </p>
          </div>
        ) : (
          routeStops.map((stop, index) => {
            const clinic = getClinic(stop.clinicId);
            if (!clinic) return null;
            const leadDoc = clinic.doctors[0];

            return (
              <div
                key={stop.clinicId}
                className={`bg-[#ffffff] border rounded-xl p-4 sm:p-5 transition-all shadow-xs ${
                  stop.status === 'IN_PROGRESS'
                    ? 'border-[#00685f] ring-2 ring-[#00685f]/20 bg-[#f4fffc]/40'
                    : stop.status === 'COMPLETED'
                    ? 'border-[#bcc9c6] bg-[#faf8ff]/50 opacity-90'
                    : 'border-[#e2e7ff] hover:border-[#00685f]/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left: Number + Clinic Data */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    {/* Stop Number Circle */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 font-mono ${
                        stop.status === 'COMPLETED'
                          ? 'bg-[#059669] text-white'
                          : stop.status === 'IN_PROGRESS'
                          ? 'bg-[#00685f] text-white animate-pulse'
                          : 'bg-[#dae2fd] text-[#131b2e]'
                      }`}
                    >
                      {stop.status === 'COMPLETED' ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        stop.stopNumber
                      )}
                    </div>

                    <div className="min-w-0 space-y-1">
                      {/* Unboxed Metadata */}
                      <div className="flex items-center gap-1.5 text-xs text-[#3d4947] font-medium">
                        <span className="font-semibold text-[#00685f]">{stop.scheduledTime}</span>
                        <span className="text-[#bcc9c6]">·</span>
                        <span>{clinic.hub}</span>
                        <span className="text-[#bcc9c6]">·</span>
                        <span>{clinic.floorSuite}</span>
                        {stop.transitMinutesFromPrev > 0 && (
                          <>
                            <span className="text-[#bcc9c6]">·</span>
                            <span className="flex items-center gap-1 text-[#006398]">
                              {stop.transitMode === 'Walk' ? (
                                <Footprints className="w-3.5 h-3.5" />
                              ) : (
                                <Car className="w-3.5 h-3.5" />
                              )}
                              <span>+{stop.transitMinutesFromPrev}m transit</span>
                            </span>
                          </>
                        )}
                      </div>

                      {/* Clinic Name */}
                      <h4
                        onClick={() => onSelectClinic(clinic)}
                        className="text-base font-bold text-[#131b2e] hover:text-[#00685f] cursor-pointer transition-colors leading-tight"
                      >
                        {clinic.name}
                      </h4>

                      {/* Doctor and visiting window */}
                      <div className="text-xs text-[#3d4947] flex flex-wrap items-center gap-2 pt-0.5">
                        <span className="font-semibold text-[#131b2e]">
                          {leadDoc ? `${leadDoc.name} (${leadDoc.specialty})` : 'Specialist Consult'}
                        </span>
                        <span className="text-[#bcc9c6]">·</span>
                        <span className="text-[#00685f] font-medium">Window: {clinic.visitingWindow}</span>
                        {stop.completedAt && (
                          <>
                            <span className="text-[#bcc9c6]">·</span>
                            <span className="text-[#059669] font-mono font-semibold">
                              Checked out @ {stop.completedAt}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions & Status Toggles (Full width on mobile with edge-to-edge alignment) */}
                  <div className="w-full sm:w-auto flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-2 pt-2.5 sm:pt-0 border-t sm:border-0 border-[#e2e7ff]/80 shrink-0">
                    {/* Status Toggle Buttons */}
                    {stop.status === 'PENDING' && (
                      <button
                        onClick={() => handleStatusChange(index, 'IN_PROGRESS')}
                        className="flex-1 sm:flex-none min-h-[44px] px-3.5 py-2 bg-[#00685f] text-white hover:bg-[#005049] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Check In</span>
                      </button>
                    )}

                    {stop.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => onLogVisit(clinic)}
                        className="flex-1 sm:flex-none min-h-[44px] px-3.5 py-2 bg-[#059669] text-white hover:bg-[#047857] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Complete</span>
                      </button>
                    )}

                    {stop.status === 'COMPLETED' && (
                      <button
                        onClick={() => handleStatusChange(index, 'PENDING')}
                        className="flex-1 sm:flex-none min-h-[44px] px-3 py-2 border border-[#bcc9c6] text-[#3d4947] hover:bg-[#f2f3ff] rounded-lg text-xs font-medium cursor-pointer"
                      >
                        Re-open
                      </button>
                    )}

                    <div className="flex items-center gap-1.5">
                      {/* Quick Call */}
                      <button
                        onClick={() => onCall(clinic.phone, clinic.name)}
                        className="min-h-[44px] min-w-[44px] px-2.5 py-2 border border-[#bcc9c6] text-[#131b2e] hover:bg-[#f2f3ff] rounded-lg text-xs font-medium flex items-center justify-center cursor-pointer"
                        title={`Call ${clinic.receptionistName}`}
                      >
                        <Phone className="w-3.5 h-3.5 text-[#006398]" />
                      </button>

                      {/* Reordering Controls */}
                      <div className="flex items-center border border-[#bcc9c6] rounded-lg overflow-hidden bg-[#ffffff]">
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="min-h-[44px] min-w-[38px] px-2 hover:bg-[#f2f3ff] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5 text-[#131b2e]" />
                        </button>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === routeStops.length - 1}
                          className="min-h-[44px] min-w-[38px] px-2 hover:bg-[#f2f3ff] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center border-l border-[#bcc9c6] transition-colors cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5 text-[#131b2e]" />
                        </button>
                      </div>

                      {/* Remove from Route */}
                      <button
                        onClick={() => handleRemove(index)}
                        className="min-h-[44px] min-w-[38px] px-2 text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                        title="Remove from Route"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
