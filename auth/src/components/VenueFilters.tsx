// Reusable, controlled filter panel for the Venues page.
// Import with:
// import VenueFilters, { type VenueFiltersValue } from "@/components/VenueFilters";

export type VenueFiltersValue = {
  search: string;
  sport: string;
  indoor: string;
  maxPrice: number;
  minRating: number;
  sort: "relevance" | "priceLow" | "priceHigh" | "ratingHigh";
};

interface VenueFiltersProps {
  sports: string[];
  value: VenueFiltersValue;
  onChange: (patch: Partial<VenueFiltersValue>) => void;
  onClear: () => void;
  showSearch?: boolean;
}

export default function VenueFilters({ sports, value, onChange, onClear, showSearch = false }: VenueFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search (optional) */}
      {showSearch && (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Search</label>
          <input
            type="text"
            value={value.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Venue, sport, area…"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
      )}

      {/* Sport */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Sport</label>
        <select
          value={value.sport}
          onChange={(e) => onChange({ sport: e.target.value })}
          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="">All Sports</option>
          {sports.map((sport) => (
            <option key={sport} value={sport}>
              {sport}
            </option>
          ))}
        </select>
      </div>

      {/* Indoor/Outdoor */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Type</label>
        <select
          value={value.indoor}
          onChange={(e) => onChange({ indoor: e.target.value })}
          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="">All Types</option>
          <option value="indoor">Indoor Only</option>
          <option value="outdoor">Outdoor Only</option>
        </select>
      </div>

      {/* Max Price */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Max Price: ₹{value.maxPrice}/hr
        </label>
        <input
          type="range"
          min="100"
          max="2000"
          step="50"
          value={value.maxPrice}
          onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
          className="w-full"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>₹100</span>
          <span>₹2000</span>
        </div>
      </div>

      {/* Min Rating */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Min Rating: {value.minRating}+
        </label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={value.minRating}
          onChange={(e) => onChange({ minRating: Number(e.target.value) })}
          className="w-full"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>0+</span>
          <span>5+</span>
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Sort By</label>
        <select
          value={value.sort}
          onChange={(e) => onChange({ sort: e.target.value as VenueFiltersValue["sort"] })}
          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="relevance">Relevance</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="ratingHigh">Rating: High to Low</option>
        </select>
      </div>

      {/* Clear Filters */}
      <button
        onClick={onClear}
        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
      >
        Clear All Filters
      </button>
    </div>
  );
}
