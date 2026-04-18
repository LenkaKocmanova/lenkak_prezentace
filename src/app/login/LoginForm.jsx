"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function safeCallbackUrl(url) {
  if (typeof url !== "string") return "/";
  if (!url.startsWith("/") || url.startsWith("//")) return "/";
  return url;
}

export default function LoginForm({
  registered,
  callbackUrl: callbackUrlProp,
}) {
  const router = useRouter();
  const callbackUrl = safeCallbackUrl(callbackUrlProp || "/");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  /** Remove accidental ?email=&password= from URL (e.g. GET submit or shared link). */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (!url.searchParams.has("email") && !url.searchParams.has("password")) {
      return;
    }
    url.searchParams.delete("email");
    url.searchParams.delete("password");
    const qs = url.searchParams.toString();
    router.replace(`${url.pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setPending(true);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = String(fd.get("email") ?? "").trim().toLowerCase();
    const password = String(fd.get("password") ?? "");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      // Auth.js v5 returns { ok, error, … } when redirect: false
      if (!res || res.ok !== true || res.error) {
        setError(
          "Přihlášení se nepovedlo. Zkontrolujte e-mail a heslo (musí souhlasit s účtem v databázi).",
        );
        return;
      }

      /* Full navigation so the root layout runs again with the session cookie.
         router.push + refresh often leaves SessionProvider / auth() stale in App Router. */
      window.location.assign(callbackUrl);
    } catch (err) {
      console.error("signIn:", err);
      setError(
        "Přihlášení selhalo (technická chyba). Zkuste obnovit stránku nebo zkontrolujte AUTH_SECRET / NEXTAUTH_URL v .env.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-neutral-200 bg-white p-8 shadow-md">
      <h1 className="text-center text-2xl font-bold text-neutral-900">Přihlášení</h1>
      <p className="mt-2 text-center text-sm text-neutral-600">
        Nemáte účet?{" "}
        <Link
          href="/registrace"
          className="font-medium text-blue-800 underline hover:text-blue-600"
        >
          Registrace
        </Link>
      </p>

      {registered ? (
        <p className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-center text-sm text-green-800">
          Registrace proběhla úspěšně. Nyní se můžete přihlásit.
        </p>
      ) : null}

      <form
        method="post"
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col gap-4"
      >
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
            Heslo
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-blue-800 disabled:opacity-60"
        >
          {pending ? "Přihlašuji…" : "Přihlásit se"}
        </button>
      </form>
    </div>
  );
}
