// src/pages/BookCourtPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import axios from 'axios';

/* ------------------------- Types ------------------------- */
type PricingRow = { start: string; end: string; price: number };
type Pricing = { day: "Mon–Fri" | "Sat–Sun"; rows: PricingRow[] };

interface BackendCourt {
  _id: string;
  name: string;
  sportType: string;
  pricePerHour: number;
  operatingHours: string;
  amenities?: string;
  images?: string[];
  facility: string;
}

interface BackendFacility {
  _id: string;
  name: string;
  location: string;
  description?: string;
  sports?: string;
  amenities?: string;
  imageUrl?: string;
  status: string;
}

type SportBlock = {
  code: string;         // "badminton"
  name: string;         // "Badminton"
  courts: BackendCourt[];     // Real court data from backend
  indoor: boolean;
  surface?: string;
  pricePerHour: number; // used for live total
  pricing?: Pricing[];  // (optional) detail modal if you want
};

type VenueLite = {
  id: string;
  name: string;
  location: string;
  rating: number;
  sports: SportBlock[];
};

type Booking = { court: string; startISO: string; endISO: string };

/* ------------------------- Real API calls ------------------------- */
async function fetchVenueLite(id: string): Promise<VenueLite> {
  try {
    // Fetch facility details
    const facilityRes = await axios.get(`http://localhost:5000/api/facilities/${id}`);
    const facility: BackendFacility = facilityRes.data.data;
    
    if (!facility) {
      throw new Error('Facility not found');
    }

    // Fetch courts for this facility
    const courtsRes = await axios.get(`http://localhost:5000/api/courts?facility=${id}`);
    const courts: BackendCourt[] = courtsRes.data.data || [];

    // Group courts by sport type
    const courtsBySport = courts.reduce((acc, court) => {
      if (!acc[court.sportType]) {
        acc[court.sportType] = [];
      }
      acc[court.sportType].push(court);
      return acc;
    }, {} as Record<string, BackendCourt[]>);

    // Create sport blocks
    const sports: SportBlock[] = Object.entries(courtsBySport).map(([sportType, sportCourts]) => ({
      code: sportType.toLowerCase(),
      name: sportType,
      courts: sportCourts,
      indoor: true, // Default to indoor
      surface: "Professional", // Default surface
      pricePerHour: sportCourts[0]?.pricePerHour || 500,
      pricing: [
        {
          day: "Mon–Fri",
          rows: [
            { start: "06:00 AM", end: "10:00 PM", price: sportCourts[0]?.pricePerHour || 500 },
          ],
        },
        {
          day: "Sat–Sun",
          rows: [
            { start: "06:00 AM", end: "10:00 PM", price: (sportCourts[0]?.pricePerHour || 500) + 100 },
          ],
        },
      ],
    }));

    // If no courts exist, create a default sport block
    if (sports.length === 0) {
      sports.push({
        code: "general",
        name: "General",
        courts: [],
        indoor: true,
        surface: "Professional",
        pricePerHour: 500,
        pricing: [
          {
            day: "Mon–Fri",
            rows: [{ start: "06:00 AM", end: "10:00 PM", price: 500 }],
          },
          {
            day: "Sat–Sun",
            rows: [{ start: "06:00 AM", end: "10:00 PM", price: 600 }],
          },
        ],
      });
    }
    
    return {
      id: facility._id,
      name: facility.name,
      location: facility.location,
      rating: 4.5, // Default rating
      sports,
    };
  } catch (error) {
    console.error('Failed to fetch venue:', error);
    throw error;
  }
}

// Existing bookings for the selected date (mock for now)
async function fetchBookingsForDate(venueId: string, dateISO: string): Promise<Booking[]> {
  try {
    // TODO: Implement real booking API call
    // const res = await axios.get(`http://localhost:5000/api/bookings?facility=${venueId}&date=${dateISO}`);
    // return res.data.data || [];
    
    // Mock data for now
    await new Promise((r) => setTimeout(r, 200));
    const d = dateISO.slice(0, 10);
    return [
      {
        court: "Court 1",
        startISO: `${d}T13:00:00.000Z`,
        endISO: `${d}T14:00:00.000Z`,
      },
      {
        court: "Court A",
        startISO: `${d}T15:00:00.000Z`,
        endISO: `${d}T17:00:00.000Z`,
      },
    ];
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return [];
  }
}

/* ------------------------- Helpers ------------------------- */
const INR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const toLocalISO = (d: Date) => {
  // keep only local date/time → ISO without timezone shift
  const pad = (x: number) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}:00`;
};

const todayLocalDateInput = () => {
  const d = new Date();
  const pad = (x: number) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// return half-hour slots (e.g., 05:00 → 22:00)
function buildSlots(): string[] {
  const slots: string[] = [];
  for (let h = 5; h <= 22; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    if (h < 22) slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}
const SLOTS = buildSlots();

// overlap check
function overlaps(startA: Date, endA: Date, startB: Date, endB: Date) {
  return startA < endB && startB < endA;
}

/* ------------------------- Page ------------------------- */
export default function BookCourtPage() {
  const { id = "" } = useParams();
  const nav = useNavigate();

  const [venue, setVenue] = useState<VenueLite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sportCode, setSportCode] = useState<string>("");
  const [date, setDate] = useState<string>(todayLocalDateInput());
  const [durationHrs, setDurationHrs] = useState<number>(2);
  const [court, setCourt] = useState<string>("");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [startTime, setStartTime] = useState<string>("");

  /* Load venue */
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    
    fetchVenueLite(id).then((v) => {
      if (!alive) return;
      setVenue(v);
      const first = v.sports[0];
      if (first) {
        setSportCode(first.code);
        if (first.courts.length > 0) {
          setCourt(first.courts[0].name);
        }
      }
      setLoading(false);
    }).catch((err) => {
      if (!alive) return;
      setError(err.message || 'Failed to load venue');
      setLoading(false);
    });
    
    return () => {
      alive = false;
    };
  }, [id]);

  /* Load bookings when date/sport/court changes */
  useEffect(() => {
    if (!venue) return;
    let alive = true;
    fetchBookingsForDate(venue.id, date).then((b) => {
      if (!alive) return;
      setBookings(b);
    });
    return () => {
      alive = false;
    };
  }, [venue, date]);

  const sport = useMemo(
    () => venue?.sports.find((s) => s.code === sportCode) ?? null,
    [venue, sportCode]
  );

  // reselect default court when sport changes
  useEffect(() => {
    if (!sport) return;
    if (sport.courts.length > 0 && !sport.courts.find(c => c.name === court)) {
      setCourt(sport.courts[0].name);
    }
    setStartTime(""); // reset after sport change
  }, [sportCode, sport, court]);

  // disabled logic for each slot
  const disabledSlots = useMemo(() => {
    const map = new Map<string, boolean>();

    const now = new Date();
    const isToday = date === todayLocalDateInput();

    const slotToDate = (hhmm: string) => {
      const [h, m] = hhmm.split(":").map(Number);
      const d = new Date(date + "T00:00:00");
      d.setHours(h, m, 0, 0);
      return d;
    };

    for (const hhmm of SLOTS) {
      const start = slotToDate(hhmm);
      const end = new Date(start);
      end.setHours(end.getHours() + durationHrs);

      // 1) future rule for today
      if (isToday && start <= now) {
        map.set(hhmm, true);
        continue;
      }
      // 2) overlap with existing bookings for selected court
      const clashing = bookings.some((b) => {
        if (court && b.court !== court) return false;
        const bStart = new Date(b.startISO);
        const bEnd = new Date(b.endISO);
        return overlaps(start, end, bStart, bEnd);
      });

      map.set(hhmm, clashing);
    }
    return map;
  }, [bookings, date, durationHrs, court]);

  const price = (sport?.pricePerHour ?? 0) * durationHrs;

  const canContinue = Boolean(sport && date && startTime && court);

  /* Handle submit (go to mock payment) */
  const handleContinue = () => {
    if (!venue || !sport || !canContinue) return;

    const startLocalISO = toLocalISO(new Date(`${date}T${startTime}:00`));
    const end = new Date(`${date}T${startTime}:00`);
    end.setHours(end.getHours() + durationHrs);
    const endLocalISO = toLocalISO(end);

    // here you'd call your API to create a pending booking / payment session
    console.log("BOOK", {
      venueId: venue.id,
      sport: sport.name,
      court,
      durationHrs,
      startLocalISO,
      endLocalISO,
      price,
    });

    // Navigate to your checkout screen or success page
    nav("/dashboard"); // replace with /checkout if you build it
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-4 h-6 w-48 animate-pulse rounded bg-gray-100" />
        <div className="rounded-2xl border p-5">
          <div className="h-60 animate-pulse rounded-2xl bg-gray-100" />
        </div>
      </div>
    );
  }

  if (error || !venue || !sport) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-2xl border p-8 text-center">
          <div className="mb-2 text-3xl">❌</div>
          <div className="text-lg font-medium">Failed to load venue</div>
          <p className="mt-1 text-gray-500">{error || 'Venue not found'}</p>
          <button
            onClick={() => nav('/venues')}
            className="mt-4 rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Back to Venues
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-3">
        <div className="text-2xl font-semibold">Court Booking</div>
      </div>

      <div className="rounded-2xl border p-5">
        <div className="mb-4">
          <div className="text-lg font-semibold">{venue.name}</div>
          <div className="text-xs text-gray-600">
            📍 {venue.location} · ⭐ {venue.rating.toFixed(1)}
          </div>
        </div>

        {/* Form rows */}
        <div className="grid gap-5 md:grid-cols-[160px_1fr]">
          {/* Labels */}
          <div className="space-y-6 text-sm font-medium text-gray-700">
            <div>Sport</div>
            <div>Date</div>
            <div>Start Time</div>
            <div>Duration</div>
            <div>Court</div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Sport */}
            <div>
              <select
                value={sportCode}
                onChange={(e) => setSportCode(e.target.value)}
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900"
              >
                {venue.sports.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </select>
              <div className="mt-1 text-xs text-gray-500">
                {sport.surface ? `${sport.surface} · ` : ""}{sport.indoor ? "Indoor" : "Outdoor"}
              </div>
            </div>

            {/* Date */}
            <div>
              <input
                type="date"
                value={date}
                min={todayLocalDateInput()}
                onChange={(e) => {
                  setDate(e.target.value);
                  setStartTime(""); // reset when date changes
                }}
                className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900"
              />
              <div className="mt-1 text-xs text-gray-500">Must be today or later.</div>
            </div>

            {/* Start time – list of slots with disabled states */}
            <div>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
                {SLOTS.map((t) => {
                  const disabled = disabledSlots.get(t) ?? false;
                  const active = startTime === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      disabled={disabled}
                      onClick={() => setStartTime(t)}
                      className={`h-9 rounded-xl border text-xs ${
                        active ? "border-black bg-black text-white" : "hover:bg-gray-50"
                      } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
              <div className="mt-1 text-xs text-gray-500">
                Past times and clashing slots are disabled automatically.
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDurationHrs((h) => Math.max(1, h - 1))}
                className="grid h-9 w-9 place-items-center rounded-full border text-lg hover:bg-gray-50"
              >
                –
              </button>
              <div className="text-sm font-medium">{durationHrs} Hr</div>
              <button
                type="button"
                onClick={() => setDurationHrs((h) => Math.min(4, h + 1))}
                className="grid h-9 w-9 place-items-center rounded-full border text-lg hover:bg-gray-50"
              >
                +
              </button>
              <div className="ml-2 text-xs text-gray-500">(1–4 hours)</div>
            </div>

            {/* Court */}
            <div>
              <select
                value={court}
                onChange={(e) => {
                  setCourt(e.target.value);
                  setStartTime(""); // recalc disabled
                }}
                className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900"
              >
                {sport.courts.length > 0 ? (
                  sport.courts.map((c) => (
                    <option key={c._id} value={c.name}>
                      {c.name} - ₹{c.pricePerHour}/hr
                    </option>
                  ))
                ) : (
                  <option value="">No courts available</option>
                )}
              </select>
              <div className="mt-2 flex flex-wrap gap-1">
                {sport.courts.length > 0 ? (
                  sport.courts.map((c) => (
                    <span
                      key={c._id}
                      className={`rounded-full border px-2 py-0.5 text-[11px] ${
                        c.name === court ? "border-black" : "text-gray-600"
                      }`}
                    >
                      {c.name} (₹{c.pricePerHour}/hr)
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-500">No courts configured for this sport</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6">
          <SignedIn>
            <button
              disabled={!canContinue}
              onClick={handleContinue}
              className={`w-full rounded-xl px-4 py-3 text-sm font-medium shadow-sm transition ${
                canContinue ? "bg-emerald-600 text-white hover:opacity-90" : "cursor-not-allowed bg-gray-200 text-gray-500"
              }`}
            >
              Continue to Payment – {INR(price)}
            </button>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal" forceRedirectUrl={`/venues/${id}/book`}>
              <button className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white hover:opacity-90">
                Sign in to Book – {INR(price)}
              </button>
            </SignInButton>
          </SignedOut>
        </div>

        {/* Footnote */}
        <p className="mt-2 text-center text-xs text-gray-500">
          Pricing is indicative; final amount may vary by venue policies.
        </p>
      </div>
    </div>
  );
}
