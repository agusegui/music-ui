import { NextRequest, NextResponse } from "next/server";
import { getStreamUrl } from "@/lib/soundcloud";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing 'url' parameter" },
      { status: 400 },
    );
  }

  if (!url.startsWith("https://api-v2.soundcloud.com/")) {
    return NextResponse.json(
      { error: "Invalid transcoding URL" },
      { status: 400 },
    );
  }

  try {
    const data = await getStreamUrl(url);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch stream URL" },
      { status: 502 },
    );
  }
}
