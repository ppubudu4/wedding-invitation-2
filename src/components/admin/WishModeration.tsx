"use client";

import { approveWish, deleteWish } from "@/app/actions";
import type { Wish } from "./types";

/**
 * Admin moderation for the public wishes wall. Pending wishes are shown first
 * so spam can be removed before it ever goes live; approved wishes remain
 * listed so they can be taken down later if needed.
 */
export default function WishModeration({ wishes }: { wishes: Wish[] }) {
  if (wishes.length === 0) {
    return <p className="admin__empty">No wishes yet.</p>;
  }

  const pending = wishes.filter((w) => !w.approved);
  const approved = wishes.filter((w) => w.approved);

  return (
    <div className="wish-mod">
      <p className="admin__lead">
        {pending.length > 0
          ? `${pending.length} wish${pending.length === 1 ? "" : "es"} awaiting your approval. Nothing appears on the public wishes wall until you approve it.`
          : "All caught up — no wishes are waiting for approval."}
      </p>

      {pending.length > 0 && (
        <ul className="wish-mod__list">
          {pending.map((w) => (
            <WishCard key={w.id} wish={w} pending />
          ))}
        </ul>
      )}

      {approved.length > 0 && (
        <>
          <h3 className="wish-mod__subhead">
            Approved{" "}
            <span className="admin__count">{approved.length} live</span>
          </h3>
          <ul className="wish-mod__list">
            {approved.map((w) => (
              <WishCard key={w.id} wish={w} pending={false} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function WishCard({ wish, pending }: { wish: Wish; pending: boolean }) {
  return (
    <li className={`wish-mod__card ${pending ? "wish-mod__card--pending" : ""}`}>
      <div className="wish-mod__body">
        <p className="wish-mod__msg">“{wish.message}”</p>
        <p className="wish-mod__meta">
          — {wish.name} · {new Date(wish.created_at).toLocaleString()}
        </p>
      </div>
      <div className="wish-mod__actions">
        {pending && (
          <form action={approveWish.bind(null, wish.id)}>
            <button type="submit" className="linkbtn linkbtn--go">
              Approve
            </button>
          </form>
        )}
        <form action={deleteWish.bind(null, wish.id)}>
          <button
            type="submit"
            className="linkbtn linkbtn--danger"
            aria-label={`Delete wish from ${wish.name}`}
          >
            Delete
          </button>
        </form>
      </div>
    </li>
  );
}
