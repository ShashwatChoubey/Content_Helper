import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Minimal middleware - no heavy imports
export function middleware(request: NextRequest) {
    // Just pass through - we'll handle auth in layouts
    return NextResponse.next();
}

export const config = {
    matcher: ["/app/:path*"],
};
