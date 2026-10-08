import React, { useState, useEffect } from 'react';
import { Clinic, Doctor, BagSampleItem } from '../types';
import { 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Stethoscope, 
  Package, 
  CheckCircle2, 
  FileCheck, 
  X,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

interface VisitLogModalProps {
  clinic: Clinic | null;
  bagSamples: BagSampleItem[];
  onClose: () => void;
  onSaveVisit: (
    clinicId: string,
    doctorName: string,
    visitType: 'Clinical Detailing' | 'Sample Drop' | 'CME Invitation' | 'Safety Update',
    durationMinutes: number,
    summary: string,
    sentiment: 'Warm' | 'Neutral' | 'Challenging',
    samplesDropped: Array<{ productName: string; quantity: number }>,
    actionItems: string
  ) => void;
}

export const VisitLogModal: React.FC<VisitLogModalProps> = ({
  clinic,
  bagSamples,
  onClose,
  onSaveVisit,
}) => {
  if (!clinic) return null;

  const defaultDoctor = clinic.doctors[0]?.name || 'Attending Specialist';

  // Live Timer State
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Form States
  const [selectedDoctor, setSelectedDoctor] = useState(defaultDoctor);
  const [visitType, setVisitType] = useState<'Clinical Detailing' | 'Sample Drop' | 'CME Invitation' | 'Safety Update'>('Clinical Detailing');
  const [sentiment, setSentiment] = useState<'Warm' | 'Neutral' | 'Challenging'>('Warm');
  const [discussionSummary, setDiscussionSummary] = useState('');
  const [actionItems, setActionItems] = useState('Send follow-up clinical study reprint & verify sample stock next rotation.');
  
  // Sample Drop Counts state
  const [sampleDrops, setSampleDrops] = useState<{ [id: string]: number }>({});
  const [signedByDoctor, setSignedByDoctor] = useState(true);

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSampleDropChange = (sampleId: string, qty: number) => {
    setSampleDrops(prev => ({
      ...prev,
      [sampleId]: Math.max(0, qty),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const durationMins = Math.max(1, Math.round(secondsElapsed / 60));
    
    // Construct samples dropped array
    const droppedArray: Array<{ productName: string; quantity: number }> = [];
    Object.entries(sampleDrops).forEach(([sId, qty]) => {
      if (qty > 0) {
        const item = bagSamples.find(s => s.id === sId);
        if (item) {
          droppedArray.push({
            productName: item.name,
            quantity: qty,
          });
        }
      }
    });

    onSaveVisit(
      clinic.id,
      selectedDoctor,
      visitType,
      durationMins,
      discussionSummary.trim() || `Consultation regarding ${clinic.products[0]?.name || 'formulary line'} with ${selectedDoctor}.`,
      sentiment,
      droppedArray,
      actionItems
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div 
        className="bg-[#ffffff] border-t sm:border border-[#e2e7ff] rounded-t-3xl sm:rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] animate-in slide-in-from-bottom duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile Drag Handle Affordance */}
        <div className="w-10 h-1.5 bg-[#bcc9c6] rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

        {/* Header with Live Visit Timer */}
        <div className="p-4 sm:p-5 bg-[#00685f] text-white flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-white/80 font-semibold">
              Live Medical Detailing Check-In
            </div>
            <h3 className="text-base sm:text-lg font-bold leading-tight mt-0.5">
              {clinic.name}
            </h3>
            <p className="text-xs text-white/80">
              {clinic.building} {clinic.floorSuite}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tactical Timer Bar */}
        <div className="bg-[#eaedff] px-4 py-3 border-b border-[#dae2fd] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#00685f]" />
            <span className="text-xs font-semibold text-[#131b2e]">Session Duration:</span>
            <span className="text-xl font-bold font-mono tabular-nums text-[#00685f]">
              {formatTimer(secondsElapsed)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="px-3 py-1 bg-white text-[#131b2e] rounded-md text-xs font-semibold border border-[#bcc9c6] hover:bg-[#f2f3ff] transition-colors flex items-center gap-1 cursor-pointer"
            >
              {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isTimerRunning ? 'Pause' : 'Resume'}</span>
            </button>
            <button
              onClick={() => setSecondsElapsed(0)}
              className="p-1 text-[#6d7a77] hover:text-[#131b2e] rounded-md transition-colors cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* Doctor Selection & Visit Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#131b2e] mb-1">
                Consulting Specialist
              </label>
              <select
                value={selectedDoctor}
                onChange={e => setSelectedDoctor(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 bg-[#f8faff] border border-[#bcc9c6] rounded-lg text-xs font-semibold text-[#131b2e] focus:outline-hidden focus:border-[#00685f]"
              >
                {clinic.doctors.map((d, i) => (
                  <option key={i} value={d.name}>
                    {d.name} ({d.specialty})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#131b2e] mb-1">
                Interaction Focus Type
              </label>
              <select
                value={visitType}
                onChange={e => setVisitType(e.target.value as any)}
                className="w-full min-h-[44px] px-3 py-2 bg-[#f8faff] border border-[#bcc9c6] rounded-lg text-xs font-semibold text-[#131b2e] focus:outline-hidden focus:border-[#00685f]"
              >
                <option value="Clinical Detailing">Clinical Detailing (Trial Data)</option>
                <option value="Sample Drop">Starter Pack / Sample Drop</option>
                <option value="CME Invitation">CME / Symposium Invitation</option>
                <option value="Safety Update">Pharmacovigilance & Safety Notice</option>
              </select>
            </div>
          </div>

          {/* Doctor Sentiment Rating */}
          <div>
            <label className="block font-bold text-[#131b2e] mb-1.5">
              Doctor Engagement & Sentiment
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSentiment('Warm')}
                className={`min-h-[42px] px-3 py-1.5 rounded-lg border font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  sentiment === 'Warm'
                    ? 'bg-[#00685f] text-white border-[#00685f]'
                    : 'border-[#bcc9c6] text-[#3d4947] hover:bg-[#f2f3ff]'
                }`}
              >
                <span>Warm / Receptive</span>
              </button>

              <button
                type="button"
                onClick={() => setSentiment('Neutral')}
                className={`min-h-[42px] px-3 py-1.5 rounded-lg border font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  sentiment === 'Neutral'
                    ? 'bg-[#006398] text-white border-[#006398]'
                    : 'border-[#bcc9c6] text-[#3d4947] hover:bg-[#f2f3ff]'
                }`}
              >
                <span>Neutral / Standard</span>
              </button>

              <button
                type="button"
                onClick={() => setSentiment('Challenging')}
                className={`min-h-[42px] px-3 py-1.5 rounded-lg border font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  sentiment === 'Challenging'
                    ? 'bg-[#ba1a1a] text-white border-[#ba1a1a]'
                    : 'border-[#bcc9c6] text-[#3d4947] hover:bg-[#f2f3ff]'
                }`}
              >
                <span>Challenging</span>
              </button>
            </div>
          </div>

          {/* Discussion Summary */}
          <div>
            <label className="block font-bold text-[#131b2e] mb-1">
              Clinical Discussion Points & Physician Feedback
            </label>
            <textarea
              rows={3}
              value={discussionSummary}
              onChange={e => setDiscussionSummary(e.target.value)}
              placeholder="e.g. Reviewed post-ESC guidelines on CardioFlow 10mg. Doctor noted 14 chronic patients on current dual titration; requested 4 sample packs..."
              className="w-full p-3 bg-[#f8faff] border border-[#bcc9c6] rounded-lg text-xs text-[#131b2e] focus:outline-hidden focus:border-[#00685f] leading-relaxed"
            />
          </div>

          {/* Sample Disbursed Counter */}
          <div className="border border-[#e2e7ff] rounded-xl p-3 bg-[#faf8ff] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#131b2e] flex items-center gap-1">
                <Package className="w-3.5 h-3.5 text-[#00685f]" />
                <span>Sample Disbursed from Trunk Kit</span>
              </span>
              <span className="text-[11px] text-[#6d7a77]">HSA Logged</span>
            </div>

            <div className="space-y-1.5">
              {bagSamples.map(sample => (
                <div key={sample.id} className="flex items-center justify-between p-2 bg-[#ffffff] rounded-lg border border-[#e2e7ff]">
                  <div>
                    <div className="font-semibold text-[#131b2e]">{sample.name}</div>
                    <div className="text-[10px] text-[#6d7a77] font-mono">
                      Lot: {sample.lotNumber} ({sample.quantityInBag} avail in bag)
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSampleDropChange(sample.id, (sampleDrops[sample.id] || 0) - 1)}
                      className="w-7 h-7 rounded-md border border-[#bcc9c6] flex items-center justify-center font-bold text-xs hover:bg-[#f2f3ff] cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-7 text-center font-mono font-bold text-sm">
                      {sampleDrops[sample.id] || 0}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSampleDropChange(sample.id, (sampleDrops[sample.id] || 0) + 1)}
                      className="w-7 h-7 rounded-md border border-[#bcc9c6] flex items-center justify-center font-bold text-xs hover:bg-[#f2f3ff] cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Follow-up Action */}
          <div>
            <label className="block font-bold text-[#131b2e] mb-1">
              Follow-Up Commitment & Next Steps
            </label>
            <input
              type="text"
              value={actionItems}
              onChange={e => setActionItems(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 bg-[#f8faff] border border-[#bcc9c6] rounded-lg text-xs text-[#131b2e] focus:outline-hidden focus:border-[#00685f]"
            />
          </div>

          {/* Doctor Signature Check */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="docSign"
              checked={signedByDoctor}
              onChange={e => setSignedByDoctor(e.target.checked)}
              className="w-4 h-4 rounded-sm text-[#00685f] focus:ring-0 cursor-pointer"
            />
            <label htmlFor="docSign" className="font-medium text-[#131b2e] cursor-pointer">
              Physician verbal acknowledgement & sample handover receipt verified
            </label>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e2e7ff]">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 py-2 border border-[#bcc9c6] rounded-lg text-xs font-semibold text-[#131b2e] hover:bg-[#f2f3ff] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-6 py-2 bg-[#00685f] text-white hover:bg-[#005049] rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Record & Complete Visit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
