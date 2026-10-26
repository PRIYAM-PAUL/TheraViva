/**
 * W3C Change Password URL, served at /.well-known/change-password.
 *
 * This site has no user accounts, so password managers and browsers that probe
 * this path are redirected to the contact page, where a visitor can reach the
 * practice directly. Update the target if account management is added later.
 */
export function GET(request: Request): Response {
  const target = new URL("/contact", request.url);
  return Response.redirect(target, 302);
}
