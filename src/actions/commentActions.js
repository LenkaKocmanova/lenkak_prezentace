"use server";

import { auth } from "@/config/auth";
import connectDB from "@/config/database";
import Comments from "../../models/Comments";

export async function createComment(propertyId, body) {
  const text = String(body ?? "").trim();
  if (!propertyId || !text) {
    return { ok: false, error: "missing-fields" };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "auth" };
  }

  await connectDB();

  const doc = await Comments.create({
    property: propertyId,
    owner: session.user.id,
    body: text,
  });

  const ownerName = session.user.name ?? session.user.email ?? "Uživatel";

  return {
    ok: true,
    comment: {
      _id: String(doc._id),
      body: doc.body,
      authorName: ownerName,
      ownerId: String(session.user.id),
      createdAt: doc.createdAt?.toISOString?.() ?? null,
    },
  };
}

export async function updateComment(commentId, body) {
  const text = String(body ?? "").trim();
  if (!commentId || !text) {
    return { ok: false, error: "missing-fields" };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "auth" };
  }

  await connectDB();

  const updated = await Comments.findOneAndUpdate(
    { _id: commentId, owner: session.user.id },
    { $set: { body: text } },
    { new: true },
  ).lean();

  if (!updated) {
    const exists = await Comments.findById(commentId).lean();
    if (!exists) return { ok: false, error: "not-found" };
    return { ok: false, error: "forbidden" };
  }

  return { ok: true, body: text };
}

export async function deleteComment(commentId) {
  if (!commentId) {
    return { ok: false, error: "missing-fields" };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "auth" };
  }

  await connectDB();

  const result = await Comments.deleteOne({
    _id: commentId,
    owner: session.user.id,
  });

  if (result.deletedCount === 0) {
    const exists = await Comments.findById(commentId).lean();
    if (!exists) return { ok: false, error: "not-found" };
    return { ok: false, error: "forbidden" };
  }

  return { ok: true };
}

