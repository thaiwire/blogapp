import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
     try {
        const pathname = request.nextUrl.pathname;
        const token = request.cookies.get("user_token")?.value;
        
        if (!token && pathname.startsWith("/user")) {
          return NextResponse.redirect(new URL("/login", request.url));
        }
        
        if (token && !pathname.startsWith("/user")) {
          return NextResponse.redirect(new URL("/user/dashboard", request.url));
        }
        return NextResponse.next();    

     } catch (error) {
        return NextResponse.redirect(new URL("/login", request.url)); 
     }

   
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}; 