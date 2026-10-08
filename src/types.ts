export type HubRegion = 
  | 'Novena Hub' 
  | 'Orchard / Tanglin' 
  | 'Heartlands East' 
  | 'Heartlands West' 
  | 'Central / Heritage';

export type ClinicStatus = 
  | 'OPEN_NOW' 
  | 'VISITING_WINDOW_ACTIVE' 
  | 'CLOSING_SOON' 
  | 'BY_APPOINTMENT_ONLY' 
  | 'CLOSED';

export type ChasTier = 
  | 'CHAS Tier 1 (Comprehensive)' 
  | 'CHAS General' 
  | 'Pioneer & Merdeka' 
  | 'Private Specialist';

export type DoctorSentiment = 
  | 'Highly Receptive' 
  | 'Target / Neutral' 
  | 'Scientific Peer Focus' 
  | 'Follow-Up Needed';

export interface Doctor {
  name: string;
  mcrNumber: string; // Singapore Medical Council Registration Number
  specialty: string;
  subSpecialty?: string;
  qualifications: string;
  roomSuite: string;
  sentiment: DoctorSentiment;
  preferredTopic: string;
  preferredVisitDay: string;
  preferredBeverage?: string;
  lastVisited: string;
  clinicalTrialInterest: boolean;
}

export interface DrugProduct {
  id: string;
  name: string;
  genericName: string;
  therapeuticArea: string;
  dosage: string;
  sampleStockInClinic: number;
  monthlyPrescriptionVolume: string;
  reorderStatus: 'Urgent Replenish' | 'Adequate Stock' | 'Trial Evaluation' | 'Awaiting CME';
  hsaRegNumber: string;
}

export interface VisitHistoryRecord {
  id: string;
  date: string;
  repName: string;
  doctorName: string;
  type: 'Clinical Detailing' | 'Sample Drop' | 'CME Invitation' | 'Safety Update';
  durationMinutes: number;
  discussionSummary: string;
  sentimentRating: 'Warm' | 'Neutral' | 'Challenging';
  samplesDropped?: Array<{ productName: string; quantity: number }>;
  actionItems: string;
}

export interface Clinic {
  id: string;
  name: string;
  building: string;
  floorSuite: string;
  address: string;
  postalCode: string;
  hub: HubRegion;
  clinicType: 'Private Specialist Suite' | 'Hospital Specialist Centre' | 'Shophouse GP Practice' | 'Polyclinic Cluster Partner';
  status: ClinicStatus;
  visitingWindow: string;
  visitingWindowNotes: string;
  operatingHours: string;
  phone: string;
  receptionistName: string;
  mrtStation: string;
  chasTier: ChasTier;
  priorityTier: 'Tier A (High Volume)' | 'Tier B (Standard)' | 'Tier C (Niche)';
  coordinates: {
    lat: number;
    lng: number;
    mapX: number; // Percentage coordinate on Singapore vector map (0-100)
    mapY: number;
  };
  image: string;
  doctors: Doctor[];
  products: DrugProduct[];
  visitHistory: VisitHistoryRecord[];
  notes: string;
  inTodayRoute?: boolean;
  routeOrder?: number;
}

export interface BagSampleItem {
  id: string;
  name: string;
  dosage: string;
  therapeuticArea: string;
  lotNumber: string;
  expiryDate: string;
  quantityInBag: number;
  allocatedToday: number;
  coldChainRequired: boolean;
  storageTempCelsius?: number;
  hsaRegNumber: string;
}

export interface RouteStop {
  stopNumber: number;
  clinicId: string;
  scheduledTime: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
  transitMinutesFromPrev: number;
  transitMode: 'Drive / CTE' | 'Walk' | 'MRT Transit';
  completedAt?: string;
}
