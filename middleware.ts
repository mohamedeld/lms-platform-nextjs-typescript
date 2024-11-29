import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectRoute = createRouteMatcher([
  "/",
]);

export default clerkMiddleware(async (auth, req) => {
  const authObject = await auth(); // Await the auth to get the auth object
  if (isProtectRoute(req)) {
    if (!authObject?.userId) {
      // If the user is not signed in, redirect to the sign-in page
      return authObject.redirectToSignIn();
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};