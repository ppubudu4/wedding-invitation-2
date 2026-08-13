/**
 * Shared plumbing for the "Created by" filters on the Invitations and All
 * Responses lists, so the two can't drift apart.
 */

export const CREATOR_ALL = "all";

/** Invitations created before creator attribution existed. */
export const CREATOR_UNATTRIBUTED = "__none__";

/** Responses from the public RSVP form, which have no invitation at all. */
export const CREATOR_DIRECT = "__direct__";

export type CreatorOptions = {
  emails: string[];
  hasUnattributed: boolean;
};

export function creatorOptions(
  creators: readonly (string | null)[]
): CreatorOptions {
  const emails = new Set<string>();
  let hasUnattributed = false;
  for (const c of creators) {
    if (c) emails.add(c);
    else hasUnattributed = true;
  }
  return {
    emails: [...emails].sort((a, b) => a.localeCompare(b)),
    hasUnattributed,
  };
}

/** The option values a dropdown built from `options` can actually offer. */
export function creatorValues(
  options: CreatorOptions,
  extras: readonly string[] = []
): string[] {
  return [
    ...options.emails,
    ...(options.hasUnattributed ? [CREATOR_UNATTRIBUTED] : []),
    ...extras,
  ];
}

/**
 * Falls back to "all" when the chosen creator no longer exists — their last
 * invitation may have been deleted — so a list can't get stuck showing nothing.
 */
export function resolveCreator(
  chosen: string,
  values: readonly string[]
): string {
  return values.includes(chosen) ? chosen : CREATOR_ALL;
}

/** Whether a row attributed to `createdBy` belongs under `selected`. */
export function matchesCreator(
  selected: string,
  createdBy: string | null
): boolean {
  if (selected === CREATOR_ALL) return true;
  if (selected === CREATOR_UNATTRIBUTED) return !createdBy;
  return createdBy === selected;
}
