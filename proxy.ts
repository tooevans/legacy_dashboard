import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { routeAccess, routeMatchers } from './lib/routes';
import { NextRequest, NextResponse } from 'next/server';

const matchers = Object.keys(routeAccess).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccess[route],
}));

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const url = new URL(req.url);

  const role = 
    userId && sessionClaims?.metadata?.role
    ? sessionClaims.metadata.role
    : userId
    ? "patient"
    : "sign-in";

  const matchingRoute = matchers.find(({ matcher }) => matcher(req));

  if (matchingRoute && !matchingRoute.allowedRoles.includes(role)) {
    //redirect to resepcitve pages
    return NextResponse.redirect(new URL(`/${role}`, url.origin));
  }

  //continu if user authorized
  return NextResponse.next();

});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};