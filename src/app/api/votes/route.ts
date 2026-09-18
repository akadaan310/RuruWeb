import { NextRequest, NextResponse } from "next/server";
import { castVote, getPollOptions } from "@/lib/votes-store";

const VOTED_COOKIE = "voted_ideas";

function readVotedIds(request: NextRequest): string[] {
  const raw = request.cookies.get(VOTED_COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const options = await getPollOptions();
  return NextResponse.json({ options, votedIds: readVotedIds(request) });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const id = body?.id;
  if (typeof id !== "string") {
    return NextResponse.json({ error: "Missing poll option id" }, { status: 400 });
  }

  const votedIds = readVotedIds(request);
  if (votedIds.includes(id)) {
    const options = await getPollOptions();
    return NextResponse.json({ options, votedIds }, { status: 200 });
  }

  let options;
  try {
    options = await castVote(id);
  } catch {
    return NextResponse.json({ error: "Unknown poll option" }, { status: 400 });
  }

  const updatedVotedIds = [...votedIds, id];
  const response = NextResponse.json({ options, votedIds: updatedVotedIds });
  response.cookies.set(VOTED_COOKIE, JSON.stringify(updatedVotedIds), {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return response;
}
