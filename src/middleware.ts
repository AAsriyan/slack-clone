import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isPublicPage = createRouteMatcher(["/auth"]);

export default convexAuthNextjsMiddleware(async (req, { convexAuth }) => {
  if (!isPublicPage(req) && !(await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(req, "/auth");
  }

  if (isPublicPage(req) && (await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(req, "/");
  }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
