import type { 
  AdminAnalytics, 
  AdminDashboard, 
  Allocation, 
  BatchStatus, 
  CreateAllocationInput, 
  CreateFoodBatchInput, 
  CreateFoodRequestInput, 
  CreatePickupInput, 
  DonorDashboard, 
  FoodBatch, 
  FoodRequest, 
  FoodRequestStatus, 
  FoodType, 
  Inspection, 
  InspectionInput, 
  Location, 
  Pickup, 
  PickupStatus, 
  Priority, 
  RecipientDashboard, 
  User, 
  UserRole,
  VehicleOption, 
  VolunteerOption, 
  Paged, 
  UpdatePickupStatusInput 
} from "@/types/api";
import * as mock from "@/lib/mock";

const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api").replace(/\/$/, "");
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false";

export class ApiError extends Error {
  status: number;
  code: string;
  requestId?: string;
  details?: { field?: string; message?: string }[];

  constructor(status: number, payload: { error?: { code?: string; message?: string; details?: { field?: string; message?: string }[] }; requestId?: string }) {
    super(payload.error?.message || `Request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.code = payload.error?.code || "UNKNOWN_ERROR";
    this.requestId = payload.requestId;
    this.details = payload.error?.details;
  }
}

const qs = (params: Record<string, unknown>) => {
  const u = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") u.set(k, String(v));
  });
  const s = u.toString();
  return s ? `?${s}` : "";
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {})
    },
    cache: "no-store"
  });

  if (res.status === 204) return undefined as T;

  let body: any = {};
  try {
    body = await res.json();
  } catch {}

  if (!res.ok) {
    throw new ApiError(res.status, body);
  }
  return body as T;
}

const paged = <T>(data: T[], page = 1, pageSize = 20): Paged<T> => ({
  data,
  meta: {
    page,
    pageSize,
    total: data.length,
    totalPages: data.length ? Math.ceil(data.length / pageSize) : 0
  }
});

export const api = {
  isMockActive() {
    return USE_MOCKS;
  },

  switchRole(role: UserRole) {
    return mock.setActiveUserRole(role);
  },

  async health() {
    if (USE_MOCKS) {
      return {
        data: {
          status: "ok" as const,
          database: "ok" as const,
          timestamp: new Date().toISOString()
        }
      };
    }
    return request<any>("/health");
  },

  async login(email: string, password?: string) {
    if (USE_MOCKS) {
      // Find matching user or fallback based on email
      let role: UserRole = "ADMIN";
      const lower = email.toLowerCase();
      if (lower.includes("donor")) role = "DONOR";
      else if (lower.includes("recipient") || lower.includes("shelter")) role = "RECIPIENT";
      else if (lower.includes("volunteer") || lower.includes("driver")) role = "VOLUNTEER";
      
      const user = mock.setActiveUserRole(role);
      return { data: { user } };
    }
    return request<{ data: { user: User } }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
  },

  async logout() {
    if (USE_MOCKS) return;
    return request<void>("/auth/logout", { method: "POST" });
  },

  async me() {
    if (USE_MOCKS) {
      return { data: { user: mock.getActiveUser() } };
    }
    return request<{ data: { user: User } }>("/auth/me");
  },

  async foodTypes(search?: string, categoryId?: string) {
    if (USE_MOCKS) {
      return {
        data: mock.foodTypes.filter(f =>
          (!search || f.name.toLowerCase().includes(search.toLowerCase())) &&
          (!categoryId || f.category.id === categoryId)
        )
      };
    }
    return request<{ data: FoodType[] }>(`/food-types${qs({ search, categoryId })}`);
  },

  async donorDashboard() {
    if (USE_MOCKS) {
      // Recalculate dynamic aggregates
      const available = mock.batches.filter(b => b.status === "AVAILABLE" || b.status === "PARTIALLY_ALLOCATED").length;
      return {
        data: {
          ...mock.donorDashboard,
          availableBatches: available,
          recentBatches: mock.batches.slice(0, 10)
        }
      };
    }
    return request<{ data: DonorDashboard }>("/donor/dashboard");
  },

  async donorLocations() {
    if (USE_MOCKS) return { data: mock.locations };
    return request<{ data: Location[] }>("/donor/locations");
  },

  async donorBatches(page = 1, pageSize = 20, status?: BatchStatus, search?: string) {
    if (USE_MOCKS) {
      const filtered = mock.batches.filter(b =>
        (!status || b.status === status) &&
        (!search || b.foodType.name.toLowerCase().includes(search.toLowerCase()) || b.donorName.toLowerCase().includes(search.toLowerCase()))
      );
      return paged(filtered, page, pageSize);
    }
    return request<Paged<FoodBatch>>(`/donor/batches${qs({ page, pageSize, status, search })}`);
  },

  async createFoodBatch(input: CreateFoodBatchInput) {
    if (USE_MOCKS) {
      const foodType = mock.foodTypes.find(x => x.id === input.foodTypeId) || mock.foodTypes[0];
      const loc = mock.locations.find(x => x.id === input.locationId) || mock.locations[0];
      const b: FoodBatch = {
        id: `batch-${Date.now()}`,
        donorName: mock.getActiveUser().organizationName || mock.getActiveUser().name,
        foodType,
        quantity: input.quantity,
        availableQuantity: input.quantity,
        unit: input.unit,
        preparedAt: input.preparedAt,
        expiryAt: input.expiryAt,
        status: "PENDING_INSPECTION",
        location: loc,
        estimatedValue: input.estimatedValue || input.quantity * 25,
        createdAt: new Date().toISOString()
      };
      mock.batches.unshift(b);
      mock.adminDashboard.pendingInspections += 1;
      return { data: b };
    }
    return request<{ data: FoodBatch }>("/donor/batches", {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  async recipientDashboard() {
    if (USE_MOCKS) {
      const open = mock.requests.filter(r => r.status === "OPEN" || r.status === "PARTIALLY_FULFILLED").length;
      const fulfilled = mock.requests.filter(r => r.status === "FULFILLED").length;
      return {
        data: {
          ...mock.recipientDashboard,
          openRequests: open,
          fulfilledRequests: fulfilled,
          recentRequests: mock.requests.slice(0, 8)
        }
      };
    }
    return request<{ data: RecipientDashboard }>("/recipient/dashboard");
  },

  async availableFood(page = 1, pageSize = 20, filters?: { foodTypeId?: string; categoryId?: string; city?: string; expiresWithinHours?: number }) {
    if (USE_MOCKS) {
      const items = mock.batches.filter(b =>
        b.availableQuantity > 0 &&
        (b.status === "AVAILABLE" || b.status === "PARTIALLY_ALLOCATED") &&
        (!filters?.foodTypeId || b.foodType.id === filters.foodTypeId) &&
        (!filters?.categoryId || b.foodType.category.id === filters.categoryId) &&
        (!filters?.city || b.location.city.toLowerCase().includes(filters.city.toLowerCase()))
      );
      return paged(items, page, pageSize);
    }
    return request<Paged<FoodBatch>>(`/recipient/available-food${qs({ page, pageSize, ...filters })}`);
  },

  async recipientRequests(page = 1, pageSize = 20, status?: FoodRequestStatus) {
    if (USE_MOCKS) {
      const items = mock.requests.filter(r => !status || r.status === status);
      return paged(items, page, pageSize);
    }
    return request<Paged<FoodRequest>>(`/recipient/requests${qs({ page, pageSize, status })}`);
  },

  async createFoodRequest(input: CreateFoodRequestInput) {
    if (USE_MOCKS) {
      const foodType = mock.foodTypes.find(x => x.id === input.foodTypeId) || mock.foodTypes[0];
      const r: FoodRequest = {
        id: `req-${Date.now()}`,
        recipientName: mock.getActiveUser().organizationName || mock.getActiveUser().name,
        foodType,
        requestedQuantity: input.requestedQuantity,
        fulfilledQuantity: 0,
        unit: input.unit,
        requiredBefore: input.requiredBefore,
        priority: input.priority,
        status: "OPEN",
        notes: input.notes || null,
        createdAt: new Date().toISOString()
      };
      mock.requests.unshift(r);
      return { data: r };
    }
    return request<{ data: FoodRequest }>("/recipient/requests", {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  async recipientAllocations(page = 1, pageSize = 20, status?: Allocation["status"]) {
    if (USE_MOCKS) {
      const items = mock.allocations.filter(a => !status || a.status === status);
      return paged(items, page, pageSize);
    }
    return request<Paged<Allocation>>(`/recipient/allocations${qs({ page, pageSize, status })}`);
  },

  async adminDashboard() {
    if (USE_MOCKS) {
      const pendingInspections = mock.batches.filter(b => b.status === "PENDING_INSPECTION").length;
      return {
        data: {
          ...mock.adminDashboard,
          pendingInspections,
          recentBatches: mock.batches.slice(0, 10)
        }
      };
    }
    return request<{ data: AdminDashboard }>("/admin/dashboard");
  },

  async adminBatches(page = 1, pageSize = 20, status?: BatchStatus, search?: string) {
    if (USE_MOCKS) {
      const filtered = mock.batches.filter(b =>
        (!status || b.status === status) &&
        (!search || b.foodType.name.toLowerCase().includes(search.toLowerCase()) || b.donorName.toLowerCase().includes(search.toLowerCase()))
      );
      return paged(filtered, page, pageSize);
    }
    return request<Paged<FoodBatch>>(`/admin/batches${qs({ page, pageSize, status, search })}`);
  },

  async inspectBatch(batchId: string, input: InspectionInput) {
    if (USE_MOCKS) {
      const b = mock.batches.find(x => x.id === batchId);
      if (!b) throw new ApiError(404, { error: { code: "NOT_FOUND", message: "Batch not found" } });
      
      b.status = input.passed ? "AVAILABLE" : "REJECTED";
      const inspection: Inspection = {
        id: `insp-${Date.now()}`,
        batchId,
        inspectedAt: new Date().toISOString(),
        ...input
      };
      mock.inspections.unshift(inspection);
      return { data: inspection };
    }
    return request<{ data: Inspection }>(`/admin/batches/${batchId}/inspection`, {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  async adminRequests(page = 1, pageSize = 20, status?: FoodRequestStatus, priority?: Priority) {
    if (USE_MOCKS) {
      const filtered = mock.requests.filter(r =>
        (!status || r.status === status) &&
        (!priority || r.priority === priority)
      );
      return paged(filtered, page, pageSize);
    }
    return request<Paged<FoodRequest>>(`/admin/requests${qs({ page, pageSize, status, priority })}`);
  },

  async createAllocation(input: CreateAllocationInput) {
    if (USE_MOCKS) {
      const b = mock.batches.find(x => x.id === input.batchId);
      const r = mock.requests.find(x => x.id === input.requestId);
      if (!b || !r) throw new ApiError(404, { error: { code: "NOT_FOUND", message: "Batch or request not found" } });
      if (b.availableQuantity < input.quantity) {
        throw new ApiError(409, {
          error: {
            code: "INSUFFICIENT_QUANTITY",
            message: `Only ${b.availableQuantity} ${b.unit} remain available for this batch.`
          }
        });
      }
      
      // Atomic decrement simulating PostgreSQL SELECT FOR UPDATE
      b.availableQuantity -= input.quantity;
      b.status = b.availableQuantity === 0 ? "FULLY_ALLOCATED" : "PARTIALLY_ALLOCATED";

      r.fulfilledQuantity += input.quantity;
      r.status = r.fulfilledQuantity >= r.requestedQuantity ? "FULFILLED" : "PARTIALLY_FULFILLED";

      const a: Allocation = {
        id: `alloc-${Date.now()}`,
        requestId: r.id,
        batchId: b.id,
        recipientName: r.recipientName || "Recipient",
        donorName: b.donorName,
        foodName: b.foodType.name,
        quantity: input.quantity,
        unit: b.unit,
        expirySnapshot: b.expiryAt,
        status: "CONFIRMED",
        allocatedAt: new Date().toISOString()
      };
      mock.allocations.unshift(a);
      return { data: a };
    }
    return request<{ data: Allocation }>("/admin/allocations", {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  async volunteers() {
    if (USE_MOCKS) return { data: mock.volunteers };
    return request<{ data: VolunteerOption[] }>("/admin/volunteers");
  },

  async vehicles() {
    if (USE_MOCKS) return { data: mock.vehicles };
    return request<{ data: VehicleOption[] }>("/admin/vehicles");
  },

  async createPickup(input: CreatePickupInput) {
    if (USE_MOCKS) {
      const v = mock.volunteers.find(x => x.id === input.volunteerId);
      const veh = mock.vehicles.find(x => x.id === input.vehicleId);
      const p: Pickup = {
        id: `pick-${Date.now()}`,
        allocationId: input.allocationId,
        volunteerName: v?.name || "Assigned Courier",
        vehicleNumber: veh?.vehicleNumber || "Fleet Vehicle",
        scheduledAt: input.scheduledAt,
        status: "SCHEDULED",
        notes: input.notes || null
      };
      mock.pickups.unshift(p);
      const a = mock.allocations.find(x => x.id === input.allocationId);
      if (a) a.status = "PICKUP_SCHEDULED";
      if (veh) veh.status = "IN_USE";
      if (v) v.availabilityStatus = "ASSIGNED";
      return { data: p };
    }
    return request<{ data: Pickup }>("/admin/pickups", {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  async analytics(from?: string, to?: string) {
    if (USE_MOCKS) return { data: mock.analytics };
    return request<{ data: AdminAnalytics }>(`/admin/analytics${qs({ from, to })}`);
  },

  async volunteerPickups(page = 1, pageSize = 20, status?: PickupStatus) {
    if (USE_MOCKS) {
      const items = mock.pickups.filter(p => !status || p.status === status);
      return paged(items, page, pageSize);
    }
    return request<Paged<Pickup>>(`/volunteer/pickups${qs({ page, pageSize, status })}`);
  },

  async updatePickupStatus(pickupId: string, input: UpdatePickupStatusInput) {
    if (USE_MOCKS) {
      const p = mock.pickups.find(x => x.id === pickupId);
      if (!p) throw new ApiError(404, { error: { code: "NOT_FOUND", message: "Pickup not found" } });
      
      Object.assign(p, input);
      const a = mock.allocations.find(x => x.id === p.allocationId);
      if (a) {
        if (input.status === "PICKED_UP") a.status = "PICKED_UP";
        if (input.status === "DELIVERED") a.status = "DELIVERED";
        if (input.status === "FAILED") a.status = "FAILED";
      }
      return { data: p };
    }
    return request<{ data: Pickup }>(`/volunteer/pickups/${pickupId}/status`, {
      method: "PATCH",
      body: JSON.stringify(input)
    });
  }
};
