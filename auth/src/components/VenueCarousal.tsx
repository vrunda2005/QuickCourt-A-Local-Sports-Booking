// src/components/VenueCarousel.tsx
import { Link } from 'react-router-dom';

type Venue = {
  id: string;
  name: string;
  sport: string;
  location: string;
  rating: number;
  reviews: number;
  indoor: boolean;
  budget: boolean;
  pricePerHour: string;
  image: string;
};

interface VenueCarouselProps {
  venues: Venue[];
}

export default function VenueCarousel({ venues }: VenueCarouselProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {venues.map((venue) => (
        <Link
          key={venue.id}
          to={`/venues/${venue.id}`}
          className="group flex min-w-[280px] flex-col rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
        >
          {/* Image */}
          <div className="relative overflow-hidden rounded-t-2xl">
            <img
              src={venue.image}
              alt={venue.name}
              className="h-32 w-full object-cover transition-transform group-hover:scale-105"
            />
            {venue.budget && (
              <div className="absolute left-2 top-2 rounded-full bg-emerald-500 px-2 py-1 text-xs font-medium text-white">
                Budget
              </div>
            )}
            <div className="absolute right-2 top-2 rounded-lg bg-black/60 px-2 py-1 text-xs font-medium text-white">
              {venue.pricePerHour}/hr
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-2 p-3">
            {/* Title & Location */}
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-black">{venue.name}</h3>
              <p className="text-sm text-gray-600">📍 {venue.location}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                {venue.sport}
              </span>
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                {venue.indoor ? "Indoor" : "Outdoor"}
              </span>
            </div>

            {/* Rating & Action */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={i < Math.floor(venue.rating) ? "text-amber-500" : "text-gray-300"}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-600">
                  {venue.rating.toFixed(1)} ({venue.reviews})
                </span>
              </div>
              <div className="rounded-xl bg-black px-3 py-1.5 text-xs font-medium text-white">
                Book Now
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
