import React from 'react';
import { Link } from 'react-router-dom';

interface Venue {
    id: string;
    name: string;
    location: string;
    rating: number;
    reviewsCount: number;
    imageUrl?: string;
    sports: string[];
    priceRange: string;
}

interface VenueCardProps {
    venue: Venue;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Image */}
            <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                {venue.imageUrl ? (
                    <img
                        src={venue.imageUrl}
                        alt={venue.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="text-white text-4xl">🏟️</div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{venue.name}</h3>
                <p className="text-sm text-gray-600 mb-2">📍 {venue.location}</p>

                {/* Rating */}
                <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                            <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(venue.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                        {venue.rating} ({venue.reviewsCount} reviews)
                    </span>
                </div>

                {/* Sports */}
                <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                        {venue.sports.slice(0, 3).map((sport) => (
                            <span
                                key={sport}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                                {sport}
                            </span>
                        ))}
                        {venue.sports.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{venue.sports.length - 3} more
                            </span>
                        )}
                    </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">Starting from</span>
                    <span className="text-lg font-semibold text-green-600">{venue.priceRange}</span>
                </div>

                {/* Action Button */}
                <Link
                    to={`/venues/${venue.id}`}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-700 transition-colors"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default VenueCard;
