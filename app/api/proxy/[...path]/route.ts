"use server";

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

const buildTargetUrl = (req: NextRequest, pathSegments?: string[]) => {
  const path = pathSegments?.join("/") ?? "";
  const target = new URL(`${baseUrl}/${path}`);
  target.search = req.nextUrl.search;
  return target;
};

const buildHeaders = (req: NextRequest) => {
  const headers = new Headers(req.headers);
  hopByHopHeaders.forEach((header) => headers.delete(header));
  return headers;
};

const proxyRequest = async (
  req: NextRequest,
  context: { params: { path?: string[] } }
) => {
  if (!baseUrl) {
    return NextResponse.json(
      { message: "API base URL is missing." },
      { status: 500 }
    );
  }

  const targetUrl = buildTargetUrl(req, context.params.path);
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
