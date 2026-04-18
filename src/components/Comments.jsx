"use client";

import {
  createComment,
  deleteComment,
  updateComment,
} from "@/actions/commentActions";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";

/**
 * @param {object} props
 * @param {string} props.propertyId
 * @param {{ _id: string, body: string, authorName?: string, ownerId?: string, createdAt?: string | null }[]} props.initialComments
 */
export default function Comments({ propertyId, initialComments = [] }) {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState(initialComments);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [actionId, setActionId] = useState(null);

  const myId = session?.user?.id ? String(session.user.id) : null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const content = String(fd.get("content") ?? "").trim();
    if (!content) return;

    setPending(true);
    const res = await createComment(propertyId, content);
    setPending(false);

    if (!res?.ok) {
      if (res?.error === "auth") {
        setError("Pro přidání komentáře se musíte přihlásit.");
      } else {
        setError("Komentář se nepodařilo uložit.");
      }
      return;
    }

    setComments((prev) => [res.comment, ...prev]);
    form.reset();
  }

  function startEdit(comment) {
    setEditingId(comment._id);
    setEditText(comment.body ?? "");
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditText("");
  }

  async function saveEdit(commentId) {
    const text = editText.trim();
    if (!text) return;

    setActionId(commentId);
    const res = await updateComment(commentId, text);
    setActionId(null);

    if (!res?.ok) {
      if (res?.error === "forbidden") {
        setError("Tento komentář můžete upravit jen vy.");
      } else if (res?.error === "not-found") {
        setError("Komentář už neexistuje.");
      } else {
        setError("Uložení se nepovedlo.");
      }
      return;
    }

    setComments((prev) =>
      prev.map((c) =>
        c._id === commentId ? { ...c, body: res.body } : c,
      ),
    );
    cancelEdit();
  }

  async function handleDelete(commentId) {
    if (!window.confirm("Opravdu smazat tento komentář?")) return;

    setActionId(commentId);
    const res = await deleteComment(commentId);
    setActionId(null);

    if (!res?.ok) {
      if (res?.error === "forbidden") {
        setError("Tento komentář můžete smazat jen vy.");
      } else if (res?.error === "not-found") {
        setError("Komentář už neexistuje.");
      } else {
        setError("Smazání se nepovedlo.");
      }
      return;
    }

    setComments((prev) => prev.filter((c) => c._id !== commentId));
    if (editingId === commentId) cancelEdit();
  }

  return (
    <div className="mt-8 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-neutral-900">Komentáře</h2>

      <ul className="mt-4 space-y-3">
        {comments.length === 0 ? (
          <li className="text-sm text-neutral-500">Zatím žádné komentáře.</li>
        ) : (
          comments.map((comment) => {
            const isMine = myId && comment.ownerId && myId === comment.ownerId;
            const busy = actionId === comment._id;

            return (
              <li
                key={comment._id}
                className="rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2 text-sm text-neutral-800"
              >
                {editingId === comment._id ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-neutral-300 p-2 text-neutral-900"
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={busy || !editText.trim()}
                        onClick={() => saveEdit(comment._id)}
                        className="rounded-md bg-blue-800 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                      >
                        Uložit
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={cancelEdit}
                        className="rounded-md border border-neutral-300 px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                      >
                        Zrušit
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      {comment.authorName ? (
                        <span className="font-medium text-neutral-600">
                          {comment.authorName}:{" "}
                        </span>
                      ) : null}
                      {comment.body}
                    </div>
                    {isMine ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => startEdit(comment)}
                          className="text-xs font-medium text-blue-800 underline hover:text-blue-600 disabled:opacity-50"
                        >
                          Upravit
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleDelete(comment._id)}
                          className="text-xs font-medium text-red-700 underline hover:text-red-600 disabled:opacity-50"
                        >
                          Smazat
                        </button>
                      </div>
                    ) : null}
                  </>
                )}
              </li>
            );
          })
        )}
      </ul>

      {error ? (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      {status === "loading" ? (
        <p className="mt-4 text-sm text-neutral-500">Načítám…</p>
      ) : session?.user ? (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <textarea
            name="content"
            placeholder="Napište komentář…"
            required
            rows={3}
            className="w-full rounded-lg border border-neutral-300 p-2 text-neutral-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-blue-800 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {pending ? "Odesílám…" : "Přidat komentář"}
          </button>
        </form>
      ) : (
        <p className="mt-6 text-sm text-neutral-600">
          Pokud chcete přidat komentář,{" "}
          <Link href="/login" className="font-medium text-blue-800 underline">
            přihlaste se
          </Link>
          .
        </p>
      )}
    </div>
  );
}
