import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const rawBaseUrl =
  process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const trimmedBaseUrl = rawBaseUrl.replace(/\/+$/, "");
const baseUrl = trimmedBaseUrl.endsWith("/api")
  ? trimmedBaseUrl.slice(0, -4)
  : trimmedBaseUrl;

const hopByHopHeaders = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
]);

const proxyPrefix = "/api/proxy";

const ensureTrailingSlash = (path: string) => {
  if (!path || path === "/") {
    return "/";
  }
  if (path.endsWith("/")) {
    return path;
  }
  if (path.includes(".")) {
    return path;
  }
  return `${path}/`;
};

const buildTargetUrl = (req: NextRequest) => {
  const rawPath = req.nextUrl.pathname.startsWith(proxyPrefix)
    ? req.nextUrl.pathname.slice(proxyPrefix.length)
    : req.nextUrl.pathname;
  const path = ensureTrailingSlash(rawPath || "/");
  const target = new URL(`${baseUrl}${path}`);
  target.search = req.nextUrl.search;
  return target;
};

const buildHeaders = (req: NextRequest) => {
  const headers = new Headers(req.headers);
  hopByHopHeaders.forEach((header) => headers.delete(header));
  return headers;
};

const proxyRequest = async (req: NextRequest) => {
  if (!baseUrl) {
    return NextResponse.json(
      { message: "API base URL is missing." },
      { status: 500 }
    );
  }

  const targetUrl = buildTargetUrl(req);
  const headers = buildHeaders(req);
  const method = req.method.toUpperCase();

  const body =
    method === "GET" || method === "HEAD" ? undefined : await req.arrayBuffer();

  const upstreamResponse = await fetch(targetUrl, {
    method,
    headers,
    body,
    redirect: "manual",
  });

  const responseHeaders = new Headers(upstreamResponse.headers);
  hopByHopHeaders.forEach((header) => responseHeaders.delete(header));

  if (!upstreamResponse.ok) {
    const contentType = upstreamResponse.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      let bodyText = "";
      try {
        bodyText = await upstreamResponse.clone().text();
      } catch {
        bodyText = "";
      }
      const trimmed =
        bodyText.length > 2000 ? `${bodyText.slice(0, 2000)}…` : bodyText;
      console.error(
        `[proxy] ${method} ${targetUrl.toString()} -> ${upstreamResponse.status} ${contentType}`,
        trimmed
      );
      return NextResponse.json(
        {
          detail: trimmed || "Upstream error without body.",
          status: upstreamResponse.status,
          url: targetUrl.toString(),
          upstream_content_type: contentType,
        },
        { status: upstreamResponse.status }
      );
    }
  }

  return new NextResponse(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
};

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = proxyRequest;
