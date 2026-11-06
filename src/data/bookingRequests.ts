export const bookingRequestStorageKey = "kardofix.booking-requests.v1";

export type BookingRequest = {
  id: string;
  createdAt: string;
  service: string;
  category: string;
  providerId: string;
  providerName: string;
  preferredDate: string;
  preferredTime: string;
  area: string;
  customerName: string;
  phone: string;
  details: string;
};

export function isBookingRequest(value: unknown): value is BookingRequest {
  if (!value || typeof value !== "object") return false;

  const request = value as Record<string, unknown>;
  return (
    typeof request.id === "string" &&
    typeof request.createdAt === "string" &&
    typeof request.service === "string" &&
    typeof request.category === "string" &&
    typeof request.providerId === "string" &&
    typeof request.providerName === "string" &&
    typeof request.preferredDate === "string" &&
    typeof request.preferredTime === "string" &&
    typeof request.area === "string" &&
    typeof request.customerName === "string" &&
    typeof request.phone === "string" &&
    typeof request.details === "string"
  );
}
