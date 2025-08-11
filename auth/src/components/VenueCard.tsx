import { Link } from "react-router-dom";

export type Venue = {
  id: string;
  name: string;
  sport: string;
  location: string;
  rating: number;
  reviews: number;
  indoor: boolean;
  pricePerHour: number;
  image: string;
  budget?: boolean;
};

interface VenueCardProps {
  venue: Venue;
  detailsHref: string;
}

export default function VenueCard({ venue, detailsHref }: VenueCardProps) {
  const { name, sport, location, rating, reviews, indoor, pricePerHour, image, budget } = venue;

  return (
    <Link to={detailsHref} className="group block">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
        {/* Image */}
        <div className="relative overflow-hidden rounded-t-2xl">
          <img
            src={image}
            alt={name}
            className="h-36 w-full object-cover transition-transform group-hover:scale-105"
          />
          {budget && (
            <div className="absolute left-2 top-2 rounded-full bg-emerald-500 px-2 py-1 text-xs font-medium text-white">
              Budget
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-3 p-3">
          {/* Title & Location */}
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-black">{name}</h3>
            <p className="text-sm text-gray-600">📍 {location}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
              {sport}
            </span>
            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
              {indoor ? "Indoor" : "Outdoor"}
            </span>
            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
              ₹{pricePerHour}/hr
            </span>
          </div>

          {/* Rating & Actions */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <div className="flex text-amber-500">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={i < Math.floor(rating) ? "text-amber-500" : "text-gray-300"}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-600">
                {rating.toFixed(1)} ({reviews})
              </span>
            </div>
            <div className="flex gap-1">
              <div className="h-9 flex-1 rounded-xl bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700">
                View
              </div>
              <div className="h-9 flex-1 rounded-xl bg-black px-3 py-2 text-xs font-medium text-white">
                Book
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
