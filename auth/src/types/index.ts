export type Role = "User" | "FacilityOwner" | "Admin";

export type Facility = {
  _id: string;
  name: string;
  location: string;
  description?: string;
  sports?: string[];        // ["Badminton","Tennis"]
  amenities?: string[];     // ["Parking","Showers"]
  imageUrls?: string[];     // cloudinary urls
  status?: "pending" | "approved" | "rejected";
};

export type Court = {
  _id?: string;
  facility: string;
  name: string;
  sportType: string;
  pricePerHour: number;
  operatingHours: string;
  images?: string[];
  active?: boolean;
};

export type Booking = {
  _id: string;
  facility: Facility | string;
  court?: Court | string;
  user?: any;
  date: string; // "YYYY-MM-DD"
  timeSlot: string; // "10:00-11:00"
  status?: string;
};
