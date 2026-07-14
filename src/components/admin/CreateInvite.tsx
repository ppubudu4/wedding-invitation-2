"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createInvitation, type InviteState } from "@/app/actions";
import type { InviteType } from "@/lib/invitations";
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

export default function CreateInvite() {
  const [state, formAction] = useFormState(createInvitation, initial);
  const [type, setType] = useState<InviteType>("single");
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
            <div className="field">
              <label htmlFor="last_name_couple">Surname</label>
              <input id="last_name_couple" name="last_name" type="text" placeholder="e.g. Silva" />
              <span className="field__hint">Shows as “Mr &amp; Mrs Silva”.</span>
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
            <div className="field">
              <label htmlFor="title">Title</label>
              <select id="title" name="title" defaultValue="Mr">
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="first_name">First name</label>
              <input id="first_name" name="first_name" type="text" placeholder="e.g. Kamal" />
            </div>
            <div className="field">
              <label htmlFor="last_name_family">Surname</label>
              <input id="last_name_family" name="last_name" type="text" placeholder="e.g. Fernando" />
            </div>
            <span className="field__hint">Shows as “Mr. Kamal Fernando &amp; Family”.</span>
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
