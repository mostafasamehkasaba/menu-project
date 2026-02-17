import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteParams = {
  params: {
    path?: string[];
  } | Promise<{
    path?: string[];
  }>;
};

const getTargetUrl = (request: NextRequest, params: { path?: string[] }) => {
  const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  const trimmedBaseUrl = rawBaseUrl.replace(/\/+$/, "");
  const baseUrl = trimmedBaseUrl.endsWith("/api")
    ? trimmedBaseUrl.slice(0, -4)
    : trimmedBaseUrl;
  if (!baseUrl) {
    return null;
  }
  const path = params.path?.join("/") ?? "";
  const normalizedPath = path.replace(/\/+$/, "");
  const search = request.nextUrl.search;
  const slash = normalizedPath ? "/" : "";
  return `${baseUrl}/${normalizedPath}${slash}${search}`;
};

const forward = async (request: NextRequest, context: RouteParams) => {
  const params = await context.params;
  const targetUrl = getTargetUrl(request, params);
  if (!targetUrl) {
    return NextResponse.json(
      { detail: "API base URL is missing." },
      { status: 500 }
    );
  }

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("connection");
  headers.delete("content-length");

  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.arrayBuffer();

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: body && body.byteLength ? body : undefined,
  });

  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("transfer-encoding");

  return new NextResponse(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
};

export async function GET(request: NextRequest, params: RouteParams) {
  return forward(request, params);
}

export async function POST(request: NextRequest, params: RouteParams) {
  return forward(request, params);
}

export async function PUT(request: NextRequest, params: RouteParams) {
  return forward(request, params);
}

export async function PATCH(request: NextRequest, params: RouteParams) {
  return forward(request, params);
}

export async function DELETE(request: NextRequest, params: RouteParams) {
  return forward(request, params);
}

export async function OPTIONS(request: NextRequest, params: RouteParams) {
  return forward(request, params);
}
