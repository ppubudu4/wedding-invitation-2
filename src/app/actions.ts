"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  generateInviteCode,
  inviteGreeting,
  type InviteType,
} from "@/lib/invitations";

/* ============================================================
   RSVP submission (public)
   ============================================================ */

const rsvpSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(120),
  attending: z.enum(["yes", "no"], {
    errorMap: () => ({ message: "Please let us know if you can attend." }),
  }),
  party_size: z.coerce.number().int().min(1).max(30),
  dietary: z.string().trim().max(500).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  invitation_id: z.string().uuid().optional().or(z.literal("")),
});

export type RsvpState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "attending" | "party_size", string>>;
};

export async function submitRsvp(
  _prev: RsvpState,
  formData: FormData
): Promise<RsvpState> {
  const parsed = rsvpSchema.safeParse({
    name: formData.get("name"),
    attending: formData.get("attending"),
    party_size: formData.get("party_size") || 1,
    dietary: formData.get("dietary") ?? "",
    message: formData.get("message") ?? "",
    invitation_id: formData.get("invitation_id") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      errors: {
        name: fieldErrors.name?.[0],
        attending: fieldErrors.attending?.[0],
        party_size: fieldErrors.party_size?.[0],
      },
    };
  }

  const data = parsed.data;
  const attending = data.attending === "yes";

  const supabase = await createClient();
  const { error } = await supabase.from("rsvps").insert({
    name: data.name,
    attending,
    party_size: attending ? data.party_size : 1,
    dietary: data.dietary ? data.dietary : null,
    message: data.message ? data.message : null,
    invitation_id: data.invitation_id ? data.invitation_id : null,
  });

  if (error) {
    return {
      status: "error",
      message:
        "Sorry — something went wrong saving your response. Please try again.",
    };
  }

  // Publish an optional message to the public wishes wall (never blocks RSVP).
  if (data.message) {
    await supabase
      .from("wishes")
      .insert({ name: data.name, message: data.message.slice(0, 1000) });
  }

  return {
    status: "success",
    message: attending
      ? "Thank you! We can't wait to celebrate with you."
      : "Thank you for letting us know — you'll be missed.",
  };
}

/* ============================================================
   Create invitation (admin only)
   ============================================================ */

const inviteSchema = z
  .object({
    invite_type: z.enum(["single", "couple", "family"]),
    guest_name: z.string().trim().max(120).optional().or(z.literal("")),
    title: z.enum(["Mr", "Mrs"]).optional().or(z.literal("")),
    first_name: z.string().trim().max(80).optional().or(z.literal("")),
    last_name: z.string().trim().max(80).optional().or(z.literal("")),
  })
  .superRefine((val, ctx) => {
    if (val.invite_type === "single" && !val.guest_name) {
      ctx.addIssue({ code: "custom", path: ["guest_name"], message: "Enter the guest's name." });
    }
    if (val.invite_type === "couple" && !val.last_name) {
      ctx.addIssue({ code: "custom", path: ["last_name"], message: "Enter the couple's surname." });
    }
    if (val.invite_type === "family") {
      if (!val.title) ctx.addIssue({ code: "custom", path: ["title"], message: "Choose a title." });
      if (!val.first_name) ctx.addIssue({ code: "custom", path: ["first_name"], message: "Enter a first name." });
      if (!val.last_name) ctx.addIssue({ code: "custom", path: ["last_name"], message: "Enter a surname." });
    }
  });

export type InviteState = {
  status: "idle" | "success" | "error";
  message?: string;
  code?: string;
  greeting?: string;
};

const MAX_PARTY: Record<InviteType, number> = {
  single: 1,
  couple: 2,
  family: 12,
};

export async function createInvitation(
  _prev: InviteState,
  formData: FormData
): Promise<InviteState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "Not authorised." };

  const parsed = inviteSchema.safeParse({
    invite_type: formData.get("invite_type"),
    guest_name: formData.get("guest_name") ?? "",
    title: formData.get("title") ?? "",
    first_name: formData.get("first_name") ?? "",
    last_name: formData.get("last_name") ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message:
        parsed.error.issues[0]?.message ?? "Please complete the invitation.",
    };
  }

  const v = parsed.data;
  const type = v.invite_type;
  const code = generateInviteCode();

  const { error } = await supabase.from("invitations").insert({
    code,
    invite_type: type,
    guest_name: type === "single" ? v.guest_name : null,
    title: type === "family" ? v.title || null : null,
    first_name: type === "family" ? v.first_name : null,
    last_name: type === "single" ? null : v.last_name,
    max_party: MAX_PARTY[type],
  });

  if (error) {
    return {
      status: "error",
      message: "Could not create the invitation. Please try again.",
    };
  }

  revalidatePath("/admin");
  return {
    status: "success",
    code,
    greeting: inviteGreeting(v),
    message: "Invitation created.",
  };
}

export async function deleteInvitation(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("invitations").delete().eq("id", id);
  revalidatePath("/admin");
}
