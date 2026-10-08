import React from 'react';
import { Clinic } from '../types';
import { Phone, Clock, Stethoscope, Plus, Check, FileText, ChevronRight, Navigation } from 'lucide-react';

interface ClinicCardProps {
  clinic: Clinic;
  onSelect: (clinic: Clinic) => void;
  onToggleRoute: (clinic: Clinic) => void;
  onLogVisit: (clinic: Clinic) => void;
  onCall: (phone: string, clinicName: string) => void;
}

export const ClinicCard: React.FC<ClinicCardProps> = ({
  clinic,
  onSelect,
  onToggleRoute,
  onLogVisit,
  onCall,
}) => {
  const leadDoc = clinic.doctors[0];
  const lowStockProduct = clinic.products.find(p => p.reorderStatus === 'Urgent Replenish');

  // Status visual cues without pill enclosures
  const getStatusText = (status: Clinic['status']) => {
    switch (status) {
      case 'VISITING_WINDOW_ACTIVE':
        return { label: 'Rep Window Open', color: 'text-[#059669]', dotColor: 'bg-[#059669]' };
      case 'OPEN_NOW':
        return { label: 'Clinic Open', color: 'text-[#00685f]', dotColor: 'bg-[#00685f]' };
      case 'CLOSING_SOON':
        return { label: 'Closing Soon', color: 'text-[#d97706]', dotColor: 'bg-[#d97706]' };
      case 'BY_APPOINTMENT_ONLY':
        return { label: 'By Appointment Only', color: 'text-[#006398]', dotColor: 'bg-[#006398]' };
      case 'CLOSED':
      default:
        return { label: 'Closed', color: 'text-[#ba1a1a]', dotColor: 'bg-[#ba1a1a]' };
    }
  };

  const statusInfo = getStatusText(clinic.status);

  return (
    <article className="bg-[#ffffff] border border-[#e2e7ff] rounded-xl hover:border-[#00685f]/40 transition-all shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden">
      <div>
        {/* Card Header & Unboxed Kicker */}
        <div className="p-4 sm:p-5 pb-3">
          {/* Unboxed Metadata Kicker (Anti-Pill Rule) */}
          <div className="flex items-center justify-between text-xs text-[#3d4947] mb-2">
            <div className="flex items-center gap-1.5 font-medium">
              <span>{clinic.hub}</span>
              <span aria-hidden="true" className="text-[#bcc9c6]">·</span>
              <span>{clinic.clinicType}</span>
              <span aria-hidden="true" className="text-[#bcc9c6]">·</span>
              <span>{clinic.chasTier}</span>
            </div>

            {/* Status with dot indicator (unboxed) */}
            <div className={`flex items-center gap-1.5 font-semibold text-xs ${statusInfo.color}`}>
              <span className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`} />
              <span>{statusInfo.label}</span>
            </div>
          </div>

          {/* Primary Clinic Name */}
          <h3 
            onClick={() => onSelect(clinic)}
            className="text-lg font-bold text-[#131b2e] hover:text-[#00685f] cursor-pointer transition-colors leading-snug line-clamp-2"
          >
            {clinic.name}
          </h3>

          {/* Location & MRT Access line */}
          <p className="text-xs text-[#3d4947] mt-1 flex items-center gap-1.5">
            <span className="font-semibold text-[#131b2e]">{clinic.building}</span>
            <span className="text-[#bcc9c6]">·</span>
            <span>{clinic.floorSuite}</span>
            <span className="text-[#bcc9c6]">·</span>
            <span>{clinic.address}</span>
            <span className="text-[#bcc9c6]">·</span>
            <span className="font-mono text-[#006398]">S({clinic.postalCode})</span>
          </p>

          <p className="text-xs text-[#6d7a77] mt-0.5">
            {clinic.mrtStation}
          </p>
        </div>

        {/* Doctor and visiting window highlight */}
        <div className="px-4 sm:px-5 py-3 bg-[#f2f3ff]/60 border-y border-[#e2e7ff] space-y-2.5">
          {leadDoc && (
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2 min-w-0">
                <Stethoscope className="w-4 h-4 text-[#00685f] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#131b2e] truncate">
                    {leadDoc.name}
                    <span className="ml-1.5 font-normal text-[#3d4947] font-mono">({leadDoc.mcrNumber})</span>
                  </div>
                  <div className="text-xs text-[#3d4947] truncate">
                    {leadDoc.specialty}
                  </div>
                </div>
              </div>

              {/* Sentiment Note */}
              <div className="text-right shrink-0">
                <span className="text-[11px] font-medium text-[#006948] block">
                  {leadDoc.sentiment}
                </span>
                <span className="text-[10px] text-[#6d7a77] block font-mono">
                  Visited: {leadDoc.lastVisited}
                </span>
              </div>
            </div>
          )}

          {/* Visiting window notice */}
          <div className="flex items-center gap-2 text-xs text-[#131b2e] pt-1 border-t border-[#e2e7ff]/80">
            <Clock className="w-3.5 h-3.5 text-[#00685f] shrink-0" />
            <span className="font-semibold text-[#00685f]">Window:</span>
            <span className="font-medium">{clinic.visitingWindow}</span>
            <span className="text-[#6d7a77] hidden sm:inline">·</span>
            <span className="text-[#3d4947] text-[11px] truncate hidden sm:inline">{clinic.visitingWindowNotes}</span>
          </div>

          {/* Sample Stock Alert if low */}
          {lowStockProduct && (
            <div className="flex items-center justify-between text-xs bg-[#ffdad6]/40 p-2 rounded-md border border-[#ffdad6]">
              <span className="font-medium text-[#ba1a1a]">
                Sample Low: {lowStockProduct.name} ({lowStockProduct.sampleStockInClinic} left in clinic)
              </span>
              <span className="text-[11px] font-semibold text-[#ba1a1a] uppercase tracking-wider">
                Restock Target
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tactile Actions Grid (Strict 44px minimum hit targets) */}
      <div className="p-3 sm:p-4 bg-[#ffffff] flex items-center justify-between gap-2 border-t border-[#e2e7ff]">
        {/* Quick Call */}
        <button
          onClick={() => onCall(clinic.phone, clinic.name)}
          className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-lg border border-[#bcc9c6] text-[#131b2e] hover:bg-[#f2f3ff] transition-colors flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer active:scale-95"
          title={`Call reception: ${clinic.phone} (${clinic.receptionistName})`}
        >
          <Phone className="w-3.5 h-3.5 text-[#006398]" />
          <span className="hidden sm:inline">Call Desk</span>
        </button>

        {/* Route Toggle */}
        <button
          onClick={() => onToggleRoute(clinic)}
          className={`min-h-[44px] px-2.5 sm:px-3.5 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer active:scale-95 whitespace-nowrap ${
            clinic.inTodayRoute
              ? 'bg-[#eaedff] text-[#00685f] border border-[#00685f]/30'
              : 'border border-[#bcc9c6] text-[#3d4947] hover:text-[#131b2e] hover:bg-[#f2f3ff]'
          }`}
          title={clinic.inTodayRoute ? "Remove from today's route" : "Add to today's route"}
        >
          {clinic.inTodayRoute ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#00685f] shrink-0" />
              <span className="hidden xs:inline">In Route</span>
              <span className="xs:hidden">Route</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 text-[#00685f] shrink-0" />
              <span className="hidden xs:inline">Add to Route</span>
              <span className="xs:hidden">Add</span>
            </>
          )}
        </button>

        {/* Primary View Details / Log */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onLogVisit(clinic)}
            className="min-h-[44px] px-2.5 sm:px-3 py-2 bg-[#f2f3ff] hover:bg-[#dae2fd] text-[#00685f] rounded-lg transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer active:scale-95 whitespace-nowrap"
            title="Log rep interaction with this clinic"
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xs:inline">Log Visit</span>
          </button>

          <button
            onClick={() => onSelect(clinic)}
            className="min-h-[44px] px-3 sm:px-3.5 py-2 bg-[#00685f] text-white hover:bg-[#005049] rounded-lg transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-xs active:scale-95 whitespace-nowrap"
            title="View complete specialist intelligence and history"
          >
            <span>Detail</span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </article>
  );
};
