export function calculateEarnings(bookings: Array<{ pricePerHour?: number }>): number {
  return bookings.reduce((sum, b) => sum + (b.pricePerHour || 0), 0);
}



