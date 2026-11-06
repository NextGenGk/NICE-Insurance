import { NextRequest, NextResponse } from "next/server";

// Proxies logo images from NICE's own public site assets through our server.
// Fetching server-side (rather than a browser <img src> pointed straight
// at the third-party image host) avoids referrer-based hotlink protection
// that some CDNs apply to cross-origin <img> tags, and gives us one place
// to allowlist which external hosts we will ever proxy from (SSRF guard).
const ALLOWED_HOSTS = [
  "niceinsurance.co.in",
  "www.niceinsurance.co.in",
  "image1.jdomni.in",
  "image2.jdomni.in",
  "image3.jdomni.in",
  "logo.clearbit.com",
];

export async function GET(req: NextRequest) {
  const src = req.nextUrl.searchParams.get("src");
  if (!src) return NextResponse.json({ error: "missing src" }, { status: 400 });

  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  if (!ALLOWED_HOSTS.includes(url.hostname)) {
    return NextResponse.json({ error: "host not allowed" }, { status: 403 });
  }

  try {
    const upstream = await fetch(url.toString(), {
      headers: {
        // A normal browser UA and no cross-site Referer — this is what
        // makes server-side proxying more reliable than a client <img>
        // tag pointed directly at a third-party host.
        "User-Agent": "Mozilla/5.0 (compatible; NICEInsuranceWorkspace/1.0)",
      },
      next: { revalidate: 86400 }, // cache the upstream fetch for a day
    });

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json({ error: "upstream fetch failed" }, { status: 502 });
    }

    const contentType = upstream.headers.get("content-type") ?? "image/png";

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "fetch error" }, { status: 502 });
  }
}
