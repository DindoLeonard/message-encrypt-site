import { NextResponse } from "next/server";

// Server-side API route to fetch the message
export async function GET() {
  const url =
    "https://drive.google.com/uc?export=download&id=18ZakjpU1529d_FNCfWu1UE8m0imKnBzB";

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to fetch the message.");
    }

    const message = await response.text();
    return NextResponse.json({ message });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {
    return NextResponse.json(
      { error: "Failed to fetch message." },
      { status: 500 }
    );
  }
}
