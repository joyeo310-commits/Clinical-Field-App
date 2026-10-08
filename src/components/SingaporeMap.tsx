import React, { useState } from 'react';
import { Clinic, RouteStop } from '../types';
import { Navigation, MapPin, Compass, Clock, Car, Check, Plus, ExternalLink, Layers } from 'lucide-react';

interface SingaporeMapProps {
  clinics: Clinic[];
  routeStops: RouteStop[];
  selectedClinic: Clinic | null;
  onSelectClinic: (clinic: Clinic) => void;
  onToggleRoute: (clinic: Clinic) => void;
  onCall: (phone: string, clinicName: string) => void;
}

export const SingaporeMap: React.FC<SingaporeMapProps> = ({
  clinics,
  routeStops,
  selectedClinic,
  onSelectClinic,
  onToggleRoute,
  onCall,
}) => {
  const [activeZone, setActiveZone] = useState<'ALL' | 'NOVENA' | 'ORCHARD' | 'EAST' | 'WEST'>('ALL');
  const [showTransitLines, setShowTransitLines] = useState(true);

  // Filter clinics based on active zone
  const filteredClinics = clinics.filter(c => {
    if (activeZone === 'NOVENA') return c.hub === 'Novena Hub';
    if (activeZone === 'ORCHARD') return c.hub === 'Orchard / Tanglin';
    if (activeZone === 'EAST') return c.hub === 'Heartlands East';
    if (activeZone === 'WEST') return c.hub === 'Heartlands West';
    return true;
  });

  // Rep simulated position (Novena Health Hub)
  const repPosition = { x: 53.2, y: 46.8 };

  // Calculate route lines connecting stops in order
  const orderedRouteClinics = routeStops
    .map(stop => clinics.find(c => c.id === stop.clinicId))
    .filter((c): c is Clinic => c !== undefined);

  // SVG polyline coordinates string
  const routePointsString = orderedRouteClinics
    .map(c => `${c.coordinates.mapX},${c.coordinates.mapY}`)
    .join(' ');

  return (
    <div className="bg-[#ffffff] border border-[#e2e7ff] rounded-xl overflow-hidden shadow-xs flex flex-col">
      {/* Map Control Bar */}
      <div className="p-3 sm:p-4 bg-[#f2f3ff] border-b border-[#e2e7ff] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#00685f]" />
          <div>
            <h2 className="text-sm font-bold text-[#131b2e]">
              Singapore Clinical Territory Grid
            </h2>
            <div className="text-[11px] text-[#3d4947] flex items-center gap-1.5 font-medium">
              <span>GPS Tracking Active</span>
              <span className="text-[#bcc9c6]">·</span>
              <span className="text-[#059669] font-semibold">Rep at Novena Cluster</span>
              <span className="text-[#bcc9c6]">·</span>
              <span>{orderedRouteClinics.length} stops on active route</span>
            </div>
          </div>
        </div>

        {/* Region Quick Filters (functional buttons) */}
        <div className="flex items-center gap-1 bg-[#ffffff] p-1 rounded-lg border border-[#e2e7ff] text-xs">
          <button
            onClick={() => setActiveZone('ALL')}
            className={`min-h-[36px] px-3 py-1 font-semibold rounded-md transition-colors ${
              activeZone === 'ALL'
                ? 'bg-[#00685f] text-white shadow-xs'
                : 'text-[#3d4947] hover:text-[#131b2e]'
            }`}
          >
            All Island
          </button>
          <button
            onClick={() => setActiveZone('NOVENA')}
            className={`min-h-[36px] px-3 py-1 font-semibold rounded-md transition-colors ${
              activeZone === 'NOVENA'
                ? 'bg-[#00685f] text-white shadow-xs'
                : 'text-[#3d4947] hover:text-[#131b2e]'
            }`}
          >
            Novena Hub
          </button>
          <button
            onClick={() => setActiveZone('ORCHARD')}
            className={`min-h-[36px] px-3 py-1 font-semibold rounded-md transition-colors ${
              activeZone === 'ORCHARD'
                ? 'bg-[#00685f] text-white shadow-xs'
                : 'text-[#3d4947] hover:text-[#131b2e]'
            }`}
          >
            Orchard
          </button>
          <button
            onClick={() => setActiveZone('EAST')}
            className={`min-h-[36px] px-3 py-1 font-semibold rounded-md transition-colors ${
              activeZone === 'EAST'
                ? 'bg-[#00685f] text-white shadow-xs'
                : 'text-[#3d4947] hover:text-[#131b2e]'
            }`}
          >
            East Coast
          </button>
          <button
            onClick={() => setActiveZone('WEST')}
            className={`min-h-[36px] px-3 py-1 font-semibold rounded-md transition-colors ${
              activeZone === 'WEST'
                ? 'bg-[#00685f] text-white shadow-xs'
                : 'text-[#3d4947] hover:text-[#131b2e]'
            }`}
          >
            West Hub
          </button>
        </div>

        {/* Route Overlay Toggle */}
        <button
          onClick={() => setShowTransitLines(!showTransitLines)}
          className={`min-h-[36px] px-3 py-1 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
            showTransitLines
              ? 'bg-[#eaedff] border-[#00685f] text-[#00685f]'
              : 'border-[#bcc9c6] text-[#3d4947] bg-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{showTransitLines ? 'Route Polyline On' : 'Route Polyline Off'}</span>
        </button>
      </div>

      {/* Main SVG Map Canvas */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-[#eaedff]/30 overflow-hidden select-none">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full object-cover"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Subtle Singapore terrain gradient */}
            <linearGradient id="sgIslandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f2f3ff" />
            </linearGradient>

            {/* Pulse beacon glow */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background grid lines for tactical military/medical precision */}
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#dae2fd" strokeWidth="0.3" strokeDasharray="1,2" />
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />

          {/* Stylized Singapore Main Island Outline */}
          <path
            d="M 12 40 
               C 15 28, 25 18, 40 18 
               C 52 18, 62 22, 72 20 
               C 85 18, 94 25, 96 34 
               C 98 42, 92 52, 85 58 
               C 78 64, 70 66, 62 66 
               C 54 66, 48 70, 42 70 
               C 34 70, 26 66, 20 62 
               C 12 56, 8 48, 12 40 Z"
            fill="url(#sgIslandGrad)"
            stroke="#bcc9c6"
            strokeWidth="0.8"
            className="filter drop-shadow-sm"
          />

          {/* Sentosa Island */}
          <path
            d="M 40 73 C 44 72, 47 74, 46 76 C 43 78, 38 77, 40 73 Z"
            fill="#ffffff"
            stroke="#bcc9c6"
            strokeWidth="0.6"
          />

          {/* Major Expressways (CTE, PIE, AYE, ECP) */}
          {/* PIE (East-West spine) */}
          <path
            d="M 16 42 Q 40 40 52 45 T 90 36"
            fill="none"
            stroke="#dae2fd"
            strokeWidth="1.2"
            strokeDasharray="2,2"
          />
          {/* CTE (North-South through Novena & Orchard) */}
          <path
            d="M 52 22 Q 52 40 50 56 T 46 68"
            fill="none"
            stroke="#dae2fd"
            strokeWidth="1.4"
          />

          {/* Route Polyline Connecting Active Stops */}
          {showTransitLines && orderedRouteClinics.length > 1 && (
            <>
              {/* Glow border for route */}
              <polyline
                points={routePointsString}
                fill="none"
                stroke="#006398"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity="0.4"
              />
              {/* Active pulsing dashed line */}
              <polyline
                points={routePointsString}
                fill="none"
                stroke="#00685f"
                strokeWidth="1"
                strokeDasharray="2.5,1.5"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Regional Healthcare Hub Labels */}
          <text x="54" y="44" fontSize="2.2" fontWeight="700" fill="#00685f" opacity="0.85">
            NOVENA HEALTH HUB
          </text>
          <text x="36" y="55" fontSize="2.0" fontWeight="600" fill="#006398" opacity="0.75">
            ORCHARD SPECIALIST CORRIDOR
          </text>
          <text x="17" y="38" fontSize="2.0" fontWeight="600" fill="#6d7a77" opacity="0.8">
            JURONG WESTGATE
          </text>
          <text x="76" y="44" fontSize="2.0" fontWeight="600" fill="#6d7a77" opacity="0.8">
            BEDOK / TAMPINES
          </text>
          <text x="38" y="65" fontSize="1.9" fontWeight="600" fill="#6d7a77" opacity="0.8">
            TIONG BAHRU
          </text>

          {/* Rep Location Pulse & Marker */}
          <g transform={`translate(${repPosition.x}, ${repPosition.y})`}>
            {/* Outer expanding radar ring */}
            <circle r="4.5" fill="#00685f" fillOpacity="0.15">
              <animate attributeName="r" values="2;5.5;2" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="fillOpacity" values="0.35;0;0.35" dur="2.4s" repeatCount="indefinite" />
            </circle>
            {/* Inner rep dot */}
            <circle r="1.6" fill="#00685f" stroke="#ffffff" strokeWidth="0.6" filter="url(#glow)" />
            {/* Rep label */}
            <text x="2.5" y="-1.5" fontSize="2" fontWeight="800" fill="#00685f">
              YOU (Novena Link)
            </text>
          </g>

          {/* Clinic Pins */}
          {filteredClinics.map(clinic => {
            const isSelected = selectedClinic?.id === clinic.id;
            const inRoute = clinic.inTodayRoute;
            const routeStop = routeStops.find(s => s.clinicId === clinic.id);

            // Determine pin color based on operational visiting window
            let pinColor = '#00685f'; // default clinical teal
            if (clinic.status === 'VISITING_WINDOW_ACTIVE') pinColor = '#059669'; // Emerald
            if (clinic.status === 'CLOSING_SOON') pinColor = '#d97706'; // Amber
            if (clinic.status === 'BY_APPOINTMENT_ONLY') pinColor = '#006398'; // Blue

            return (
              <g
                key={clinic.id}
                transform={`translate(${clinic.coordinates.mapX}, ${clinic.coordinates.mapY})`}
                className="cursor-pointer group"
                onClick={() => onSelectClinic(clinic)}
              >
                {/* Active selection ring */}
                {isSelected && (
                  <circle
                    r="4.2"
                    fill="none"
                    stroke="#00685f"
                    strokeWidth="0.8"
                    strokeDasharray="1,1"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0"
                      to="360"
                      dur="10s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Route Stop Number badge if in route */}
                {inRoute && routeStop ? (
                  <g>
                    <circle r="2.2" fill="#00685f" stroke="#ffffff" strokeWidth="0.6" />
                    <text
                      y="0.8"
                      textAnchor="middle"
                      fontSize="1.6"
                      fontWeight="800"
                      fill="#ffffff"
                    >
                      {routeStop.stopNumber}
                    </text>
                  </g>
                ) : (
                  /* Standard Medical Pin */
                  <g>
                    <circle
                      r={isSelected ? '2.4' : '1.8'}
                      fill={pinColor}
                      stroke="#ffffff"
                      strokeWidth="0.5"
                      className="transition-all group-hover:scale-125"
                    />
                    <circle r="0.6" fill="#ffffff" />
                  </g>
                )}

                {/* Subtle Clinic Name Tag on Hover or Selected */}
                {(isSelected || clinic.hub === 'Novena Hub') && (
                  <g transform="translate(0, 4.2)">
                    <rect
                      x="-14"
                      y="-1.5"
                      width="28"
                      height="3.5"
                      rx="0.8"
                      fill="#131b2e"
                      fillOpacity="0.88"
                    />
                    <text
                      x="0"
                      y="1"
                      textAnchor="middle"
                      fontSize="1.6"
                      fontWeight="600"
                      fill="#ffffff"
                    >
                      {clinic.building.length > 20 ? clinic.building.slice(0, 18) + '...' : clinic.building}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Quick Legend in Bottom Left */}
        <div className="absolute bottom-3 left-3 bg-[#ffffff]/95 backdrop-blur-xs p-2.5 rounded-lg border border-[#e2e7ff] text-[11px] text-[#3d4947] space-y-1 shadow-xs pointer-events-none hidden sm:block">
          <div className="font-bold text-[#131b2e] text-xs">Tactical Legend</div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#059669]"></span>
            <span>Rep Visiting Window Active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00685f]"></span>
            <span>Clinic Open / Consults Active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006398]"></span>
            <span>By Appointment Only</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00685f] border border-white text-white font-mono text-[9px] flex items-center justify-center font-bold">#</span>
            <span>Scheduled Route Sequence</span>
          </div>
        </div>
      </div>

      {/* Selected Clinic Tactical Preview Drawer (if clinic clicked) */}
      {selectedClinic && (
        <div className="p-4 bg-[#f8faff] border-t border-[#e2e7ff] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 text-xs text-[#3d4947]">
              <span className="font-bold text-[#00685f]">{selectedClinic.hub}</span>
              <span className="text-[#bcc9c6]">·</span>
              <span>{selectedClinic.building} {selectedClinic.floorSuite}</span>
              <span className="text-[#bcc9c6]">·</span>
              <span className="font-mono text-[#006398]">S({selectedClinic.postalCode})</span>
              <span className="text-[#bcc9c6]">·</span>
              <span>{selectedClinic.mrtStation}</span>
            </div>

            <h3 className="text-base font-bold text-[#131b2e] truncate">
              {selectedClinic.name}
            </h3>

            <div className="text-xs text-[#131b2e] flex flex-wrap items-center gap-3">
              <span className="font-medium text-[#00685f]">
                Lead: {selectedClinic.doctors[0]?.name} ({selectedClinic.doctors[0]?.specialty})
              </span>
              <span className="text-[#6d7a77]">|</span>
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#00685f]" />
                Visiting Window: {selectedClinic.visitingWindow}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
            <button
              onClick={() => onCall(selectedClinic.phone, selectedClinic.name)}
              className="min-h-[44px] px-3.5 py-2 border border-[#bcc9c6] rounded-lg text-xs font-semibold text-[#131b2e] hover:bg-[#f2f3ff] transition-colors"
            >
              Call {selectedClinic.phone}
            </button>

            <button
              onClick={() => onToggleRoute(selectedClinic)}
              className={`min-h-[44px] px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                selectedClinic.inTodayRoute
                  ? 'bg-[#eaedff] text-[#00685f] border border-[#00685f]'
                  : 'bg-[#00685f] text-white hover:bg-[#005049]'
              }`}
            >
              {selectedClinic.inTodayRoute ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>On Today's Route</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Route</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
