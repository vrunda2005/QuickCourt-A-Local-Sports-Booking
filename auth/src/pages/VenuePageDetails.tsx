import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

/* ----------------------------------------------------------
   Types
   ---------------------------------------------------------- */

type Pricing = {
  day: "Mon–Fri" | "Sat–Sun";
  rows: Array<{ start: string; end: string; price: number }>;
};

type SportBlock = {
  code: string;           // "badminton"
  name: string;           // "Badminton"
  courts: string[];       // e.g., ["Court 1","Court 2"]
  surface?: string;       // "Wooden / Synthetic"
  indoor: boolean;
  pricing: Pricing[];
};

type Review = {
  id: string;
  user: string;
  rating: number;
  date: string;           // display string
  text: string;
};

type VenueDetail = {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewsCount: number;
  images: string[];
  amenities: string[];
  about?: string[];
  address: string;
  hours: { open: string; close: string; note?: string };
  sports: SportBlock[];
};

/* ----------------------------------------------------------
   Mock fetch (replace with your API call)
   ---------------------------------------------------------- */

async function fetchVenueById(id: string): Promise<VenueDetail | null> {
  // Simulate latency
  await new Promise((r) => setTimeout(r, 400));

  // Replace this with real API response
  if (!id) return null;
  return {
    id,
    name: "SBR Badminton",
    location: "Satellite, Jodhpur Village",
    rating: 4.5,
    reviewsCount: 68,
    images: [
      "https://images.unsplash.com/photo-1543166145-43227661d0e8?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584275141642-4640d23d8c0d?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521417531039-75e91486eae4?q=80&w=1600&auto=format&fit=crop",
    ],
    amenities: [
      "Parking",
      "Locker Room",
      "Washroom",
      "Drinking Water",
      "CCTV Surveillance",
      "First Aid",
    ],
    about: [
      "Premium wooden & synthetic flooring courts.",
      "Non-marking shoes mandatory.",
      "Coaching available on prior request.",
    ],
    address:
      "Plot 23, Rajyog Road, Near XYZ Mall, Satellite, Ahmedabad 380015",
    hours: { open: "7:00 AM", close: "11:00 PM", note: "Open all days" },
    sports: [
      {
        code: "badminton",
        name: "Badminton",
        courts: ["Court 1", "Court 2", "Court 3"],
        surface: "Wooden / Synthetic",
        indoor: true,
        pricing: [
          {
            day: "Mon–Fri",
            rows: [
              { start: "05:00 AM", end: "07:00 AM", price: 500 },
              { start: "07:00 PM", end: "10:00 PM", price: 600 },
            ],
          },
          {
            day: "Sat–Sun",
            rows: [
              { start: "05:00 AM", end: "10:00 PM", price: 650 },
            ],
          },
        ],
      },
      {
        code: "tennis",
        name: "Tennis",
        courts: ["Court A", "Court B"],
        indoor: false,
        surface: "Synthetic",
        pricing: [
          {
            day: "Mon–Fri",
            rows: [
              { start: "06:00 AM", end: "09:00 AM", price: 700 },
              { start: "06:00 PM", end: "10:00 PM", price: 800 },
            ],
          },
          {
            day: "Sat–Sun",
            rows: [{ start: "06:00 AM", end: "10:00 PM", price: 900 }],
          },
        ],
      },
    ],
  };
}

/* ----------------------------------------------------------
   Page
   ---------------------------------------------------------- */

export default function VenueDetailsPage() {
  const { id = "" } = useParams();
  const nav = useNavigate();

  const [venue, setVenue] = useState<VenueDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSport, setActiveSport] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showPricing, setShowPricing] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchVenueById(id).then((data) => {
      if (!alive) return;
      setVenue(data);
      setActiveSport(data?.sports?.[0]?.code ?? null);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [id]);

  const sport = useMemo(
    () => venue?.sports.find((s) => s.code === activeSport) || null,
    [venue, activeSport]
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-4 h-6 w-56 animate-pulse rounded bg-gray-100" />
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="h-80 animate-pulse rounded-2xl bg-gray-100" />
          <div className="space-y-3">
            <div className="h-20 animate-pulse rounded-2xl bg-gray-100" />
            <div className="h-44 animate-pulse rounded-2xl bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="mx-auto grid min-h-[50vh] max-w-3xl place-items-center px-4 text-center">
        <div>
          <div className="mb-2 text-3xl">🤷</div>
          <div className="text-sm font-medium">Venue not found</div>
          <p className="mt-1 text-xs text-gray-500">
            The venue you’re looking for doesn’t exist or was removed.
          </p>
          <Link to="/venues" className="mt-4 inline-block rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">
            Back to venues
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Header */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">{venue.name}</h1>
          <div className="mt-0.5 text-xs text-gray-600">
            📍 {venue.location} · <Stars rating={venue.rating} /> ({venue.reviewsCount})
          </div>
        </div>

        {/* Book CTA */}
        <div className="flex items-center gap-2">
          <SignedIn>
            <button
              onClick={() => nav(`/venues/${venue.id}/book`)}
              className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Book This Venue
            </button>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal" forceRedirectUrl={`/venues/${venue.id}/book`}>
              <button className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90">
                Book This Venue
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Left: Gallery + Sports + Amenities + About + Reviews */}
        <main>
          {/* Gallery */}
          <section className="rounded-2xl border p-3">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-12 overflow-hidden rounded-xl md:col-span-9">
           
                <img
                  src={venue.images[activeImage]}
                  className="h-[280px] w-full rounded-xl object-cover md:h-[360px]"
                />
              </div>
              <div className="col-span-12 grid grid-cols-5 gap-2 md:col-span-3 md:grid-cols-1">
                {venue.images.map((src, i) => (
            
                  <img
                    key={src}
                    src={src}
                    onClick={() => setActiveImage(i)}
                    className={`h-14 w-full cursor-pointer rounded-lg object-cover md:h-20 ${
                      i === activeImage ? "ring-2 ring-black" : "opacity-80 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Sports Available */}
          <section className="mt-6 rounded-2xl border p-3">
            <div className="mb-2 text-sm font-semibold">Sports Available</div>
            <div className="flex flex-wrap gap-2">
              {venue.sports.map((s) => (
                <button
                  key={s.code}
                  onClick={() => setActiveSport(s.code)}
                  className={`rounded-xl border px-3 py-1.5 text-sm ${
                    activeSport === s.code ? "bg-black text-white" : "hover:bg-gray-50"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>

            {sport && (
              <div className="mt-3 rounded-xl border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm">
                    <span className="font-medium">{sport.name}</span>{" "}
                    {sport.surface && <span className="text-gray-600">· {sport.surface}</span>} ·{" "}
                    {sport.indoor ? "Indoor" : "Outdoor"} · {sport.courts.length} courts
                  </div>
                  <button
                    onClick={() => setShowPricing(true)}
                    className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50"
                  >
                    View Pricing
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Amenities */}
          <section className="mt-6 rounded-2xl border p-3">
            <div className="mb-2 text-sm font-semibold">Amenities</div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {venue.amenities.map((a) => (
                <div key={a} className="flex items-center gap-2 text-sm">
                  <span className="text-emerald-600">●</span>
                  {a}
                </div>
              ))}
            </div>
          </section>

          {/* About */}
          {venue.about && venue.about.length > 0 && (
            <section className="mt-6 rounded-2xl border p-3">
              <div className="mb-2 text-sm font-semibold">About Venue</div>
              <ul className="space-y-1 text-sm text-gray-700">
                {venue.about.map((line, i) => (
                  <li key={i}>— {line}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Reviews (sample static for now) */}
          <section className="mt-6 rounded-2xl border p-3">
            <div className="mb-2 text-sm font-semibold">Player Reviews & Ratings</div>
            <div className="space-y-3">
              {SAMPLE_REVIEWS.map((r) => (
                <div key={r.id} className="rounded-xl border p-3">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="font-medium text-gray-800">{r.user}</div>
                    <div>{r.date}</div>
                  </div>
                  <div className="mt-1 text-amber-500">{StarsInline(r.rating)}</div>
                  <p className="mt-1 text-sm text-gray-700">{r.text}</p>
                </div>
              ))}
              <button className="w-full rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">
                Load more reviews
              </button>
            </div>
          </section>
        </main>

        {/* Right: Info cards (sticky) */}
        <aside className="space-y-3 lg:sticky lg:top-6">
          <div className="rounded-2xl border p-3">
            <div className="text-sm font-semibold">Operating Hours</div>
            <div className="mt-1 text-sm text-gray-700">
              {venue.hours.open} – {venue.hours.close}
            </div>
            {venue.hours.note && <div className="text-xs text-gray-500">{venue.hours.note}</div>}
          </div>

          <div className="rounded-2xl border p-3">
            <div className="text-sm font-semibold">Address</div>
            <div className="mt-1 text-sm text-gray-700">{venue.address}</div>
          </div>

          <div className="rounded-2xl border p-3">
            <div className="mb-2 text-sm font-semibold">Location Map</div>
            <div className="grid h-44 place-items-center rounded-xl border bg-gray-50 text-xs text-gray-500">
              Map placeholder
            </div>
          </div>
        </aside>
      </div>

      {/* Pricing modal */}
      {showPricing && sport && (
        <div className="fixed inset-0 z-50 bg-black/40 p-4 backdrop-blur-sm" onClick={() => setShowPricing(false)}>
          <div
            className="mx-auto max-w-md rounded-2xl bg-white p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-semibold">{sport.name} — Pricing</div>
              <button
                onClick={() => setShowPricing(false)}
                className="rounded-lg border px-2 py-1 text-sm hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              {sport.pricing.map((p) => (
                <div key={p.day} className="rounded-xl border p-3">
                  <div className="mb-2 text-xs font-medium text-gray-600">{p.day}</div>
                  <table className="w-full text-sm">
                    <tbody>
                      {p.rows.map((r, i) => (
                        <tr key={i} className="border-t first:border-0">
                          <td className="py-1">{r.start} – {r.end}</td>
                          <td className="py-1 text-right font-medium">₹ {r.price}/hr</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>

            <div className="mt-3 text-right">
              <SignedIn>
                <button
                  onClick={() => {
                    setShowPricing(false);
                    nav(`/venues/${venue.id}/book`);
                  }}
                  className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  Book a Court
                </button>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal" forceRedirectUrl={`/venues/${venue.id}/book`}>
                  <button className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90">
                    Book a Court
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------
   Small UI helpers
   ---------------------------------------------------------- */

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="select-none text-amber-500">
      {"★".repeat(full)} <span className="text-gray-300">{"★".repeat(5 - full)}</span>
    </span>
  );
}
function StarsInline(rating: number) {
  const full = Math.round(rating);
  return (
    <>
      {"★".repeat(full)}
      <span className="text-gray-300">{"★".repeat(5 - full)}</span>
    </>
  );
}

/* Example static reviews — replace with API */
const SAMPLE_REVIEWS: Review[] = [
  {
    id: "r1",
    user: "Kishan A.",
    rating: 5,
    date: "21 June 2025, 5:18 PM",
    text: "Nice court, well maintained.",
  },
  {
    id: "r2",
    user: "Nirali P.",
    rating: 4,
    date: "12 May 2025, 6:04 PM",
    text: "Good lighting and helpful staff.",
  },
  {
    id: "r3",
    user: "Amit S.",
    rating: 5,
    date: "10 Apr 2025, 7:20 AM",
    text: "Great experience. Will book again!",
  },
];
