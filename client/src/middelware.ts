import { NextResponse } from "next/server";

export function middleware(request) {
  const country = request.geo?.country;

  if (!["US", "CA", "IN"].includes(country)) {
    return new NextResponse("Access Restricted");
  }

  return NextResponse.next();
}