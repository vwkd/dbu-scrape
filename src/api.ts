const GROUPS_URL =
  "https://buddhismus-deutschland.de/zentren-und-gruppen/?searchsubmit=Suchen";

/**
 * Get groups from website
 *
 * - no search queries to get all groups
 * @returns HTML string of groups
 */
export async function getGroups(): Promise<string> {
  const res = await fetch(GROUPS_URL);
  const text = await res.text();

  return text;
}
