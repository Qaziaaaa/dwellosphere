import type { Booking, ViewingRequest, BookingStatus } from '@/types/booking.types';
import * as api from '@/lib/api';

interface BackendBooking {
  id: string;
  propertyId: string;
  property: { id: string; title: string; images?: string };
  tenantId: string;
  tenant?: { id: string; firstName: string; lastName: string; email: string; phone?: string };
  date: string;
  timeSlot: string;
  status: string;
  message?: string;
  createdAt: string;
}

function mapBooking(b: BackendBooking, currentUserId?: string): Booking {
  const tenantName = b.tenant ? `${b.tenant.firstName} ${b.tenant.lastName}` : '';
  const tenantEmail = b.tenant?.email || '';
  const tenantPhone = b.tenant?.phone;
  const agentId = currentUserId || '';
  const agentName = 'Agent';

  const images = b.property?.images ? JSON.parse(b.property.images) : [];
  const imageUrl = images[0]?.url || '';

  return {
    id: b.id,
    propertyId: b.propertyId,
    propertyTitle: b.property?.title || 'Property',
    propertyImage: imageUrl,
    tenantId: b.tenantId,
    tenantName,
    tenantEmail,
    tenantPhone,
    agentId,
    agentName,
    date: new Date(b.date).toISOString().split('T')[0],
    timeSlot: b.timeSlot,
    status: b.status as BookingStatus,
    message: b.message,
    createdAt: b.createdAt,
    updatedAt: b.createdAt,
  };
}

export async function getBookingsByTenant(tenantId: string): Promise<Booking[]> {
  const data = await api.get('/bookings/my');
  return (data as BackendBooking[]).map((b) => mapBooking(b, tenantId));
}

export async function getBookingsByAgent(agentId: string): Promise<Booking[]> {
  const data = await api.get('/bookings/agent');
  return (data as BackendBooking[]).map((b) => mapBooking(b, agentId));
}

export async function requestViewing(request: ViewingRequest): Promise<Booking> {
  const data = await api.post('/bookings', {
    propertyId: request.propertyId,
    date: request.date,
    timeSlot: request.timeSlot,
    message: request.message,
  });
  return mapBooking(data as BackendBooking);
}

export async function updateBookingStatus(bookingId: string, status: BookingStatus): Promise<Booking | null> {
  try {
    const data = await api.post(`/bookings/${bookingId}/status`, { status });
    return mapBooking(data as BackendBooking);
  } catch {
    return null;
  }
}

export const TIME_SLOTS = [
  { value: '09:00 AM', label: '9:00 AM' },
  { value: '10:00 AM', label: '10:00 AM' },
  { value: '11:00 AM', label: '11:00 AM' },
  { value: '12:00 PM', label: '12:00 PM' },
  { value: '01:00 PM', label: '1:00 PM' },
  { value: '02:00 PM', label: '2:00 PM' },
  { value: '03:00 PM', label: '3:00 PM' },
  { value: '04:00 PM', label: '4:00 PM' },
  { value: '05:00 PM', label: '5:00 PM' },
];
