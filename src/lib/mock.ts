import type { 
  AdminAnalytics, 
  AdminDashboard, 
  DonorDashboard, 
  FoodBatch, 
  FoodRequest, 
  FoodType, 
  Location, 
  RecipientDashboard, 
  User, 
  UserRole,
  VolunteerOption, 
  VehicleOption, 
  Allocation, 
  Pickup, 
  Inspection 
} from "@/types/api";

const now = Date.now();
const iso = (hoursOffset: number) => new Date(now + hoursOffset * 3600000).toISOString();
const dateStr = (daysOffset: number) => {
  const d = new Date(now + daysOffset * 86400000);
  return d.toISOString().split("T")[0];
};

// Seeded users for 4 roles
export const mockUsers: Record<UserRole, User> = {
  ADMIN: {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Aarav Sharma",
    email: "admin@replate.app",
    role: "ADMIN",
    organizationName: "REPLATE Central Operations"
  },
  DONOR: {
    id: "00000000-0000-0000-0000-000000000002",
    name: "Dr. Rajesh Iyer",
    email: "donor@replate.app",
    role: "DONOR",
    organizationName: "VIT Hostel & Dining Services"
  },
  RECIPIENT: {
    id: "00000000-0000-0000-0000-000000000003",
    name: "Sister Maria D'Souza",
    email: "recipient@replate.app",
    role: "RECIPIENT",
    organizationName: "Hope Community Kitchen & Shelter"
  },
  VOLUNTEER: {
    id: "00000000-0000-0000-0000-000000000004",
    name: "Rahul Kumar",
    email: "volunteer@replate.app",
    role: "VOLUNTEER",
    organizationName: "Green Shield Logistics Fleet"
  }
};

let activeUserRole: UserRole = "ADMIN";

export function getActiveUser(): User {
  if (typeof window !== "undefined") {
    const savedRole = localStorage.getItem("replate_active_role") as UserRole | null;
    if (savedRole && mockUsers[savedRole]) {
      activeUserRole = savedRole;
    }
  }
  return mockUsers[activeUserRole];
}

export function setActiveUserRole(role: UserRole): User {
  activeUserRole = role;
  if (typeof window !== "undefined") {
    localStorage.setItem("replate_active_role", role);
  }
  return mockUsers[role];
}

// Categories matching exact faculty specification
export const categories = [
  { id: "cat-1", name: "Cooked Meals" },
  { id: "cat-2", name: "Bakery" },
  { id: "cat-3", name: "Fruits" },
  { id: "cat-4", name: "Vegetables" },
  { id: "cat-5", name: "Dairy & Other" }
];

export const foodTypes: FoodType[] = [
  {
    id: "food-1",
    name: "Vegetable Biryani",
    category: categories[0],
    shelfLifeHours: 6,
    requiresRefrigeration: true,
    description: "Aromatic basmati rice cooked with fresh seasonal vegetables and spices",
    allergens: ["Dairy"],
    storageRequirements: ["REFRIGERATED", "KEEP_SEALED"]
  },
  {
    id: "food-2",
    name: "Dal Makhani & Steamed Rice",
    category: categories[0],
    shelfLifeHours: 8,
    requiresRefrigeration: true,
    description: "Slow-cooked black lentils in rich gravy with steamed long-grain rice",
    allergens: ["Dairy"],
    storageRequirements: ["REFRIGERATED"]
  },
  {
    id: "food-3",
    name: "Whole Wheat Chapati & Roti",
    category: categories[1],
    shelfLifeHours: 12,
    requiresRefrigeration: false,
    description: "Freshly made whole wheat flatbreads wrapped in food-grade foil",
    allergens: ["Gluten"],
    storageRequirements: ["ROOM_TEMP", "KEEP_DRY"]
  },
  {
    id: "food-4",
    name: "Artisan Multigrain Bread Loaves",
    category: categories[1],
    shelfLifeHours: 36,
    requiresRefrigeration: false,
    description: "Freshly baked baker's surplus multigrain sliced loaves",
    allergens: ["Gluten", "Sesame"],
    storageRequirements: ["ROOM_TEMP", "KEEP_DRY"]
  },
  {
    id: "food-5",
    name: "Fresh Seasonal Fruit Medley",
    category: categories[2],
    shelfLifeHours: 24,
    requiresRefrigeration: true,
    description: "Apples, bananas, oranges and watermelon crates from supermarket sorting",
    allergens: [],
    storageRequirements: ["COOL_TEMP", "VENTILATED"]
  },
  {
    id: "food-6",
    name: "Farm Fresh Green Vegetables",
    category: categories[3],
    shelfLifeHours: 48,
    requiresRefrigeration: true,
    description: "Cabbage, carrots, capsicum and spinach bundles",
    allergens: [],
    storageRequirements: ["REFRIGERATED", "HIGH_HUMIDITY"]
  },
  {
    id: "food-7",
    name: "Pasteurized Whole Milk Packets",
    category: categories[4],
    shelfLifeHours: 24,
    requiresRefrigeration: true,
    description: "Sealed 500ml milk pouches within safe shelf-life window",
    allergens: ["Dairy"],
    storageRequirements: ["REFRIGERATED_4C"]
  }
];

export const locations: Location[] = [
  {
    id: "loc-1",
    label: "Main Kitchen - Mess Block 1",
    address: "VIT University Campus, Katpadi",
    city: "Vellore",
    latitude: 12.9698,
    longitude: 79.1559
  },
  {
    id: "loc-2",
    label: "ABC Restaurant Central Kitchen",
    address: "14 Gandhi Road, Near Old Bus Stand",
    city: "Vellore",
    latitude: 12.9246,
    longitude: 79.1348
  },
  {
    id: "loc-3",
    label: "FreshMart Supermarket Hub",
    address: "Plot 88, Katpadi Main Road",
    city: "Vellore",
    latitude: 12.9712,
    longitude: 79.1482
  },
  {
    id: "loc-4",
    label: "College Mess Dining Hall B",
    address: "Engineering Campus North Wing",
    city: "Vellore",
    latitude: 12.9685,
    longitude: 79.1601
  }
];

export const batches: FoodBatch[] = [
  {
    id: "batch-101",
    donorName: "ABC Restaurant",
    foodType: foodTypes[0],
    quantity: 180,
    availableQuantity: 110,
    unit: "PORTION",
    preparedAt: iso(-2),
    expiryAt: iso(4),
    status: "PARTIALLY_ALLOCATED",
    location: locations[1],
    estimatedValue: 5400,
    createdAt: iso(-2)
  },
  {
    id: "batch-102",
    donorName: "VIT Hostel Mess",
    foodType: foodTypes[1],
    quantity: 250,
    availableQuantity: 250,
    unit: "PORTION",
    preparedAt: iso(-1),
    expiryAt: iso(7),
    status: "AVAILABLE",
    location: locations[0],
    estimatedValue: 7500,
    createdAt: iso(-1)
  },
  {
    id: "batch-103",
    donorName: "FreshMart",
    foodType: foodTypes[4],
    quantity: 120,
    availableQuantity: 120,
    unit: "KG",
    preparedAt: iso(-4),
    expiryAt: iso(20),
    status: "PENDING_INSPECTION",
    location: locations[2],
    estimatedValue: 4800,
    createdAt: iso(-4)
  },
  {
    id: "batch-104",
    donorName: "College Mess",
    foodType: foodTypes[2],
    quantity: 300,
    availableQuantity: 300,
    unit: "UNIT",
    preparedAt: iso(-1.5),
    expiryAt: iso(10),
    status: "PENDING_INSPECTION",
    location: locations[3],
    estimatedValue: 3000,
    createdAt: iso(-1.5)
  },
  {
    id: "batch-105",
    donorName: "ABC Restaurant",
    foodType: foodTypes[3],
    quantity: 80,
    availableQuantity: 0,
    unit: "PACK",
    preparedAt: iso(-12),
    expiryAt: iso(24),
    status: "FULLY_ALLOCATED",
    location: locations[1],
    estimatedValue: 3200,
    createdAt: iso(-12)
  },
  {
    id: "batch-106",
    donorName: "FreshMart",
    foodType: foodTypes[6],
    quantity: 60,
    availableQuantity: 60,
    unit: "L",
    preparedAt: iso(-3),
    expiryAt: iso(21),
    status: "AVAILABLE",
    location: locations[2],
    estimatedValue: 3600,
    createdAt: iso(-3)
  },
  {
    id: "batch-107",
    donorName: "VIT Hostel Mess",
    foodType: foodTypes[5],
    quantity: 90,
    availableQuantity: 0,
    unit: "KG",
    preparedAt: iso(-30),
    expiryAt: iso(-6),
    status: "EXPIRED",
    location: locations[0],
    estimatedValue: 2700,
    createdAt: iso(-30)
  }
];

export const requests: FoodRequest[] = [
  {
    id: "req-201",
    recipientName: "Hope Community Kitchen",
    foodType: foodTypes[0],
    requestedQuantity: 150,
    fulfilledQuantity: 70,
    unit: "PORTION",
    requiredBefore: iso(4),
    priority: "URGENT",
    status: "PARTIALLY_FULFILLED",
    notes: "Evening community dinner for 150 underprivileged individuals",
    createdAt: iso(-3)
  },
  {
    id: "req-202",
    recipientName: "Care Shelter for Children",
    foodType: foodTypes[1],
    requestedQuantity: 120,
    fulfilledQuantity: 0,
    unit: "PORTION",
    requiredBefore: iso(6),
    priority: "HIGH",
    status: "OPEN",
    notes: "Children's evening meal service, mild spices preferred",
    createdAt: iso(-2)
  },
  {
    id: "req-203",
    recipientName: "St. Jude Elder Care Home",
    foodType: foodTypes[2],
    requestedQuantity: 200,
    fulfilledQuantity: 0,
    unit: "UNIT",
    requiredBefore: iso(10),
    priority: "NORMAL",
    status: "OPEN",
    notes: "Soft chapatis for senior residents breakfast & dinner",
    createdAt: iso(-1)
  },
  {
    id: "req-204",
    recipientName: "Sunrise Welfare Trust",
    foodType: foodTypes[4],
    requestedQuantity: 50,
    fulfilledQuantity: 50,
    unit: "KG",
    requiredBefore: iso(18),
    priority: "NORMAL",
    status: "FULFILLED",
    notes: "Fresh fruit ration for weekend outreach program",
    createdAt: iso(-8)
  }
];

export const allocations: Allocation[] = [
  {
    id: "alloc-301",
    requestId: "req-201",
    batchId: "batch-101",
    recipientName: "Hope Community Kitchen",
    donorName: "ABC Restaurant",
    foodName: "Vegetable Biryani",
    quantity: 70,
    unit: "PORTION",
    expirySnapshot: iso(4),
    status: "PICKUP_SCHEDULED",
    allocatedAt: iso(-1.5)
  },
  {
    id: "alloc-302",
    requestId: "req-204",
    batchId: "batch-103",
    recipientName: "Sunrise Welfare Trust",
    donorName: "FreshMart",
    foodName: "Fresh Seasonal Fruit Medley",
    quantity: 50,
    unit: "KG",
    expirySnapshot: iso(20),
    status: "DELIVERED",
    allocatedAt: iso(-6)
  }
];

export const volunteers: VolunteerOption[] = [
  { id: "vol-1", name: "Rahul Kumar", availabilityStatus: "AVAILABLE" },
  { id: "vol-2", name: "Priya Nair", availabilityStatus: "AVAILABLE" },
  { id: "vol-3", name: "Arjun Das", availabilityStatus: "ASSIGNED" },
  { id: "vol-4", name: "Karthik Subramanian", availabilityStatus: "AVAILABLE" }
];

export const vehicles: VehicleOption[] = [
  {
    id: "veh-1",
    vehicleNumber: "TN 23 AB 4421",
    vehicleType: "Refrigerated Van",
    capacity: 500,
    refrigerated: true,
    status: "AVAILABLE"
  },
  {
    id: "veh-2",
    vehicleNumber: "TN 23 CD 8810",
    vehicleType: "Insulated Mini Truck",
    capacity: 800,
    refrigerated: false,
    status: "AVAILABLE"
  },
  {
    id: "veh-3",
    vehicleNumber: "TN 23 EF 1904",
    vehicleType: "Eco Cargo EV",
    capacity: 350,
    refrigerated: false,
    status: "IN_USE"
  }
];

export const pickups: Pickup[] = [
  {
    id: "pick-401",
    allocationId: "alloc-301",
    volunteerName: "Rahul Kumar",
    vehicleNumber: "TN 23 AB 4421",
    scheduledAt: iso(1.5),
    status: "SCHEDULED",
    notes: "Maintain temperature <= 4°C during transit. Call kitchen supervisor upon arrival."
  },
  {
    id: "pick-402",
    allocationId: "alloc-302",
    volunteerName: "Arjun Das",
    vehicleNumber: "TN 23 CD 8810",
    scheduledAt: iso(-5),
    pickedAt: iso(-4.5),
    deliveredAt: iso(-3.8),
    receivedQuantity: 50,
    status: "DELIVERED",
    notes: "Successfully handed over to Brother Thomas at shelter."
  }
];

export const inspections: Inspection[] = [
  {
    id: "insp-501",
    batchId: "batch-101",
    inspectedAt: iso(-2),
    temperatureC: 68.5,
    qualityScore: 5,
    passed: true,
    remarks: "Freshly prepared, hot holding temperature verified. Excellent hygiene."
  },
  {
    id: "insp-502",
    batchId: "batch-102",
    inspectedAt: iso(-1),
    temperatureC: 72.0,
    qualityScore: 5,
    passed: true,
    remarks: "High quality cooked lentils and rice. Sealed thermal transport containers."
  }
];

// Faculty exact KPI metrics (Image 3: 12,480 Meals Saved | 9,830 Distributed | 2,650 At Risk)
export const adminDashboard: AdminDashboard = {
  totalQuantityDonated: 12480,
  totalQuantityDelivered: 9830,
  activeDonors: 327,
  activeRecipients: 84,
  pendingInspections: 2,
  expiringBatchCount: 3,
  recentBatches: batches,
  deliveryTrend: [
    { date: "2026-10-22", quantity: 720 },
    { date: "2026-10-23", quantity: 860 },
    { date: "2026-10-24", quantity: 790 },
    { date: "2026-10-25", quantity: 1020 },
    { date: "2026-10-26", quantity: 1120 },
    { date: "2026-10-27", quantity: 1260 },
    { date: "2026-10-28", quantity: 1180 }
  ]
};

// Faculty exact analytics (Image 3 & 4)
export const analytics: AdminAnalytics = {
  summary: {
    donatedQuantity: 12480,
    deliveredQuantity: 9830,
    wastedQuantity: 645,
    fulfilmentRate: 78.7
  },
  deliveryTrend: adminDashboard.deliveryTrend,
  // Exact category breakdown from Image 4: Cooked Meals 48%, Bakery 21%, Fruits 15%, Vegetables 10%, Other 6%
  categoryBreakdown: [
    { categoryName: "Cooked Meals", quantity: 5990 }, // 48%
    { categoryName: "Bakery", quantity: 2620 },       // 21%
    { categoryName: "Fruits", quantity: 1872 },       // 15%
    { categoryName: "Vegetables", quantity: 1248 },   // 10%
    { categoryName: "Other", quantity: 750 }          // 6%
  ],
  // Exact donor contributions from Image 3: ABC Restaurant, VIT Hostel, FreshMart, College Mess
  topDonors: [
    { donorName: "ABC Restaurant", quantity: 4200 },
    { donorName: "VIT Hostel Mess", quantity: 3450 },
    { donorName: "FreshMart", quantity: 2680 },
    { donorName: "College Mess", quantity: 2150 }
  ],
  // Exact wastage trend from Image 4: Oct 21 to Oct 25
  wastageTrend: [
    { date: "2026-10-21", quantity: 180 },
    { date: "2026-10-22", quantity: 95 },
    { date: "2026-10-23", quantity: 240 },
    { date: "2026-10-24", quantity: 120 },
    { date: "2026-10-25", quantity: 60 }
  ]
};

export const donorDashboard: DonorDashboard = {
  totalBatches: 54,
  totalQuantityDonated: 5680,
  availableBatches: 8,
  deliveredBatches: 42,
  wastageQuantity: 140,
  recentBatches: batches
};

export const recipientDashboard: RecipientDashboard = {
  openRequests: 3,
  fulfilledRequests: 24,
  activeAllocations: 2,
  recentRequests: requests
};

// Machine learning / DBMS surplus forecasts (DONOR + FOOD_TYPE -> SURPLUS_FORECAST)
export interface SurplusForecast {
  donorName: string;
  foodTypeName: string;
  predictedSurplusQuantity: number;
  unit: string;
  confidenceScore: number;
  expectedDay: string;
  recommendedAction: string;
}

export const surplusForecasts: SurplusForecast[] = [
  {
    donorName: "VIT Hostel Mess",
    foodTypeName: "Dal Makhani & Steamed Rice",
    predictedSurplusQuantity: 160,
    unit: "PORTION",
    confidenceScore: 92,
    expectedDay: "Friday Dinner (20:00)",
    recommendedAction: "Pre-alert Hope Community Kitchen & reserve Van TN 23 AB 4421"
  },
  {
    donorName: "ABC Restaurant",
    foodTypeName: "Vegetable Biryani",
    predictedSurplusQuantity: 120,
    unit: "PORTION",
    confidenceScore: 88,
    expectedDay: "Saturday Lunch (14:30)",
    recommendedAction: "Schedule priority inspection slot at 14:45"
  },
  {
    donorName: "FreshMart",
    foodTypeName: "Fresh Seasonal Fruit Medley",
    predictedSurplusQuantity: 90,
    unit: "KG",
    confidenceScore: 94,
    expectedDay: "Sunday Evening (19:00)",
    recommendedAction: "Dispatch directly to St. Jude Elder Care Home"
  }
];

// Relational Schema specification for the interactive DBMS Inspector
export interface DbmsTableMeta {
  tableName: string;
  entityRole: string;
  recordCount: number;
  primaryKey: string;
  foreignKeys: { column: string; references: string }[];
  columns: { name: string; type: string; nullable: boolean; notes?: string }[];
  description: string;
}

export const dbmsTables: DbmsTableMeta[] = [
  {
    tableName: "users",
    entityRole: "Core Entity",
    recordCount: 411,
    primaryKey: "id (UUID)",
    foreignKeys: [],
    columns: [
      { name: "id", type: "UUID", nullable: false, notes: "Opaque UUID primary key" },
      { name: "name", type: "VARCHAR(255)", nullable: false },
      { name: "email", type: "VARCHAR(255) UNIQUE", nullable: false },
      { name: "role", type: "ENUM('DONOR','RECIPIENT','VOLUNTEER','ADMIN')", nullable: false },
      { name: "organization_name", type: "VARCHAR(255)", nullable: true },
      { name: "created_at", type: "TIMESTAMPTZ", nullable: false }
    ],
    description: "Master identity table storing all authenticated participants in the redistribution network."
  },
  {
    tableName: "donor_locations",
    entityRole: "Donor Dimension",
    recordCount: 327,
    primaryKey: "id (UUID)",
    foreignKeys: [{ column: "donor_id", references: "users(id)" }],
    columns: [
      { name: "id", type: "UUID", nullable: false },
      { name: "donor_id", type: "UUID", nullable: false },
      { name: "label", type: "VARCHAR(128)", nullable: false, notes: "e.g. Main Kitchen" },
      { name: "address", type: "TEXT", nullable: false },
      { name: "city", type: "VARCHAR(64)", nullable: false },
      { name: "latitude", type: "DOUBLE PRECISION", nullable: true },
      { name: "longitude", type: "DOUBLE PRECISION", nullable: true }
    ],
    description: "Physical pickup sites registered by donors (campus messes, restaurants, warehouses)."
  },
  {
    tableName: "food_types",
    entityRole: "Catalog Dimension",
    recordCount: 28,
    primaryKey: "id (UUID)",
    foreignKeys: [{ column: "category_id", references: "food_categories(id)" }],
    columns: [
      { name: "id", type: "UUID", nullable: false },
      { name: "name", type: "VARCHAR(128)", nullable: false },
      { name: "category_id", type: "UUID", nullable: false },
      { name: "shelf_life_hours", type: "NUMERIC(5,2)", nullable: false },
      { name: "requires_refrigeration", type: "BOOLEAN", nullable: false }
    ],
    description: "Classification catalogue specifying shelf-life boundaries and refrigeration requirements."
  },
  {
    tableName: "food_batches",
    entityRole: "Transactional Inventory",
    recordCount: batches.length + 1240,
    primaryKey: "id (UUID)",
    foreignKeys: [
      { column: "donor_id", references: "users(id)" },
      { column: "food_type_id", references: "food_types(id)" },
      { column: "location_id", references: "donor_locations(id)" }
    ],
    columns: [
      { name: "id", type: "UUID", nullable: false },
      { name: "donor_id", type: "UUID", nullable: false },
      { name: "food_type_id", type: "UUID", nullable: false },
      { name: "location_id", type: "UUID", nullable: false },
      { name: "quantity", type: "NUMERIC(10,2)", nullable: false },
      { name: "available_quantity", type: "NUMERIC(10,2)", nullable: false, notes: "Locked via SELECT FOR UPDATE" },
      { name: "unit", type: "ENUM('PORTION','KG','G','L','PACK','UNIT')", nullable: false },
      { name: "prepared_at", type: "TIMESTAMPTZ", nullable: false },
      { name: "expiry_at", type: "TIMESTAMPTZ", nullable: false },
      { name: "status", type: "VARCHAR(32)", nullable: false }
    ],
    description: "Core inventory table representing surplus food batches. Available quantity decreases with allocations."
  },
  {
    tableName: "inspections",
    entityRole: "Quality Assurance",
    recordCount: batches.length + 1190,
    primaryKey: "id (UUID)",
    foreignKeys: [
      { column: "batch_id", references: "food_batches(id)" },
      { column: "inspector_id", references: "users(id)" }
    ],
    columns: [
      { name: "id", type: "UUID", nullable: false },
      { name: "batch_id", type: "UUID", nullable: false },
      { name: "inspected_at", type: "TIMESTAMPTZ", nullable: false },
      { name: "temperature_c", type: "NUMERIC(4,1)", nullable: true },
      { name: "quality_score", type: "SMALLINT CHECK (1-5)", nullable: false },
      { name: "passed", type: "BOOLEAN", nullable: false },
      { name: "remarks", type: "TEXT", nullable: true }
    ],
    description: "Audit trail of quality evaluations before batches transition to AVAILABLE or REJECTED."
  },
  {
    tableName: "food_requests",
    entityRole: "Demand Pipeline",
    recordCount: requests.length + 820,
    primaryKey: "id (UUID)",
    foreignKeys: [
      { column: "recipient_id", references: "users(id)" },
      { column: "food_type_id", references: "food_types(id)" }
    ],
    columns: [
      { name: "id", type: "UUID", nullable: false },
      { name: "recipient_id", type: "UUID", nullable: false },
      { name: "food_type_id", type: "UUID", nullable: false },
      { name: "requested_quantity", type: "NUMERIC(10,2)", nullable: false },
      { name: "fulfilled_quantity", type: "NUMERIC(10,2)", nullable: false },
      { name: "priority", type: "ENUM('LOW','NORMAL','HIGH','URGENT')", nullable: false },
      { name: "status", type: "VARCHAR(32)", nullable: false }
    ],
    description: "Beneficiary demand tickets logged by shelters, orphanages, and community kitchens."
  },
  {
    tableName: "allocations",
    entityRole: "Matching Engine",
    recordCount: allocations.length + 810,
    primaryKey: "id (UUID)",
    foreignKeys: [
      { column: "request_id", references: "food_requests(id)" },
      { column: "batch_id", references: "food_batches(id)" }
    ],
    columns: [
      { name: "id", type: "UUID", nullable: false },
      { name: "request_id", type: "UUID", nullable: false },
      { name: "batch_id", type: "UUID", nullable: false },
      { name: "quantity", type: "NUMERIC(10,2)", nullable: false },
      { name: "expiry_snapshot", type: "TIMESTAMPTZ", nullable: false, notes: "Historical snapshot" },
      { name: "status", type: "VARCHAR(32)", nullable: false }
    ],
    description: "Transactional binding between an available batch and an open request."
  },
  {
    tableName: "pickups",
    entityRole: "Logistics Dispatch",
    recordCount: pickups.length + 795,
    primaryKey: "id (UUID)",
    foreignKeys: [
      { column: "allocation_id", references: "allocations(id)" },
      { column: "volunteer_id", references: "users(id)" },
      { column: "vehicle_id", references: "vehicles(id)" }
    ],
    columns: [
      { name: "id", type: "UUID", nullable: false },
      { name: "allocation_id", type: "UUID", nullable: false },
      { name: "volunteer_id", type: "UUID", nullable: false },
      { name: "vehicle_id", type: "UUID", nullable: false },
      { name: "scheduled_at", type: "TIMESTAMPTZ", nullable: false },
      { name: "picked_at", type: "TIMESTAMPTZ", nullable: true },
      { name: "delivered_at", type: "TIMESTAMPTZ", nullable: true },
      { name: "status", type: "VARCHAR(32)", nullable: false }
    ],
    description: "Physical dispatch orders tracked from SCHEDULED -> ACCEPTED -> PICKED_UP -> DELIVERED."
  },
  {
    tableName: "surplus_forecasts",
    entityRole: "Predictive Analytics",
    recordCount: 84,
    primaryKey: "id (UUID)",
    foreignKeys: [
      { column: "donor_id", references: "users(id)" },
      { column: "food_type_id", references: "food_types(id)" }
    ],
    columns: [
      { name: "id", type: "UUID", nullable: false },
      { name: "donor_id", type: "UUID", nullable: false },
      { name: "food_type_id", type: "UUID", nullable: false },
      { name: "predicted_quantity", type: "NUMERIC(10,2)", nullable: false },
      { name: "confidence_score", type: "NUMERIC(4,2)", nullable: false }
    ],
    description: "Aggregated forecast materialized view combining historical donor output and seasonality."
  }
];
