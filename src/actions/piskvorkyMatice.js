"use server";

import { auth } from "@/config/auth";
import connectDB from "@/config/database";
import User from "../../models/User";

/** Stejné id jako položky v šabloně db.json / user.data.matice */
const MATICE_ID = "1";

function assertGrid(grid) {
  return (
    Array.isArray(grid) &&
    grid.every((row) => Array.isArray(row))
  );
}

export async function loadPiskvorkyState() {
  const session = await auth();
  const loggedIn = Boolean(session?.user?.id);

  if (!loggedIn) {
    return {
      loggedIn: false,
      /** serializovatelná kopie pole nebo null */
      grid: null,
    };
  }

  await connectDB();

  const user = await User.findById(session.user.id).select("data").lean();

  const entry = user?.data?.matice?.find((m) => String(m?.id) === MATICE_ID);
  const grid = entry?.data ?? null;

  return {
    loggedIn: true,
    grid: grid ? structuredClone(grid) : null,
  };
}

export async function savePiskvorkyMatice(grid) {
  if (!assertGrid(grid)) {
    return { ok: false, error: "invalid-grid" };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "auth" };
  }

  await connectDB();

  const user = await User.findById(session.user.id).select("data");
  if (!user) {
    return { ok: false, error: "user" };
  }

  const prev = user.data && typeof user.data === "object" ? user.data : {};
  let matice = Array.isArray(prev.matice) ? [...prev.matice] : [];

  const idx = matice.findIndex((m) => String(m?.id) === MATICE_ID);
  const entry = { id: MATICE_ID, data: structuredClone(grid) };

  if (idx === -1) {
    matice.push(entry);
  } else {
    matice[idx] = entry;
  }

  user.data = { ...prev, matice };
  user.markModified("data");
  await user.save();

  return { ok: true };
}
