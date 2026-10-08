import React, { useState } from 'react';
import { Clinic, Doctor, DrugProduct } from '../types';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  Stethoscope, 
  Calendar, 
  Package, 
  CheckCircle2, 
  Plus, 
  Check, 
  X, 
  FileText, 
  Coffee,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface ClinicDetailModalProps {
  clinic: Clinic | null;
  onClose: () => void;
  onToggleRoute: (clinic: Clinic) => void;
  onLogVisit: (clinic: Clinic) => void;
  onCall: (phone: string, clinicName: string) => void;
  onDisburseSample: (clinicId: string, productId: string, count: number) => void;
}

export const ClinicDetailModal: React.FC<ClinicDetailModalProps> = ({
  clinic,
  onClose,
  onToggleRoute,
  onLogVisit,
  onCall,
  onDisburseSample,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'doctors' | 'products' | 'history'>('profile');
  const [imageError, setImageError] = useState(false);

  if (!clinic) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div 
        className="bg-[#ffffff] border-t sm:border border-[#e2e7ff] rounded-t-3xl sm:rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] animate-in slide-in-from-bottom duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile Drag Handle Affordance */}
        <div className="w-10 h-1.5 bg-[#bcc9c6] rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

        {/* Modal Header with Image & Overview */}
        <div className="relative">
          {/* Hero Image Container with Zero-Broken-Image fallback */}
          <div className="h-44 sm:h-52 w-full bg-[#eaedff] relative overflow-hidden">
            {!imageError ? (
              <img
                src={clinic.image}
                alt={clinic.name}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#00685f]/20 via-[#f2f3ff] to-[#dae2fd] flex items-center justify-center">
                <Building2 className="w-12 h-12 text-[#00685f]/40" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Hero Overlaid Text */}
            <div className="absolute bottom-3 left-4 right-4 text-white">
              {/* Unboxed Metadata Kicker */}
              <div className="flex items-center gap-2 text-xs text-white/80 font-medium mb-1">
                <span>{clinic.hub}</span>
                <span aria-hidden="true">·</span>
                <span>{clinic.clinicType}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#89f5e7] font-semibold">{clinic.chasTier}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
                {clinic.name}
              </h2>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs (Interactive Segmented Controls) */}
        <div className="flex items-center gap-1 p-2 bg-[#f2f3ff] border-b border-[#e2e7ff] overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`min-h-[40px] px-3.5 py-1.5 font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white text-[#00685f] shadow-xs'
                : 'text-[#3d4947] hover:text-[#131b2e]'
            }`}
          >
            Practice Overview
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`min-h-[40px] px-3.5 py-1.5 font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'doctors'
                ? 'bg-white text-[#00685f] shadow-xs'
                : 'text-[#3d4947] hover:text-[#131b2e]'
            }`}
          >
            Specialists ({clinic.doctors.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`min-h-[40px] px-3.5 py-1.5 font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'products'
                ? 'bg-white text-[#00685f] shadow-xs'
                : 'text-[#3d4947] hover:text-[#131b2e]'
            }`}
          >
            Sample Cupboard & Formulary
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`min-h-[40px] px-3.5 py-1.5 font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'history'
                ? 'bg-white text-[#00685f] shadow-xs'
                : 'text-[#3d4947] hover:text-[#131b2e]'
            }`}
          >
            Past Interactions ({clinic.visitHistory.length})
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* TAB 1: PRACTICE OVERVIEW */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              {/* Location & Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#f8faff] rounded-xl border border-[#e2e7ff] space-y-2">
                  <div className="text-xs font-bold text-[#00685f] uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Location & Building Access</span>
                  </div>
                  <div className="text-sm font-semibold text-[#131b2e]">
                    {clinic.building}, {clinic.floorSuite}
                  </div>
                  <div className="text-xs text-[#3d4947]">
                    {clinic.address}, Singapore {clinic.postalCode}
                  </div>
                  <div className="text-xs font-medium text-[#006398] pt-1">
                    Transit: {clinic.mrtStation}
                  </div>
                </div>

                <div className="p-4 bg-[#f8faff] rounded-xl border border-[#e2e7ff] space-y-2">
                  <div className="text-xs font-bold text-[#00685f] uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Visiting Hours & Operations</span>
                  </div>
                  <div className="text-sm font-semibold text-[#131b2e]">
                    Rep Window: {clinic.visitingWindow}
                  </div>
                  <div className="text-xs text-[#3d4947]">
                    Operating Hours: {clinic.operatingHours}
                  </div>
                  <div className="text-xs text-[#059669] font-medium pt-1">
                    {clinic.visitingWindowNotes}
                  </div>
                </div>
              </div>

              {/* Receptionist Intelligence */}
              <div className="p-4 bg-[#eaedff]/40 rounded-xl border border-[#dae2fd] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-[#131b2e]">
                    Practice Reception Desk
                  </div>
                  <div className="text-xs text-[#3d4947] mt-0.5">
                    Primary Contact: <span className="font-semibold text-[#131b2e]">{clinic.receptionistName}</span> · {clinic.phone}
                  </div>
                </div>
                <button
                  onClick={() => onCall(clinic.phone, clinic.name)}
                  className="min-h-[44px] px-4 py-2 bg-[#006398] text-white hover:bg-[#004b73] rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {clinic.phone}</span>
                </button>
              </div>

              {/* Rep Field Notes */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-[#131b2e] uppercase tracking-wider">
                  Field Notes & Tactical Advice
                </div>
                <div className="p-3.5 bg-[#ffffff] rounded-xl border border-[#bcc9c6] text-xs text-[#3d4947] leading-relaxed">
                  {clinic.notes}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SPECIALISTS LIST */}
          {activeTab === 'doctors' && (
            <div className="space-y-4">
              {clinic.doctors.map((doc, idx) => (
                <div key={idx} className="p-4 sm:p-5 rounded-xl border border-[#e2e7ff] bg-[#faf8ff] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-[#131b2e]">
                          {doc.name}
                        </h4>
                        <span className="text-xs font-mono font-medium text-[#00685f] bg-[#eaedff] px-2 py-0.5 rounded-sm">
                          {doc.mcrNumber}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-[#00685f] mt-0.5">
                        {doc.specialty} {doc.subSpecialty ? `· ${doc.subSpecialty}` : ''}
                      </div>
                      <div className="text-xs text-[#3d4947]">
                        {doc.qualifications} · {doc.roomSuite}
                      </div>
                    </div>

                    <div className="text-right sm:self-start">
                      <span className="text-xs font-semibold text-[#006948] bg-[#f5fff7] border border-[#059669]/30 px-2 py-1 rounded-md block sm:inline-block">
                        Sentiment: {doc.sentiment}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-[#e2e7ff]">
                    <div>
                      <span className="font-bold text-[#131b2e]">Key Scientific Interest:</span>
                      <p className="text-[#3d4947] mt-0.5">{doc.preferredTopic}</p>
                    </div>
                    <div>
                      <span className="font-bold text-[#131b2e]">Best Rep Calling Window:</span>
                      <p className="text-[#3d4947] mt-0.5">{doc.preferredVisitDay}</p>
                    </div>
                  </div>

                  {doc.preferredBeverage && (
                    <div className="flex items-center gap-1.5 text-xs text-[#3d4947] pt-1">
                      <Coffee className="w-3.5 h-3.5 text-[#d97706]" />
                      <span className="font-medium">Preferred Beverage Order:</span>
                      <span className="font-semibold text-[#131b2e]">{doc.preferredBeverage}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: SAMPLE CUPBOARD & PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="text-xs text-[#3d4947]">
                Track inventory levels in this practice's on-site medical dispensary. Log new starter pack drops to ensure patient titration continuity.
              </div>

              {clinic.products.map(prod => (
                <div key={prod.id} className="p-4 rounded-xl border border-[#e2e7ff] bg-[#ffffff] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-[#131b2e]">
                        {prod.name}
                      </h4>
                      <div className="text-xs text-[#3d4947]">
                        {prod.genericName} · {prod.dosage}
                      </div>
                      <div className="text-[11px] font-mono text-[#6d7a77] mt-0.5">
                        HSA Reg: {prod.hsaRegNumber} · {prod.therapeuticArea}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-[#131b2e]">
                        Prescription Run-Rate:
                      </div>
                      <div className="text-xs text-[#00685f] font-semibold">
                        {prod.monthlyPrescriptionVolume}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#f2f3ff] rounded-lg text-xs">
                    <div>
                      <span className="font-medium text-[#3d4947]">Sample Stock on Shelf: </span>
                      <span className="font-mono font-bold text-base text-[#131b2e] ml-1">
                        {prod.sampleStockInClinic} boxes
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onDisburseSample(clinic.id, prod.id, 2)}
                        className="min-h-[40px] px-3 py-1.5 bg-[#00685f] text-white rounded-lg text-xs font-semibold hover:bg-[#005049] transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Drop 2 Starter Packs</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: PAST VISIT HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {clinic.visitHistory.map(vh => (
                <div key={vh.id} className="p-4 rounded-xl border border-[#e2e7ff] bg-[#faf8ff] space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#3d4947]">
                    <div className="flex items-center gap-1.5 font-bold text-[#131b2e]">
                      <Calendar className="w-3.5 h-3.5 text-[#00685f]" />
                      <span>{vh.date}</span>
                      <span className="text-[#bcc9c6]">·</span>
                      <span>{vh.doctorName}</span>
                    </div>
                    <span className="font-semibold text-[#00685f]">{vh.type} ({vh.durationMinutes}m)</span>
                  </div>

                  <p className="text-xs text-[#131b2e] leading-relaxed">
                    {vh.discussionSummary}
                  </p>

                  {vh.samplesDropped && vh.samplesDropped.length > 0 && (
                    <div className="text-xs text-[#059669] font-medium pt-1">
                      Samples Delivered: {vh.samplesDropped.map(s => `${s.quantity}x ${s.productName}`).join(', ')}
                    </div>
                  )}

                  <div className="text-xs text-[#006398] font-semibold pt-1 border-t border-[#e2e7ff]">
                    Next Action: {vh.actionItems}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Sticky Bottom Action Footer (Strict 44px min touch targets) */}
        <div className="p-4 bg-[#f8faff] border-t border-[#e2e7ff] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onToggleRoute(clinic)}
            className={`min-h-[44px] px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
              clinic.inTodayRoute
                ? 'bg-[#eaedff] text-[#00685f] border border-[#00685f]'
                : 'border border-[#bcc9c6] text-[#131b2e] hover:bg-[#f2f3ff]'
            }`}
          >
            {clinic.inTodayRoute ? (
              <>
                <Check className="w-4 h-4 text-[#00685f]" />
                <span>On Today's Route</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add to Today's Route</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onCall(clinic.phone, clinic.name)}
              className="min-h-[44px] px-3.5 py-2 border border-[#bcc9c6] rounded-lg text-xs font-semibold text-[#131b2e] hover:bg-[#f2f3ff] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#006398]" />
              <span>Call Desk</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onLogVisit(clinic);
              }}
              className="min-h-[44px] px-5 py-2 bg-[#00685f] text-white hover:bg-[#005049] rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>Log Visit Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
