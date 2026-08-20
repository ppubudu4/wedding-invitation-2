"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createInvitation, type InviteState } from "@/app/actions";
import {
  inviteGreeting,
  joinTitles,
  TITLES,
  type InviteType,
  type Title,
} from "@/lib/invitations";
import { whatsappShareUrl } from "@/lib/share";
import WhatsAppIcon from "./WhatsAppIcon";

const initial: InviteState = { status: "idle" };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn" disabled={pending} aria-disabled={pending}>
      {pending ? "Creating…" : "Create invitation"}
    </button>
  );
}

/** Mr / Mrs toggles — tick either one or both. */
function TitleChoice({
  titles,
  onToggle,
}: {
  readonly titles: readonly Title[];
  readonly onToggle: (t: Title) => void;
}) {
  return (
    <div className="field">
      <span className="field__label">Title</span>
      <div className="choice choice--titles" role="group" aria-label="Title">
        {TITLES.map((t) => (
          <label className="choice__opt" key={t}>
            <input
              type="checkbox"
              name="title"
              value={t}
              checked={titles.includes(t)}
              onChange={() => onToggle(t)}
            />
            <span>{t}</span>
          </label>
        ))}
      </div>
      {titles.length === 0 && (
        <span className="field__error">Tick at least one title.</span>
      )}
    </div>
  );
}

export default function CreateInvite() {
  const [state, formAction] = useFormState(createInvitation, initial);
  const [type, setType] = useState<InviteType>("single");
  const [titles, setTitles] = useState<Title[]>(["Mr", "Mrs"]);
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => setOrigin(window.location.origin), []);

  // After a successful create, clear the fields so the form is ready for the
  // next guest. The just-created link stays shown below for copy/share.
  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  const link =
    state.status === "success" && state.code
      ? `${origin}/i/${state.code}`
      : "";

  function toggleTitle(t: Title) {
    setTitles((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  }

  // Live previews of the wording the ticked titles produce.
  const title = joinTitles(titles);
  const couplePreview = [title, "Silva"].filter(Boolean).join(" ");
  const familyPreview = inviteGreeting({
    invite_type: "family",
    title,
    first_name: "Kamal",
    last_name: "Fernando",
  });

  async function copy() {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="invite-create">
      <form ref={formRef} className="invite-form" action={formAction}>
        <div className="field">
          <label htmlFor="invite_type">Invitation type</label>
          <div className="choice">
            {(["single", "couple", "family"] as InviteType[]).map((t) => (
              <label className="choice__opt" key={t}>
                <input
                  type="radio"
                  name="invite_type"
                  value={t}
                  checked={type === t}
                  onChange={() => setType(t)}
                />
                <span style={{ textTransform: "capitalize" }}>{t}</span>
              </label>
            ))}
          </div>
        </div>

        {type === "single" && (
          <div className="field">
            <label htmlFor="guest_name">Guest name</label>
            <input id="guest_name" name="guest_name" type="text" placeholder="e.g. Nimal Perera" />
          </div>
        )}

        {type === "couple" && (
          <>
            <TitleChoice titles={titles} onToggle={toggleTitle} />
            <div className="field">
              <label htmlFor="last_name_couple">Surname</label>
              <input id="last_name_couple" name="last_name" type="text" placeholder="e.g. Silva" />
              <span className="field__hint">Shows as “{couplePreview}”.</span>
            </div>
            <div className="field">
              <label htmlFor="first_name_couple">First name (for your reference)</label>
              <input id="first_name_couple" name="first_name" type="text" placeholder="e.g. Kamal" />
              <span className="field__hint">
                Not shown on the invitation — only in this dashboard, so you can
                tell couples with the same surname apart.
              </span>
            </div>
          </>
        )}

        {type === "family" && (
          <div className="invite-family">
            <TitleChoice titles={titles} onToggle={toggleTitle} />
            <div className="field">
              <label htmlFor="first_name">First name</label>
              <input id="first_name" name="first_name" type="text" placeholder="e.g. Kamal" />
            </div>
            <div className="field">
              <label htmlFor="last_name_family">Surname</label>
              <input id="last_name_family" name="last_name" type="text" placeholder="e.g. Fernando" />
            </div>
            <span className="field__hint">Shows as “{familyPreview}”.</span>
          </div>
        )}

        <Submit />

        {state.status === "error" && (
          <p className="rsvp__status rsvp__status--error" role="alert">
            {state.message}
          </p>
        )}
      </form>

      {link && (
        <div className="invite-created" role="status">
          <p className="field__hint">Invitation link created — share it with your guest:</p>
          <div className="invite-linkrow">
            <input readOnly value={link} onFocus={(e) => e.currentTarget.select()} />
            <button type="button" className="btn btn--ghost" onClick={copy}>
              {copied ? "Copied ✓" : "Copy"}
            </button>
            <a
              className="btn btn--wa"
              href={whatsappShareUrl(link, state.greeting)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon /> WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
