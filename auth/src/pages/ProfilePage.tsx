import { useRef, useState } from "react";
import { useUser } from "@clerk/clerk-react";

type Booking = {
  id: string;
  venue: string;
  sport: string;
  court: string;
  date: string; // ISO or pretty
  time: string; // "6:00–7:00 PM"
  status: "Confirmed" | "Cancelled" | "Completed" | "Pending";
};

const MOCK_BOOKINGS: Booking[] = [
  {
    id: "BKG-10421",
    venue: "Skyline Racquet Club",
    sport: "Tennis",
    court: "Court 2",
    date: "2025-08-14",
    time: "6:00 – 7:00 PM",
    status: "Confirmed",
  },
  {
    id: "BKG-10387",
    venue: "Prime Sports Arena",
    sport: "Badminton",
    court: "Court 5",
    date: "2025-08-10",
    time: "8:00 – 9:00 AM",
    status: "Completed",
  },
  {
    id: "BKG-10325",
    venue: "Green Park",
    sport: "Futsal",
    court: "Pitch A",
    date: "2025-08-07",
    time: "7:30 – 8:30 PM",
    status: "Cancelled",
  },
];

function Badge({ status }: { status: Booking["status"] }) {
  const map: Record<Booking["status"], string> = {
    Confirmed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    Completed: "bg-gray-100 text-gray-700 ring-1 ring-gray-200",
    Cancelled: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    Pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${map[status]}`}>
      {status}
    </span>
  );
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [tab, setTab] = useState<"bookings" | "edit">("bookings");

  // editable fields
  const initialName = `${user?.firstName ?? ""}`.trim();
  const [fullName, setFullName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // password form
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onPickAvatar = async (file: File) => {
    if (!user) return;
    if (file.size > 1024 * 1024) {
      setErr("Image too large. Please upload an image under 1 MB.");
      return;
    }
    setErr(null);
    setMsg(null);
    try {
      await user.setProfileImage({ file });
      setMsg("Profile picture updated.");
    } catch {
      setErr("Could not update profile picture. Please try again.");
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setErr(null);
    setMsg(null);
    try {
      // Split full name very simply; adjust if you add separate first/last fields
      const firstName = fullName.trim();
      await user.update({ firstName });
      setMsg("Profile saved.");
    } catch {
      setErr("Could not save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (!user || !oldPw || !newPw) return;
    setSaving(true);
    setErr(null);
    setMsg(null);
    try {
      // Clerk's TS types vary by version; this keeps TS happy while calling the method if present.
      const maybe = user as unknown as {
        updatePassword?: (args: { currentPassword: string; newPassword: string }) => Promise<void>;
      };
      if (maybe.updatePassword) {
        await maybe.updatePassword({ currentPassword: oldPw, newPassword: newPw });
        setMsg("Password updated.");
        setOldPw("");
        setNewPw("");
      } else {
        // Fallback UX if the SDK doesn't expose the method in your version.
        setErr("Password update is not available in this build. Please use Account settings.");
      }
    } catch {
      setErr("Could not update password. Check the current password and try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="animate-pulse rounded-2xl border bg-white/70 p-6 shadow">Loading…</div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-[0.08em]">QUICKCOURT</h1>
      </header>

      <div className="grid gap-6 md:grid-cols-[320px_1fr]">
        {/* Left column – Profile card + quick actions */}
        <aside className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow">
          <div className="flex flex-col items-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
              {/* Avatar */}
             
              <img
                src={user?.imageUrl}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 rounded-full border bg-white/90 px-2 py-1 text-[11px] shadow hover:bg-white"
                title="Change photo"
              >
                Edit
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && onPickAvatar(e.target.files[0])}
              />
            </div>

            <div className="mt-3 text-center">
              <div className="text-sm font-medium">{user?.firstName ?? "User"}</div>
              <div className="text-xs text-gray-500">{user?.primaryEmailAddress?.emailAddress}</div>
            </div>

            <div className="mt-4 grid w-full gap-2">
              <button
                className={`rounded-xl px-3 py-2 text-sm font-medium shadow-sm transition ${
                  tab === "edit"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => setTab("edit")}
              >
                Edit Profile
              </button>
              <button
                className={`rounded-xl px-3 py-2 text-sm font-medium shadow-sm transition ${
                  tab === "bookings"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => setTab("bookings")}
              >
                My Bookings
              </button>
            </div>
          </div>
        </aside>

        {/* Right column – Bookings or Edit form */}
        <main className="rounded-3xl border border-gray-200 bg-white/90 p-4 shadow md:p-6">
          {/* Message bars */}
          {msg && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {msg}
            </div>
          )}
          {err && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {err}
            </div>
          )}

          {tab === "bookings" ? (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold">All Bookings</h2>
                <div className="text-xs text-gray-500">{MOCK_BOOKINGS.length} total</div>
              </div>

              <div className="grid gap-3">
                {MOCK_BOOKINGS.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow transition"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold">{b.venue}</div>
                        <div className="text-xs text-gray-600">
                          {b.sport} • {b.court}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        <div>{b.date}</div>
                        <div className="text-gray-600">{b.time}</div>
                      </div>
                      <Badge status={b.status} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section className="max-w-xl">
              <h2 className="mb-4 text-base font-semibold">Edit Profile</h2>

              {/* Full name */}
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full name"
                  className="block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              {/* Email (read-only here) */}
              <div className="mb-6">
                <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={user?.primaryEmailAddress?.emailAddress ?? ""}
                  readOnly
                  className="block w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-600"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Email changes are managed in Account settings.
                </p>
              </div>

              {/* Password change */}
              <div className="mb-2 text-sm font-semibold">Change Password</div>
              <div className="mb-3">
                <label className="mb-1 block text-sm text-gray-700">Old Password</label>
                <div className="relative">
                  <input
                    type={showOld ? "text" : "password"}
                    value={oldPw}
                    onChange={(e) => setOldPw(e.target.value)}
                    className="block w-full rounded-xl border border-gray-300 px-3 py-2 pr-10 text-sm shadow-sm outline-none focus:ring-2 focus:ring-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld((s) => !s)}
                    className="absolute inset-y-0 right-0 px-3 text-gray-500"
                    aria-label="Toggle password"
                  >
                    {showOld ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-1 block text-sm text-gray-700">New Password</label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    className="block w-full rounded-xl border border-gray-300 px-3 py-2 pr-10 text-sm shadow-sm outline-none focus:ring-2 focus:ring-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((s) => !s)}
                    className="absolute inset-y-0 right-0 px-3 text-gray-500"
                    aria-label="Toggle password"
                  >
                    {showNew ? "🙈" : "👁️"}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Use 8+ chars with an uppercase, a number, and a special character.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
                <button
                  onClick={changePassword}
                  disabled={saving || !oldPw || !newPw}
                  className="rounded-xl bg-gray-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Updating…" : "Update Password"}
                </button>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
