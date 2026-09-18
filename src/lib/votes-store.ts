import { promises as fs } from "fs";
import path from "path";
import pollSeed from "../../data/poll-seed.json";

export type PollOption = {
  id: string;
  title: string;
  description: string;
  votes: number;
};

// NOTE: this stores vote counts in a JSON file on local disk. That works for
// local dev and a single long-lived server, but Vercel's serverless
// filesystem is ephemeral/read-only outside /tmp, so counts will not persist
// in production there. Swap this module for a real store (Vercel KV,
// Postgres, Upstash Redis, etc.) before relying on vote counts in
// production — the rest of the app only calls the functions below.
const VOTES_FILE = path.join(process.cwd(), ".data", "votes.json");

async function readVoteCounts(): Promise<Record<string, number>> {
  try {
    const raw = await fs.readFile(VOTES_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeVoteCounts(counts: Record<string, number>): Promise<void> {
  await fs.mkdir(path.dirname(VOTES_FILE), { recursive: true });
  await fs.writeFile(VOTES_FILE, JSON.stringify(counts, null, 2));
}

export async function getPollOptions(): Promise<PollOption[]> {
  const counts = await readVoteCounts();
  return pollSeed.map((option) => ({
    ...option,
    votes: counts[option.id] ?? 0,
  }));
}

export async function castVote(id: string): Promise<PollOption[]> {
  const validIds = new Set(pollSeed.map((option) => option.id));
  if (!validIds.has(id)) {
    throw new Error(`Unknown poll option: ${id}`);
  }
  const counts = await readVoteCounts();
  counts[id] = (counts[id] ?? 0) + 1;
  await writeVoteCounts(counts);
  return getPollOptions();
}
