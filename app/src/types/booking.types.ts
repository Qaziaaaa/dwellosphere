export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  tenantId: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone?: string;
  agentId: string;
  agentName: string;
  date: string;
  timeSlot: string;
  status: BookingStatus;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ViewingRequest {
  propertyId: string;
  date: string;
  timeSlot: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
}
