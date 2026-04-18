"use client";

import Lista from "@/components/Lista.jsx";
import Pole from "@/components/Pole.jsx";
import { MyContext } from "@/actions/Contexts.js";
import { savePiskvorkyMatice } from "@/actions/piskvorkyMatice";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const VELIKOST = 10;

export function makeEmptyGrid(size) {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => " "),
  );
}

/** Zarovná uložené pole na velikost × velikost (mezery doplní). */
function normalizeGrid(grid, size) {
  return Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, j) => {
      const c = grid?.[i]?.[j];
      return typeof c === "string" && c.length ? c.slice(0, 1) : " ";
    }),
  );
}

export default function PiskvorkyGame({
  loggedIn,
  serverGrid,
}) {
  const initialMatice = useMemo(() => {
    if (serverGrid && Array.isArray(serverGrid)) {
      return normalizeGrid(serverGrid, VELIKOST);
    }
    return makeEmptyGrid(VELIKOST);
  }, [serverGrid]);

  const [znak, setZnak] = useState("X");
  const [konecHry, setKonecHry] = useState(false);
  const [matice, setMatice] = useState(() => initialMatice);
  const [zprava, setZprava] = useState("");
  /** Změna klíče znovu namountuje Pole — Bunka má znovu prázdné buňky. */
  const [boardKey, setBoardKey] = useState(0);
  const saveTimer = useRef(null);

  const persist = useCallback(
    async (grid) => {
      if (!loggedIn) return;
      try {
        const res = await savePiskvorkyMatice(grid);
        if (!res?.ok) {
          console.warn("[Piškvorky] uložení MongoDB:", res?.error ?? res);
        }
      } catch (e) {
        console.warn("[Piškvorky] uložení MongoDB:", e.message);
      }
    },
    [loggedIn],
  );

  /** Průběžné ukládání při změně desky (debounce). */
  useEffect(() => {
    if (!loggedIn || konecHry) return;

    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      persist(matice);
    }, 450);

    return () => window.clearTimeout(saveTimer.current);
  }, [loggedIn, konecHry, matice, persist]);

  const onKonecHry = useCallback(
    (kh, mat, zp) => {
      setKonecHry(kh);
      setMatice(mat);
      setZprava(zp);
      if (loggedIn) {
        window.clearTimeout(saveTimer.current);
        persist(mat);
      }
    },
    [loggedIn, persist],
  );

  /** Prázdná deska (jen mezery), skrytý výsledek, uložení do MongoDB pro přihlášené. */
  const startNewGame = useCallback(() => {
    window.clearTimeout(saveTimer.current);
    const empty = makeEmptyGrid(VELIKOST);
    setMatice(empty);
    setZnak("X");
    setKonecHry(false);
    setZprava("");
    setBoardKey((k) => k + 1);
    void persist(empty);
  }, [persist]);

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      {!loggedIn ? (
        <p className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Nejste přihlášeni — hra funguje jen v tomto okně, nic se neuloží do účtu.
          Pro vlastní uloženou desku se{" "}
          <Link href="/login" className="font-semibold underline">
            přihlaste
          </Link>
          .
        </p>
      ) : (
        <p className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
          Jste přihlášeni — průběh hry se ukládá do vašeho účtu (MongoDB).
        </p>
      )}

      <MyContext.Provider
        value={{
          znak,
          setZnak,
          matice,
          setMatice,
          zprava,
          setZprava,
          onKonecHry,
        }}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <aside className="shrink-0 rounded-xl border border-amber-200/80 bg-amber-50 p-4 shadow-sm">
            <Lista
              znak={znak}
              konecHry={konecHry}
              onNovaHra={startNewGame}
            />
          </aside>
          <div className="min-w-0 flex-1 overflow-x-auto rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
            <Pole key={boardKey} />
          </div>
        </div>
      </MyContext.Provider>
    </div>
  );
}
