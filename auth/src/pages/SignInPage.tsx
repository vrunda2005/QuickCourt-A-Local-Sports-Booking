import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useClerk, useSignIn } from "@clerk/clerk-react";
import { getCaptchaToken } from "../lib/clerkCapta";

type ClerkErrorDetail = { longMessage?: string; message?: string };
type ClerkErrorLike = { errors?: ClerkErrorDetail[] };

function getErrorMessage(err: unknown, fallback = "Check your email/password and try again."): string {
  if (typeof err === "object" && err !== null && "errors" in err) {
    const e = (err as ClerkErrorLike).errors?.[0];
    return e?.longMessage || e?.message || fallback;
  }
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return fallback;
}

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const clerk = useClerk();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [caps, setCaps] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const emailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()), [email]);
  const pwValid = pw.length >= 6;
  const isValid = emailValid && pwValid && !loading;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => setCaps(e.getModifierState?.("CapsLock") ?? false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!isLoaded || !isValid) return;

    try {
      setLoading(true);

      // Optional Bot Protection token
      const captchaToken = await getCaptchaToken(clerk);

      const res = await signIn.create({
        identifier: email,
        password: pw,
        ...(captchaToken ? { captchaToken } : {}),
      });

      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId });
        navigate("/dashboard");
      } else {
        // MFA or additional steps could be handled here
        navigate("/signin");
      }
    } catch (error: unknown) {
      setErr(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl">
      {/* FORM */}
      <section className="flex w-full items-center justify-center px-6 sm:px-10 xl:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-[0.08em]">QUICKCOURT</h1>
            <p className="mt-1 text-xs text-gray-500">LOGIN</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            {err && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {err}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className={`block w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 ${
                  email && !emailValid
                    ? "border-red-300 focus:ring-red-400"
                    : "border-gray-300 focus:ring-gray-900"
                }`}
              />
              {email && !emailValid && (
                <p className="mt-1 text-xs text-red-600">Please enter a valid email.</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                {caps && <span className="text-[10px] text-amber-600">CAPS LOCK ON</span>}
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={pw}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPw(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`block w-full rounded-xl border bg-white px-3 py-2 pr-10 text-sm shadow-sm outline-none focus:ring-2 ${
                    pw && !pwValid
                      ? "border-red-300 focus:ring-red-400"
                      : "border-gray-300 focus:ring-gray-900"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute inset-y-0 right-0 grid place-items-center px-3 text-gray-500 hover:text-gray-700"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
              {pw && !pwValid && (
                <p className="mt-1 text-xs text-red-600">At least 6 characters.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isValid}
              className={`w-full rounded-xl px-4 py-2 text-sm font-medium shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                isValid
                  ? "bg-black text-white hover:opacity-90 active:scale-[.99]"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? "Logging in…" : "Login"}
            </button>

            <div className="text-center text-xs text-gray-600">
              <p>
                Don’t have an account?{" "}
                <Link to="/signup" className="text-blue-600 hover:underline">
                  Sign up
                </Link>
              </p>
              <p className="mt-1">
                <a href="/forgot-password" className="text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* IMAGE (desktop) */}
      <aside className="relative hidden flex-1 items-center justify-center xl:flex">
        <div className="mx-10 h-[86vh] w-full max-w-[640px] rounded-3xl border border-gray-200 bg-white/80 shadow-lg overflow-hidden">
          <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center" />
        </div>
        <p className="absolute bottom-6 text-xs text-gray-500">
          Welcome back to <span className="font-medium">QuickCourt</span>
        </p>
      </aside>
    </div>
  );
}
