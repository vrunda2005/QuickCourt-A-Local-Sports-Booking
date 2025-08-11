import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClerk, useSignUp } from "@clerk/clerk-react";
import { getCaptchaToken } from "../lib/clerkCapta";
import SportsCarousel from "../components/SportsCarousel";

/* ---- error helpers ---- */
type ClerkErrorDetail = { longMessage?: string; message?: string };
type ClerkErrorLike = { errors?: ClerkErrorDetail[] };
const isClerkError = (e: unknown): e is ClerkErrorLike =>
  typeof e === "object" && e !== null && "errors" in (e as Record<string, unknown>);
const getErrorMessage = (e: unknown, fallback: string) => {
  if (isClerkError(e)) return e.errors?.[0]?.longMessage || e.errors?.[0]?.message || fallback;
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  return fallback;
};

/* ---- util ---- */
const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });

export default function SignUpPage() {
  const navigate = useNavigate();
  const { isLoaded, signUp } = useSignUp();
  const clerk = useClerk();

  const [role, setRole] = useState("player");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const strong =
    /[A-Z]/.test(pw) && /[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw) && pw.length >= 8;
  const valid = fullName && email && strong && pw === confirm;

  const onPick = async (f: File) => {
    if (f.size > 1024 * 1024) {
      setErr("Oops! The image is too large. Please upload an image smaller than 1 MB.");
      return;
    }
    setErr(null);
    const dataUrl = await fileToDataUrl(f);
    setPreview(dataUrl);
    localStorage.setItem("qc_avatar_dataurl", dataUrl); // apply after OTP
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!isLoaded || !valid) return;

    try {
      setLoading(true);

      // Optional Clerk Bot Protection token
      const captchaToken = await getCaptchaToken(clerk);

      // Do NOT send name fields here (Clerk v5 disallows at create)
      await signUp.create({
        emailAddress: email,
        password: pw,
        unsafeMetadata: { role, fullName },
        ...(captchaToken ? { captchaToken } : {}),
      });

      // keep locally so we can apply right after activation in OTP page
      localStorage.setItem("qc_full_name", fullName);

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      navigate("/verify-otp", { state: { email } });
    } catch (error: unknown) {
      setErr(getErrorMessage(error, "Sign up failed. Please check your details."));
    } finally {
      setLoading(false);
    }
  };

  const sportsImages = [
    "https://evarazdin.hr/upload/publish/366213/badmintonjpg-1600x900-q85-crop-subsampling-2-upsca_59be4965b377b.jpg",
    "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1600&auto=format&fit=crop",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd8TH-6bR7S--hZHubLHC3zyh4DndjZnlSug&s",
    "https://static.toiimg.com/imagenext/toiblogs/photo/blogs/wp-content/uploads/2025/07/Tennis.jpg",
  ];

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl">
      {/* FORM */}
      <section className="flex w-full items-center justify-center px-6 sm:px-10 xl:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-[0.08em]">QUICKCOURT</h1>
            <p className="mt-1 text-xs text-gray-500">SIGN UP</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            {err && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {err}
              </div>
            )}

            {/* Profile picture */}
            <div className="flex flex-col items-center gap-2">
              <label
                htmlFor="avatar"
                className="h-20 w-20 overflow-hidden rounded-full border border-gray-300 bg-gray-100 grid place-items-center cursor-pointer"
                title="Upload profile picture"
              >
                {preview ? <img src={preview} className="h-full w-full object-cover" /> : <span>📷</span>}
              </label>
              <input
                id="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && onPick(e.target.files[0])}
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Sign up as</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="player">Player</option>
                <option value="facility-owner">Player / Facility Owner</option>
              </select>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder="Use 8+ chars with upper, number & special"
                  className="block w-full rounded-xl border border-gray-300 px-3 py-2 pr-10 text-sm shadow-sm outline-none focus:ring-2 focus:ring-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute inset-y-0 right-0 px-3 text-gray-500"
                >
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
              {!strong && pw.length > 0 && (
                <p className="mt-1 text-xs text-red-600">
                  Use 8–20 chars with at least one uppercase, one number, and one special symbol.
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-gray-300 px-3 py-2 pr-10 text-sm shadow-sm outline-none focus:ring-2 focus:ring-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute inset-y-0 right-0 px-3 text-gray-500"
                >
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              </div>
              {confirm && confirm !== pw && (
                <p className="mt-1 text-xs text-red-600">Passwords do not match.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!valid || loading}
              className={`w-full rounded-xl px-4 py-2 text-sm font-medium shadow-sm transition ${
                !valid || loading ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-black text-white hover:opacity-90"
              }`}
            >
              {loading ? "Creating account…" : "Sign Up"}
            </button>

            <p className="text-center text-xs text-gray-600">
              Already have an account?{" "}
              <a href="/signin" className="text-blue-600 hover:underline">
                Log in
              </a>
            </p>
          </form>
        </div>
      </section>

      {/* IMAGE (desktop only) */}
      <aside className="hidden xl:flex flex-1 items-center justify-center">
        <div className="mx-10 h-[86vh] w-full max-w-[640px] rounded-3xl border border-gray-200 bg-white/80 shadow-lg overflow-hidden">
          <SportsCarousel images={sportsImages} intervalMs={4000} />
        </div>
      </aside>
    </div>
  );
}
