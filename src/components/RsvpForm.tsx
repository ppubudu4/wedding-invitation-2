"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { submitRsvp, type RsvpState } from "@/app/actions";
import type { InviteView } from "@/lib/invitations";

const initialState: RsvpState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="btn rsvp__submit"
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? "Sending…" : "Send RSVP"}
    </button>
  );
}

export default function RsvpForm({ invite }: { invite?: InviteView }) {
  const [state, formAction] = useFormState(submitRsvp, initialState);
  const [attending, setAttending] = useState<"yes" | "no" | "">("");

  // Anti-spam: stamp the moment the form became interactive. Set on the client
  // (not at render) so the value is a real load time, and submissions that come
  // back within a few seconds can be flagged as bots server-side.
  const tsRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (tsRef.current) tsRef.current.value = String(Date.now());
  }, []);

  // Single-guest invites don't need a count; couple/family (and the generic
  // page) do. On the generic page the count only shows once "attending" is yes.
  const showCount = attending === "yes" && (invite ? invite.allowCount : true);

  if (state.status === "success") {
    return (
      <div className="rsvp__thanks" role="status">
        <p className="rsvp__thanks-mark" aria-hidden="true">
          ♥
        </p>
        <h3>Thank You</h3>
        <p>{state.message}</p>
        <p>Your reserved details will be shared closer to our special day.</p>
      </div>
    );
  }

  return (
    <form className="rsvp__form" action={formAction} noValidate>
      {invite && <input type="hidden" name="invitation_id" value={invite.id} />}

      {/* Anti-spam honeypot: hidden from humans, irresistible to bots. If a
          value comes through, the submission is dropped server-side. */}
      <input type="hidden" name="form_ts" ref={tsRef} />
      <div className="rsvp__hp" aria-hidden="true">
        <label htmlFor="website">Website (leave this empty)</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className={`field ${state.errors?.name ? "field--error" : ""}`}>
        <label htmlFor="name">
          Your name <span className="req">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          defaultValue={invite?.greeting ?? ""}
          placeholder="First & last name"
          aria-invalid={!!state.errors?.name}
        />
        {state.errors?.name && (
          <span className="field__error">{state.errors.name}</span>
        )}
      </div>

      <div
        className={`field ${state.errors?.attending ? "field--error" : ""}`}
        role="group"
        aria-label="Will you attend?"
      >
        <label>
          Will you attend? <span className="req">*</span>
        </label>
        <div className="choice">
          <label className="choice__opt">
            <input
              type="radio"
              name="attending"
              value="yes"
              checked={attending === "yes"}
              onChange={() => setAttending("yes")}
              required
            />
            <span>Joyfully accepts</span>
          </label>
          <label className="choice__opt">
            <input
              type="radio"
              name="attending"
              value="no"
              checked={attending === "no"}
              onChange={() => setAttending("no")}
            />
            <span>Regretfully declines</span>
          </label>
        </div>
        {state.errors?.attending && (
          <span className="field__error">{state.errors.attending}</span>
        )}
      </div>

      {showCount && (
        <div className="field">
          <label htmlFor="party_size">
            Number of guests attending (including you)
          </label>
          <input
            id="party_size"
            name="party_size"
            type="number"
            min={1}
            max={invite?.maxParty ?? 20}
            defaultValue={invite?.defaultCount ?? 1}
            inputMode="numeric"
          />
        </div>
      )}

      <div className="field">
        <label htmlFor="message">A wish for the couple (optional)</label>
        <textarea
          id="message"
          name="message"
          maxLength={1000}
          placeholder="Share a blessing or a memory…"
        />
        <span className="field__hint">
          Your wish will be shared on our wishes wall above. ♥
        </span>
      </div>

      <SubmitButton />

      {state.status === "error" && (
        <p className="rsvp__status rsvp__status--error" role="alert">
          {state.message}
        </p>
      )}
    </form>
  );
}
