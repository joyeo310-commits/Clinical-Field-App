import React, { useState } from 'react';
import { BagSampleItem } from '../types';
import { 
  Package, 
  Thermometer, 
  ShieldCheck, 
  AlertTriangle, 
  Plus, 
  Minus, 
  FileCheck, 
  RefreshCw, 
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface SampleBagManagerProps {
  samples: BagSampleItem[];
  onUpdateSamples: (updated: BagSampleItem[]) => void;
  onToast: (msg: string) => void;
}

export const SampleBagManager: React.FC<SampleBagManagerProps> = ({
  samples,
  onUpdateSamples,
  onToast,
}) => {
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [replenishModal, setReplenishModal] = useState(false);

  const coldChainSample = samples.find(s => s.coldChainRequired);
  const totalUnitsInBag = samples.reduce((acc, s) => acc + s.quantityInBag, 0);
  const totalAllocatedToday = samples.reduce((acc, s) => acc + s.allocatedToday, 0);

  const handleAdjustQuantity = (id: string, delta: number) => {
    const updated = samples.map(item => {
      if (item.id === id) {
        const nextVal = Math.max(0, item.quantityInBag + delta);
        return { ...item, quantityInBag: nextVal };
      }
      return item;
    });
    onUpdateSamples(updated);
  };

  const handleReplenishAll = () => {
    const updated = samples.map(item => ({
      ...item,
      quantityInBag: item.quantityInBag + 10,
    }));
    onUpdateSamples(updated);
    setReplenishModal(false);
    onToast('Trunk stock restocked from Tuas Central Warehouse depot.');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: HSA Compliance & Cold Chain Monitor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cold Chain Sensor Box */}
        <div className="bg-[#ffffff] border border-[#e2e7ff] rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#00685f]">
              <Thermometer className="w-4 h-4 text-[#00685f]" />
              <span>COLD CHAIN TELEMETRY</span>
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-[#131b2e] mt-1">
              {coldChainSample?.storageTempCelsius ?? 4.2}°C
            </div>
            <div className="text-[11px] text-[#059669] font-medium flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Within 2.0°C – 8.0°C Validated Range</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#f2f3ff] border border-[#dae2fd] flex items-center justify-center text-[#00685f] font-mono font-bold text-xs">
            POD 1
          </div>
        </div>

        {/* HSA Regulatory Clearance */}
        <div className="bg-[#ffffff] border border-[#e2e7ff] rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#006398]">
              <ShieldCheck className="w-4 h-4 text-[#006398]" />
              <span>HSA SINGAPORE COMPLIANCE</span>
            </div>
            <div className="text-lg font-bold text-[#131b2e] mt-1">
              Good Distribution Practice (GDP)
            </div>
            <div className="text-[11px] text-[#3d4947] mt-0.5">
              Daily Rep Sample Log Active · Lot verification synced
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#eaedff] border border-[#bcc9c6] flex items-center justify-center text-[#006398]">
            <FileCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Bag Inventory Summary */}
        <div className="bg-[#ffffff] border border-[#e2e7ff] rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#006948]">
              <Package className="w-4 h-4 text-[#006948]" />
              <span>BAG ALLOCATION BALANCE</span>
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-[#131b2e] mt-1">
              {totalUnitsInBag} Units
            </div>
            <div className="text-[11px] text-[#3d4947] mt-0.5">
              {totalAllocatedToday} earmarked for scheduled clinics
            </div>
          </div>
          <button
            onClick={() => setReplenishModal(true)}
            className="min-h-[44px] px-3 py-2 bg-[#f2f3ff] hover:bg-[#dae2fd] text-[#00685f] rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restock</span>
          </button>
        </div>
      </div>

      {/* Main Sample Table (Zero-Pill Tabular Discipline) */}
      <div className="bg-[#ffffff] border border-[#e2e7ff] rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-[#e2e7ff] flex flex-wrap items-center justify-between gap-3 bg-[#faf8ff]">
          <div>
            <h3 className="text-base font-bold text-[#131b2e]">
              Field Representative Sample Trunk & Dispensation Register
            </h3>
            <p className="text-xs text-[#3d4947] mt-0.5">
              Authorized prescription drug samples for physical medical detailing in Singapore healthcare practices.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowReceiptModal(true)}
              className="min-h-[44px] px-4 py-2 border border-[#bcc9c6] rounded-lg text-xs font-semibold text-[#131b2e] hover:bg-[#f2f3ff] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-[#00685f]" />
              <span>HSA Handover Audit Log</span>
            </button>
          </div>
        </div>

        {/* Mobile View: High-clarity touch cards */}
        <div className="block sm:hidden divide-y divide-[#e2e7ff]">
          {samples.map(item => (
            <div key={item.id} className="p-4 space-y-3 bg-[#ffffff]">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    {item.coldChainRequired && (
                      <span className="text-xs" title="Cold Chain Regulated">❄️</span>
                    )}
                    <h4 className="text-sm font-bold text-[#131b2e] leading-tight">
                      {item.name}
                    </h4>
                  </div>
                  <div className="text-xs text-[#3d4947] mt-0.5">{item.dosage}</div>
                  <div className="text-[11px] text-[#6d7a77]">{item.therapeuticArea}</div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-[#00685f]">
                    {item.allocatedToday} alloc.
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#3d4947] font-mono bg-[#f2f3ff] p-2.5 rounded-lg">
                <div>
                  <span className="text-[#6d7a77] block text-[10px]">LOT NUMBER</span>
                  <span className="font-semibold text-[#131b2e]">{item.lotNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#6d7a77] block text-[10px]">EXPIRY</span>
                  <span>{item.expiryDate}</span>
                </div>
              </div>

              {/* Quantity Adjuster with 44px touch targets */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-[#131b2e]">
                  Available in Bag:
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleAdjustQuantity(item.id, -1)}
                    className="min-h-[44px] min-w-[44px] rounded-lg border border-[#bcc9c6] bg-[#f8faff] active:bg-[#dae2fd] flex items-center justify-center font-bold text-sm cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-mono font-bold text-lg tabular-nums min-w-[32px] text-center">
                    {item.quantityInBag}
                  </span>
                  <button
                    onClick={() => handleAdjustQuantity(item.id, 1)}
                    className="min-h-[44px] min-w-[44px] rounded-lg border border-[#bcc9c6] bg-[#f8faff] active:bg-[#dae2fd] flex items-center justify-center font-bold text-sm cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Full Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e7ff] text-[11px] font-semibold text-[#3d4947] bg-[#f2f3ff]/60 uppercase tracking-wider">
                <th className="py-3 px-4">Product & Specification</th>
                <th className="py-3 px-4">Therapeutic Area</th>
                <th className="py-3 px-4">Batch Lot Number</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4 text-center">In Bag Stock</th>
                <th className="py-3 px-4 text-center">Allocated Today</th>
                <th className="py-3 px-4 text-right">Quick Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e7ff] text-xs">
              {samples.map(item => (
                <tr key={item.id} className="hover:bg-[#faf8ff] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#131b2e]">
                    <div className="flex items-center gap-2">
                      {item.coldChainRequired && (
                        <span className="text-[#006398] font-bold" title="Cold Chain Regulated Product">
                          ❄️
                        </span>
                      )}
                      <div>
                        <div className="text-sm font-bold text-[#131b2e]">{item.name}</div>
                        <div className="text-[11px] font-normal text-[#3d4947]">{item.dosage}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-[#3d4947]">
                    {item.therapeuticArea}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-medium text-[#131b2e]">
                    <div>{item.lotNumber}</div>
                    <div className="text-[10px] text-[#6d7a77]">{item.hsaRegNumber}</div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[#3d4947]">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#6d7a77]" />
                      <span>{item.expiryDate}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-bold text-base text-[#131b2e] tabular-nums">
                    {item.quantityInBag}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-semibold text-xs text-[#00685f] tabular-nums">
                    {item.allocatedToday} units
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleAdjustQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-md border border-[#bcc9c6] hover:bg-[#f2f3ff] flex items-center justify-center transition-colors cursor-pointer text-[#131b2e]"
                        title="Reduce by 1"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleAdjustQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-md border border-[#bcc9c6] hover:bg-[#f2f3ff] flex items-center justify-center transition-colors cursor-pointer text-[#131b2e]"
                        title="Add by 1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Handover Audit Log Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#ffffff] border border-[#e2e7ff] rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#e2e7ff] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#131b2e]">
                  HSA Sample Handover Register
                </h3>
                <p className="text-xs text-[#3d4947]">
                  Republic of Singapore Health Sciences Authority Compliance Record
                </p>
              </div>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="text-[#6d7a77] hover:text-[#131b2e] text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-[#3d4947] space-y-3 font-mono">
              <div className="bg-[#f2f3ff] p-3 rounded-lg space-y-1">
                <div>REP: Marcus Lee (ID: SG-REP-4402)</div>
                <div>TERRITORY: Singapore Central & Novena Cluster</div>
                <div>DATE: 2026-10-08 · SESSION: Morning Field Rotation</div>
                <div>DISTRIBUTION LICENCE: TS-HSA-88219-B</div>
              </div>

              <div className="border border-[#e2e7ff] rounded-lg p-3 space-y-2">
                <div className="font-bold text-[#131b2e]">CURRENT INVENTORY VERIFICATION:</div>
                {samples.map(s => (
                  <div key={s.id} className="flex justify-between border-b border-[#e2e7ff]/50 pb-1">
                    <span>{s.name} ({s.lotNumber})</span>
                    <span className="font-bold text-[#00685f]">{s.quantityInBag} pkgs</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  onToast('Official HSA Audit Certificate exported to downloads.');
                  setShowReceiptModal(false);
                }}
                className="min-h-[44px] px-4 py-2 bg-[#00685f] text-white font-semibold rounded-lg text-xs hover:bg-[#005049] transition-colors cursor-pointer"
              >
                Export Audit PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {replenishModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#ffffff] border border-[#e2e7ff] rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-[#131b2e]">
              Replenish Trunk Stock
            </h3>
            <p className="text-xs text-[#3d4947]">
              Confirm transfer of 10 additional units per SKU from Central Depository (Tuas Hub) into Marcus Lee's mobile trunk kit.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3">
              <button
                onClick={() => setReplenishModal(false)}
                className="min-h-[44px] px-4 py-2 border border-[#bcc9c6] rounded-lg text-xs font-semibold text-[#131b2e] hover:bg-[#f2f3ff] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReplenishAll}
                className="min-h-[44px] px-4 py-2 bg-[#00685f] text-white font-semibold rounded-lg text-xs hover:bg-[#005049] cursor-pointer shadow-xs"
              >
                Confirm Restock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
