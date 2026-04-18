"use client";

import { registerUser } from "@/actions/registerUser";
import Link from "next/link";
import { useActionState } from "react";

const initialState = { ok: false, message: "" };

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerUser, initialState);

  if (state.ok) {
    return (
      <div className="mx-auto w-full max-w-md rounded-xl border border-green-200 bg-green-50 p-8 text-center shadow-md">
        <p className="font-medium text-green-900">Účet byl vytvořen.</p>
        <Link
          href="/login?registered=1"
          className="mt-4 inline-block rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Přejít na přihlášení
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-neutral-200 bg-white p-8 shadow-md">
      <h1 className="text-center text-2xl font-bold text-neutral-900">Registrace</h1>
      <p className="mt-2 text-center text-sm text-neutral-600">
        Už máte účet?{" "}
        <Link
          href="/login"
          className="font-medium text-blue-800 underline hover:text-blue-600"
        >
          Přihlásit se
        </Link>
      </p>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-neutral-700">
            Uživatelské jméno
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            minLength={2}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
            Heslo (min. 8 znaků)
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
        <div>
          <label
            htmlFor="passwordConfirm"
            className="block text-sm font-medium text-neutral-700"
          >
            Potvrzení hesla
          </label>
          <input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {state.message ? (
          <p className="text-sm text-red-600" role="alert">
            {state.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-blue-800 disabled:opacity-60"
        >
          {pending ? "Registruji…" : "Zaregistrovat se"}
        </button>
      </form>
    </div>
  );
}
