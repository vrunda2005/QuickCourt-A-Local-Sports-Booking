import { useEffect, useMemo, useState, useDeferredValue } from "react";
import VenueCard, { type Venue } from "../components/VenueCard";
import VenueFilters, { type VenueFiltersValue } from "../components/VenueFilters";

/* ---------------------------------------------------------
   Mock data: replace with your API fetch if you have one
   --------------------------------------------------------- */

const SEED: Venue[] = [
  {
    id: "v1",
    name: "SBR Badminton",
    sport: "Badminton",
    location: "Vaishnodevi Cir",
    rating: 4.6,
    reviews: 26,
    indoor: true,
    pricePerHour: 350,
    image:
      "https://images.unsplash.com/photo-1543166145-43227661d0e8?q=80&w=1600&auto=format&fit=crop",
    budget: true,
  },
  {
    id: "v2",
    name: "Skyline Racquet",
    sport: "Tennis",
    location: "Navrangpura",
    rating: 4.7,
    reviews: 61,
    indoor: false,
    pricePerHour: 700,
    image:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "v3",
    name: "Prime Sports Arena",
    sport: "Football",
    location: "Science City",
    rating: 4.5,
    reviews: 39,
    indoor: false,
    pricePerHour: 500,
    image:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1600&auto=format&fit=crop",
    budget: true,
  },
  {
    id: "v4",
    name: "Court House",
    sport: "Basketball",
    location: "Drive-In Rd",
    rating: 4.4,
    reviews: 18,
    indoor: true,
    pricePerHour: 600,
    image:
      "https://images.unsplash.com/photo-1518065890281-ffa4c77c7f5d?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "v5",
    name: "Aqua Dome",
    sport: "Swimming",
    location: "Sabarmati",
    rating: 4.8,
    reviews: 54,
    indoor: true,
    pricePerHour: 450,
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "v6",
    name: "Pitch Perfect",
    sport: "Cricket",
    location: "Thaltej",
    rating: 4.3,
    reviews: 21,
    indoor: false,
    pricePerHour: 550,
    image:
      "https://images.unsplash.com/photo-1521417531039-75e91486eae4?q=80&w=1600&auto=format&fit=crop",
  },
];

// Duplicate a bit so pagination looks real
const VENUES: Venue[] = [
  ...SEED,
  ...SEED.map((v, i) => ({
    ...v,
    id: `dup-${i}-a`,
    name: `${v.name} ${i + 1}`,
    pricePerHour: v.pricePerHour + (i % 4) * 50,
    rating: Math.min(5, v.rating + ((i % 3) * 0.1)),
  })),
  ...SEED.map((v, i) => ({
    ...v,
    id: `dup-${i}-b`,
    name: `${v.name} ${i + 7}`,
  })),
];

/* ---------------------------------------------------------
   Page
   --------------------------------------------------------- */

export default function VenuesPage() {
  // Filters (controlled by VenueFilters)
  const [filters, setFilters] = useState<VenueFiltersValue>({
    search: "",
    sport: "",
    indoor: "",
    maxPrice: 1000,
    minRating: 0,
    sort: "relevance",
  });

  // Debounced search for snappy typing
  const deferredSearch = useDeferredValue(filters.search);

  // Mobile filter sheet
  const [sheetOpen, setSheetOpen] = useState(false);

  // Fake loading to demo skeletons (remove if you fetch)
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 500); // quick shimmer
    return () => clearTimeout(id);
  }, []);

  // Sports list for dropdown
  const sports = useMemo(
    () => Array.from(new Set(VENUES.map((v) => v.sport))),
    []
  );

  // Filtering & sorting
  const results = useMemo(() => {
    let res = VENUES.slice();

    const q = deferredSearch.trim().toLowerCase();
    if (q) {
      res = res.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.location.toLowerCase().includes(q) ||
          v.sport.toLowerCase().includes(q)
      );
    }

    if (filters.sport) res = res.filter((v) => v.sport === filters.sport);
    if (filters.indoor === "indoor") res = res.filter((v) => v.indoor);
    if (filters.indoor === "outdoor") res = res.filter((v) => !v.indoor);
    res = res.filter(
      (v) => v.pricePerHour <= filters.maxPrice && v.rating >= filters.minRating
    );

    switch (filters.sort) {
      case "priceLow":
        res.sort((a, b) => a.pricePerHour - b.pricePerHour);
        break;
      case "priceHigh":
        res.sort((a, b) => b.pricePerHour - a.pricePerHour);
        break;
      case "ratingHigh":
        res.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
        break;
      default:
        // relevance-ish by rating+reviews
        res.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    }

    return res;
  }, [filters.sport, filters.indoor, filters.maxPrice, filters.minRating, filters.sort, deferredSearch]);

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(results.length / pageSize));
  useEffect(() => setPage(1), [filters, deferredSearch]); // reset page when filters change
  const slice = results.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl px-4 sm:px-6">
      {/* Top bar */}
      <div className="sticky top-0 z-10 -mx-4 mb-4 border-b bg-white/80 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-b-2xl sm:border">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-lg font-semibold tracking-[0.08em]">Sports Venues Nearby</div>
            <p className="text-xs text-gray-500">Find, filter and book courts around you.</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                value={filters.search}
                onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
                placeholder="Search venue, sport, area…"
                className="h-9 w-[min(72vw,420px)] rounded-xl border border-gray-300 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-gray-900"
              />
              <span className="absolute left-2 top-1.5">🔎</span>
            </div>

            {/* Sort (desktop) */}
            <select
              value={filters.sort}
              onChange={(e) => setFilters((p) => ({ ...p, sort: e.target.value as VenueFiltersValue["sort"] }))}
              className="hidden rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900 sm:block"
            >
              <option value="relevance">Relevance</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="ratingHigh">Rating: High to Low</option>
            </select>

            {/* Filters button (mobile) */}
            <button
              onClick={() => setSheetOpen(true)}
              className="rounded-xl border px-3 py-1.5 text-sm shadow-sm hover:bg-gray-50 sm:hidden"
            >
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block">
          <VenueFilters
            sports={sports}
            value={filters}
            onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
            onClear={() =>
              setFilters({
                search: "",
                sport: "",
                indoor: "",
                maxPrice: 1000,
                minRating: 0,
                sort: "relevance",
              })
            }
          />
        </aside>

        {/* Results */}
        <section>
          {/* Meta row */}
          <div className="mb-3 hidden items-center justify-between sm:flex">
            <div className="text-sm text-gray-600">{results.length} venues found</div>
            {/* the select above handles sort for desktop; you could keep another here if you prefer */}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading
              ? Array.from({ length: pageSize }).map((_, i) => <SkeletonCard key={i} />)
              : slice.map((v) => (
                  <VenueCard key={v.id} venue={v} detailsHref={`/venues/${v.id}`} />
                ))}
          </div>

          {/* Empty */}
          {!loading && slice.length === 0 && (
            <div className="mt-10 grid place-items-center">
              <div className="w-full max-w-md rounded-2xl border border-dashed p-8 text-center">
                <div className="mb-2 text-3xl">🤔</div>
                <div className="text-sm font-medium">No venues match your filters</div>
                <p className="mt-1 text-xs text-gray-500">
                  Try widening your price range, changing sport, or clearing filters.
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      search: "",
                      sport: "",
                      indoor: "",
                      maxPrice: 1000,
                      minRating: 0,
                      sort: "relevance",
                    })
                  }
                  className="mt-4 rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}

          {/* Pagination */}
          {slice.length > 0 && (
            <div className="mt-5 flex items-center justify-center gap-2">
              <Pager current={page} total={totalPages} onChange={setPage} />
            </div>
          )}
        </section>
      </div>

      {/* Mobile filter sheet */}
      {sheetOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] lg:hidden"
          onClick={() => setSheetOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-0 h-full w-[min(86vw,360px)] overflow-auto rounded-l-2xl bg-white p-4 shadow-xl"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-semibold">Filters</div>
              <button
                onClick={() => setSheetOpen(false)}
                className="rounded-lg border px-2 py-1 text-sm hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            <VenueFilters
              sports={sports}
              value={filters}
              onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
              onClear={() =>
                setFilters({
                  search: "",
                  sport: "",
                  indoor: "",
                  maxPrice: 1000,
                  minRating: 0,
                  sort: "relevance",
                })
              }
              showSearch
            />
          </div>
        </div>
      )}

      <footer className="mt-10 grid place-items-center pb-10 text-xs text-gray-500">
        © {new Date().getFullYear()} QuickCourt
      </footer>
    </div>
  );
}

/* ---------------------------------------------------------
   UI helpers: Skeleton + Pager
   --------------------------------------------------------- */

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="h-36 w-full rounded-t-2xl bg-gray-100" />
      <div className="space-y-3 p-3">
        <div className="h-3 w-1/2 rounded bg-gray-100" />
        <div className="h-2 w-1/3 rounded bg-gray-100" />
        <div className="flex gap-2">
          <div className="h-5 w-14 rounded-full bg-gray-100" />
          <div className="h-5 w-14 rounded-full bg-gray-100" />
          <div className="h-5 w-16 rounded-full bg-gray-100" />
        </div>
        <div className="flex gap-2 pt-1">
          <div className="h-9 flex-1 rounded-xl bg-gray-100" />
          <div className="h-9 flex-1 rounded-xl bg-gray-100" />
        </div>
      </div>
    </div>
  );
}

function Pager({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (n: number) => void;
}) {
  // Compact pager: first/prev … numbers … next/last
  const go = (n: number) => onChange(Math.min(total, Math.max(1, n)));

  const nums = (() => {
    const arr: number[] = [];
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    for (let i = start; i <= end; i++) arr.push(i);
    if (start > 1) arr.unshift(1);
    if (start > 2) arr.splice(1, 0, -1);
    if (end < total - 1) arr.push(-1);
    if (end < total) arr.push(total);
    return arr;
  })();

  return (
    <div className="inline-flex items-center gap-1 rounded-xl border bg-white p-1 shadow-sm">
      <button
        onClick={() => go(current - 1)}
        disabled={current === 1}
        className="rounded-lg px-2 py-1 text-sm disabled:opacity-40"
      >
        ‹
      </button>
      {nums.map((n, i) =>
        n === -1 ? (
          <span key={`dots-${i}`} className="px-2 text-sm text-gray-400">
            …
          </span>
        ) : (
          <button
            key={n}
            onClick={() => go(n)}
            className={`rounded-lg px-2 py-1 text-sm ${
              n === current ? "bg-black text-white" : "hover:bg-gray-50"
            }`}
          >
            {n}
          </button>
        )
      )}
      <button
        onClick={() => go(current + 1)}
        disabled={current === total}
        className="rounded-lg px-2 py-1 text-sm disabled:opacity-40"
      >
        ›
      </button>
    </div>
  );
}
