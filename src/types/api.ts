export type UserRole = "DONOR" | "RECIPIENT" | "VOLUNTEER" | "ADMIN";
export type BatchStatus = "PENDING_INSPECTION" | "AVAILABLE" | "PARTIALLY_ALLOCATED" | "FULLY_ALLOCATED" | "EXPIRED" | "WASTED" | "REJECTED";
export type QuantityUnit = "PORTION" | "KG" | "G" | "L" | "PACK" | "UNIT";
export type Priority = "LOW" | "NORMAL" | "HIGH" | "URGENT";
export type FoodRequestStatus = "OPEN" | "PARTIALLY_FULFILLED" | "FULFILLED" | "CANCELLED" | "EXPIRED";
export type AllocationStatus = "CONFIRMED" | "PICKUP_SCHEDULED" | "PICKED_UP" | "DELIVERED" | "CANCELLED" | "FAILED";
export type PickupStatus = "SCHEDULED" | "ACCEPTED" | "PICKED_UP" | "DELIVERED" | "FAILED" | "CANCELLED";
export interface User { id:string; name:string; email:string; role:UserRole; organizationName?:string|null; avatarUrl?:string|null }
export interface FoodCategory { id:string; name:string }
export interface FoodType { id:string; name:string; category:FoodCategory; shelfLifeHours:number; requiresRefrigeration:boolean; description?:string|null; allergens:string[]; storageRequirements:string[] }
export interface Location { id:string; label:string; address:string; city:string; latitude?:number|null; longitude?:number|null }
export interface FoodBatch { id:string; donorName:string; foodType:FoodType; quantity:number; availableQuantity:number; unit:QuantityUnit; preparedAt:string; expiryAt:string; status:BatchStatus; location:Location; estimatedValue?:number|null; createdAt:string }
export interface FoodRequest { id:string; recipientName?:string; foodType:FoodType; requestedQuantity:number; fulfilledQuantity:number; unit:QuantityUnit; requiredBefore:string; priority:Priority; status:FoodRequestStatus; notes?:string|null; createdAt:string }
export interface Allocation { id:string; requestId:string; batchId:string; recipientName:string; donorName?:string; foodName:string; quantity:number; unit:QuantityUnit; expirySnapshot?:string; status:AllocationStatus; allocatedAt:string }
export interface Pickup { id:string; allocationId:string; volunteerName:string; vehicleNumber:string; scheduledAt:string; pickedAt?:string|null; deliveredAt?:string|null; receivedQuantity?:number|null; status:PickupStatus; notes?:string|null }
export interface Inspection { id:string; batchId:string; inspectedAt:string; temperatureC?:number|null; qualityScore:number; passed:boolean; remarks?:string|null }
export interface CreateFoodBatchInput { foodTypeId:string; quantity:number; unit:QuantityUnit; preparedAt:string; expiryAt:string; locationId:string; estimatedValue?:number; notes?:string }
export interface CreateFoodRequestInput { foodTypeId:string; requestedQuantity:number; unit:QuantityUnit; requiredBefore:string; priority:Priority; notes?:string }
export interface InspectionInput { passed:boolean; temperatureC?:number; qualityScore:number; remarks?:string }
export interface CreateAllocationInput { requestId:string; batchId:string; quantity:number }
export interface VolunteerOption { id:string; name:string; availabilityStatus:"AVAILABLE"|"ASSIGNED"|"OFF_DUTY" }
export interface VehicleOption { id:string; vehicleNumber:string; vehicleType:string; capacity:number; refrigerated:boolean; status:"AVAILABLE"|"IN_USE"|"MAINTENANCE" }
export interface CreatePickupInput { allocationId:string; volunteerId:string; vehicleId:string; scheduledAt:string; notes?:string }
export interface UpdatePickupStatusInput { status:"ACCEPTED"|"PICKED_UP"|"DELIVERED"|"FAILED"; pickedAt?:string; deliveredAt?:string; receivedQuantity?:number; notes?:string }
export interface DonorDashboard { totalBatches:number; totalQuantityDonated:number; availableBatches:number; deliveredBatches:number; wastageQuantity:number; recentBatches:FoodBatch[] }
export interface RecipientDashboard { openRequests:number; fulfilledRequests:number; activeAllocations:number; recentRequests:FoodRequest[] }
export interface AdminDashboard { totalQuantityDonated:number; totalQuantityDelivered:number; activeDonors:number; activeRecipients:number; pendingInspections:number; expiringBatchCount:number; recentBatches:FoodBatch[]; deliveryTrend:{date:string;quantity:number}[] }
export interface AdminAnalytics { summary:{donatedQuantity:number;deliveredQuantity:number;wastedQuantity:number;fulfilmentRate:number}; deliveryTrend:{date:string;quantity:number}[]; categoryBreakdown:{categoryName:string;quantity:number}[]; topDonors:{donorName:string;quantity:number}[]; wastageTrend:{date:string;quantity:number}[] }
export interface PaginationMeta { page:number; pageSize:number; total:number; totalPages:number }
export interface ApiErrorPayload { error:{code:string;message:string;details?:{field?:string;message?:string}[]}; requestId?:string }
export interface Paged<T> { data:T[]; meta:PaginationMeta }
