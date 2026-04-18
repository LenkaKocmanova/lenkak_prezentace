"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const btnClass =
  "rounded-md border border-blue-300 px-3 py-2 text-sm font-medium text-blue-100 transition-colors hover:bg-blue-800 hover:text-white";

export default function NavAuth() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <button
        type="button"
        onClick={async () => {
          await signOut({ redirect: false });
          window.location.assign("/");
        }}
        className={btnClass}
      >
         Logout
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/login" className={btnClass}>
        Login
      </Link>
      <Link href="/registrace" className={btnClass}>
        Register
      </Link>
    </div>
  );
}
