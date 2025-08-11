// src/pages/HomePage.tsx
import { useMemo, useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

import VenueCarousel from "../components/VenueCarousal";
import PopularSportsRail from "../components/PopularSportsRail";
import SportsCarousel from "../components/SportsCarousel";

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

const VENUES: Venue[] = [
  {
    id: "v1",
    name: "SBR Badminton",
    sport: "Badminton",
    location: "Vaishnodevi Cir",
    rating: 4.6,
    reviews: 26,
    indoor: true,
    budget: true,
    pricePerHour: "$8",
    image:
      "https://images.unsplash.com/photo-1543166145-43227661d0e8?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "v2",
    name: "Skyline Racquet",
    sport: "Tennis",
    location: "Navrangpura",
    rating: 4.7,
    reviews: 61,
    indoor: false,
    budget: false,
    pricePerHour: "$14",
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
    budget: true,
    pricePerHour: "$10",
    image:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "v4",
    name: "Court House",
    sport: "Basketball",
    location: "Drive-In Rd",
    rating: 4.4,
    reviews: 18,
    indoor: true,
    budget: false,
    pricePerHour: "$12",
    image:
      "https://images.unsplash.com/photo-1518065890281-ffa4c77c7f5d?q=80&w=1600&auto=format&fit=crop",
  },
];

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517646287270-4f3f0c2a1b32?q=80&w=1600&auto=format&fit=crop",
];

export default function HomePage() {
  const { user } = useUser();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return VENUES;
    const q = query.toLowerCase();
    return VENUES.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q) ||
        v.sport.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl px-4 sm:px-6">
      {/* Header (Clerk-aware) */}
      <header className="flex items-center justify-between py-4">
        <div className="text-lg font-semibold tracking-[0.08em]">QUICKCOURT</div>

        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal" forceRedirectUrl="/dashboard" fallbackRedirectUrl="/dashboard">
              <button className="rounded-xl px-3 py-1 text-sm hover:bg-black/5">Login</button>
            </SignInButton>

            <SignUpButton mode="modal" forceRedirectUrl="/verify-otp" fallbackRedirectUrl="/verify-otp">
              <button className="rounded-xl bg-black px-3 py-1 text-sm font-medium text-white hover:opacity-90">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <span className="hidden text-sm text-gray-600 sm:block">
              Welcome{user?.firstName ? `, ${user.firstName}` : ""}!
            </span>
            <UserButton afterSignOutUrl="/signin" />
          </SignedIn>
        </div>
      </header>

      {/* Hero */}
      <section className="grid gap-6 lg:grid-cols-[1fr_520px] lg:gap-8">
        {/* Left: search + copy */}
        <div className="rounded-3xl border border-gray-200 bg-white/90 p-5 shadow sm:p-6">
          <div className="text-sm text-gray-500">Location</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gray-100">📍</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ahmedabad"
              className="h-9 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div className="mt-6">
            <h1 className="text-xl font-semibold sm:text-2xl">FIND PLAYERS & VENUES NEARBY</h1>
            <p className="mt-2 max-w-prose text-sm text-gray-600">
              Seamlessly explore sports venues and play with sports enthusiasts just like you!
            </p>
          </div>
        </div>

        {/* Right: rotating sports imagery (hidden on small screens) */}
        <div className="hidden overflow-hidden rounded-3xl border border-gray-200 bg-white/80 shadow lg:block">
          <SportsCarousel images={HERO_IMAGES} intervalMs={4200} />
        </div>
      </section>

      {/* Book Venues */}
      <section className="mt-8 sm:mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">Book Venues</h2>
        </div>
        <VenueCarousel venues={filtered} />
      </section>

      {/* Popular Sports */}
      <section className="mt-10 sm:mt-12">
        <h2 className="mb-3 text-base font-semibold">Popular Sports</h2>
        <PopularSportsRail />
      </section>

      <footer className="mt-14 grid place-items-center pb-10 text-xs text-gray-500">
        © {new Date().getFullYear()} QuickCourt
      </footer>
    </div>
  );
}
