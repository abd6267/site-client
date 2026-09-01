import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const estConnecte = !!req.auth;
  const role = req.auth?.user?.role;

  if (nextUrl.pathname === "/admin/connexion") {
    return NextResponse.next();
  }

  const estRouteAdmin = nextUrl.pathname.startsWith("/admin");
  const estRouteEntreprise =
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/cvtheque") ||
    nextUrl.pathname.startsWith("/profil") ||
    nextUrl.pathname.startsWith("/abonnement");

  if (estRouteAdmin && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/admin/connexion", nextUrl));
  }

  if (estRouteEntreprise && !estConnecte) {
    return NextResponse.redirect(new URL("/connexion", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/cvtheque/:path*", "/profil/:path*", "/abonnement/:path*", "/admin/:path*"],
};