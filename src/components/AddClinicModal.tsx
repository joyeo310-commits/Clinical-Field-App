import React, { useState, useEffect } from 'react';
import { Clinic, HubRegion } from '../types';
import { lookupSingaporePostal } from '../utils/singaporePostal';
import { createDefaultSuuBalmProducts } from '../data/clinicsData';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  Stethoscope, 
  X, 
  CheckCircle2, 
  Sparkles,
  Search,
  Plus
} from 'lucide-react';

interface AddClinicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClinic: (clinic: Clinic) => void;
  initialName?: string;
}

export const AddClinicModal: React.FC<AddClinicModalProps> = ({
  isOpen,
  onClose,
  onAddClinic,
  initialName = '',
}) => {
  const [name, setName] = useState(initialName);
  const [building, setBuilding] = useState('');
  const [floorSuite, setFloorSuite] = useState('#01-01');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [region, setRegion] = useState<'Central' | 'East' | 'West' | 'North' | 'North-East'>('Central');
  const [town, setTown] = useState('Novena');
  const [clinicType, setClinicType] = useState<Clinic['clinicType']>('Shophouse GP Practice');
  const [doctorName, setDoctorName] = useState('');
  const [mcrNumber, setMcrNumber] = useState('');
  const [specialty, setSpecialty] = useState('Family Medicine');
  const [phone, setPhone] = useState('+65 6');
  const [receptionistName, setReceptionistName] = useState('Clinic Receptionist');
  const [visitingWindow, setVisitingWindow] = useState('1:30 PM – 3:00 PM');
  const [chasTier, setChasTier] = useState<Clinic['chasTier']>('CHAS Tier 1 (Comprehensive)');
  const [status, setStatus] = useState<Clinic['status']>('OPEN_NOW');

  // Auto-detect town and region from Singapore 6-digit postal code
  useEffect(() => {
    if (postalCode.trim().length >= 2) {
      const info = lookupSingaporePostal(postalCode.trim());
      setRegion(info.region);
      if (info.town && info.town !== 'Singapore') {
        setTown(info.town);
      }
    }
  }, [postalCode]);

  useEffect(() => {
    if (initialName) {
      setName(initialName);
    }
  }, [initialName]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const postalInfo = lookupSingaporePostal(postalCode || '329565');
    const newId = `clinic-custom-${Date.now()}`;
    const hubName: HubRegion = `${region} Region` as HubRegion;

    const newClinic: Clinic = {
      id: newId,
      name: name.trim(),
      building: building.trim() || name.trim(),
      floorSuite: floorSuite.trim() || '#01-01',
      address: address.trim() || `${building || name}, Singapore`,
      postalCode: postalCode.replace(/\D/g, '') || '000000',
      region,
      town: town.trim() || postalInfo.town,
      hub: hubName,
      clinicType,
      status,
      visitingWindow,
      visitingWindowNotes: 'Custom clinic registered by sales rep. Standard detailing visit window.',
      operatingHours: '08:30 – 17:30 (Mon–Fri)',
      phone: phone.trim() || '+65 6000 0000',
      receptionistName: receptionistName.trim() || 'Front Desk',
      mrtStation: `${town} MRT`,
      chasTier,
      priorityTier: 'Tier B (Standard)',
      coordinates: {
        lat: 1.35,
        lng: 103.82,
        mapX: postalInfo.mapX,
        mapY: postalInfo.mapY,
      },
      image: '/src/assets/images/sg_shophouse_clinic_1791444876100.jpg',
      doctors: [
        {
          name: doctorName.trim() ? (doctorName.startsWith('Dr') ? doctorName : `Dr. ${doctorName}`) : 'Dr. Attending Physician',
          mcrNumber: mcrNumber.trim() ? (mcrNumber.startsWith('MCR') ? mcrNumber : `MCR ${mcrNumber}`) : `MCR ${Math.floor(10000 + Math.random() * 90000)}B`,
          specialty: specialty.trim() || 'Family Medicine',
          qualifications: 'MBBS (NUS)',
          roomSuite: floorSuite || 'Room 1',
          sentiment: 'Target / Neutral',
          preferredTopic: 'Suu Balm 5-ceramide rapid itch relief (<5 mins)',
          preferredVisitDay: 'Tuesday & Thursday',
          lastVisited: 'New Account',
          clinicalTrialInterest: false,
        },
      ],
      products: createDefaultSuuBalmProducts(4, 3, 2, 2),
      visitHistory: [],
      notes: `Custom registered clinic in ${town}. Added to rep territory for Suu Balm detailing.`,
      inTodayRoute: false,
    };

    onAddClinic(newClinic);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-[#ffffff] rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#dae2fd] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#f2f3ff] border-b border-[#dae2fd] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#00685f]/10 text-[#00685f] flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#131b2e]">
                Add Clinic to Territory
              </h2>
              <p className="text-xs text-[#3d4947]">
                Register any Singapore GP, specialist suite, or medical centre
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#6d7a77] hover:text-[#131b2e] hover:bg-[#dae2fd]/50 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm">
          {/* Quick Notice */}
          <div className="p-3 bg-[#e8f5e9] border border-[#a5d6a7] rounded-lg text-xs text-[#1b5e20] flex items-start gap-2">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-[#2e7d32]" />
            <span>
              Enter any 6-digit Singapore postal code to automatically map the Planning Region, town, and territory coordinates.
            </span>
          </div>

          {/* Clinic Name */}
          <div>
            <label className="block text-xs font-semibold text-[#131b2e] mb-1">
              Clinic Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Raffles Medical, Mount Alvernia Clinic, Acacia Family Clinic"
              className="w-full px-3 py-2 bg-[#f8faff] border border-[#bcc9c6] rounded-lg text-[#131b2e] placeholder-[#6d7a77] focus:outline-hidden focus:border-[#00685f]"
            />
          </div>

          {/* Postal Code & Region Auto-fill */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                Singapore Postal Code (6 digits)
              </label>
              <input
                type="text"
                maxLength={6}
                value={postalCode}
                onChange={e => setPostalCode(e.target.value)}
                placeholder="e.g. 238859 or 608532"
                className="w-full px-3 py-2 bg-[#f8faff] border border-[#bcc9c6] rounded-lg font-mono text-[#006398] focus:outline-hidden focus:border-[#00685f]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                Region (Auto-detected)
              </label>
              <select
                value={region}
                onChange={e => setRegion(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#f8faff] border border-[#bcc9c6] rounded-lg text-[#131b2e] focus:outline-hidden focus:border-[#00685f]"
              >
                <option value="Central">Central</option>
                <option value="North">North</option>
                <option value="North-East">North-East</option>
                <option value="East">East</option>
                <option value="West">West</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                Town / Area
              </label>
              <input
                type="text"
                value={town}
                onChange={e => setTown(e.target.value)}
                placeholder="e.g. Jurong East, Novena, Bedok"
                className="w-full px-3 py-2 bg-[#f8faff] border border-[#bcc9c6] rounded-lg text-[#131b2e] focus:outline-hidden focus:border-[#00685f]"
              />
            </div>
          </div>

          {/* Building & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                Building / Complex
              </label>
              <input
                type="text"
                value={building}
                onChange={e => setBuilding(e.target.value)}
                placeholder="e.g. Westgate Tower, Paragon, Shophouse"
                className="w-full px-3 py-2 bg-[#f8faff] border border-[#bcc9c6] rounded-lg text-[#131b2e] focus:outline-hidden focus:border-[#00685f]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                Floor / Unit / Suite
              </label>
              <input
                type="text"
                value={floorSuite}
                onChange={e => setFloorSuite(e.target.value)}
                placeholder="e.g. #02-14 or Ground Floor"
                className="w-full px-3 py-2 bg-[#f8faff] border border-[#bcc9c6] rounded-lg text-[#131b2e] focus:outline-hidden focus:border-[#00685f]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#131b2e] mb-1">
              Street Address
            </label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="e.g. 101 Irrawaddy Road or 3 Gateway Drive"
              className="w-full px-3 py-2 bg-[#f8faff] border border-[#bcc9c6] rounded-lg text-[#131b2e] focus:outline-hidden focus:border-[#00685f]"
            />
          </div>

          {/* Clinic Type & CHAS Tier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                Practice Type
              </label>
              <select
                value={clinicType}
                onChange={e => setClinicType(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#f8faff] border border-[#bcc9c6] rounded-lg text-[#131b2e] focus:outline-hidden focus:border-[#00685f]"
              >
                <option value="Shophouse GP Practice">Shophouse GP Practice</option>
                <option value="Private Specialist Suite">Private Specialist Suite</option>
                <option value="Hospital Specialist Centre">Hospital Specialist Centre</option>
                <option value="Polyclinic Cluster Partner">Polyclinic Cluster Partner</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                CHAS Tier
              </label>
              <select
                value={chasTier}
                onChange={e => setChasTier(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#f8faff] border border-[#bcc9c6] rounded-lg text-[#131b2e] focus:outline-hidden focus:border-[#00685f]"
              >
                <option value="CHAS Tier 1 (Comprehensive)">CHAS Tier 1 (Comprehensive)</option>
                <option value="CHAS General">CHAS General</option>
                <option value="Private Specialist">Private Specialist</option>
                <option value="Pioneer & Merdeka">Pioneer & Merdeka</option>
              </select>
            </div>
          </div>

          {/* Doctor Details */}
          <div className="p-3 bg-[#f8faff] rounded-xl border border-[#e2e7ff] space-y-3">
            <h3 className="text-xs font-bold text-[#00685f] uppercase tracking-wider flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Lead Physician Information</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#3d4947] mb-1">
                  Doctor Name
                </label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={e => setDoctorName(e.target.value)}
                  placeholder="e.g. Dr. Audrey Tan"
                  className="w-full px-2.5 py-1.5 bg-white border border-[#bcc9c6] rounded-md text-xs text-[#131b2e]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#3d4947] mb-1">
                  SMC MCR Number
                </label>
                <input
                  type="text"
                  value={mcrNumber}
                  onChange={e => setMcrNumber(e.target.value)}
                  placeholder="e.g. MCR 07421B"
                  className="w-full px-2.5 py-1.5 bg-white border border-[#bcc9c6] rounded-md text-xs font-mono text-[#006398]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#3d4947] mb-1">
                  Clinical Specialty
                </label>
                <input
                  type="text"
                  value={specialty}
                  onChange={e => setSpecialty(e.target.value)}
                  placeholder="e.g. Dermatology / Pediatrics / GP"
                  className="w-full px-2.5 py-1.5 bg-white border border-[#bcc9c6] rounded-md text-xs text-[#131b2e]"
                />
              </div>
            </div>
          </div>

          {/* Operational Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                Reception Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+65 6255 1234"
                className="w-full px-3 py-2 bg-[#f8faff] border border-[#bcc9c6] rounded-lg text-[#131b2e]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                Contact Nurse / Receptionist
              </label>
              <input
                type="text"
                value={receptionistName}
                onChange={e => setReceptionistName(e.target.value)}
                placeholder="e.g. Staff Nurse Sarah"
                className="w-full px-3 py-2 bg-[#f8faff] border border-[#bcc9c6] rounded-lg text-[#131b2e]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                Visiting Window
              </label>
              <input
                type="text"
                value={visitingWindow}
                onChange={e => setVisitingWindow(e.target.value)}
                placeholder="e.g. 1:00 PM – 2:30 PM"
                className="w-full px-3 py-2 bg-[#f8faff] border border-[#bcc9c6] rounded-lg text-[#131b2e]"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-[#dae2fd] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#bcc9c6] text-[#3d4947] hover:bg-[#f2f3ff] rounded-lg font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#00685f] hover:bg-[#005048] text-white rounded-lg font-bold flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Add to Directory</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
