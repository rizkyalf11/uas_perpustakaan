import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req: any) {
    // console.log("token", req.nextauth.token);
    let role = req?.nextauth?.token?.role;
    const url: string = req?.nextUrl?.pathname;

    if (url.startsWith("/admin")) {
      if (role != "admin") {
        return NextResponse.redirect(new URL(`/${role}`, req.url));
      } else if ((url == "/login" || url == "register") && role) {
        return NextResponse.redirect(new URL(`/${role}`, req.url));
      } else {
        return NextResponse.next();
      }
    }

    if (url.startsWith("/pustakawan")) {
      if (role != "pustakawan") {
        return NextResponse.redirect(new URL(`/${role}`, req.url));
      } else if ((url == "/login" || url == "register") && role) {
        return NextResponse.redirect(new URL(`/${role}`, req.url));
      } else {
        return NextResponse.next();
      }
    }

    if (url.startsWith("/anggota")) {
      if (role != "anggota") {
        return NextResponse.redirect(new URL(`/${role}`, req.url));
      } else if ((url == "/login" || url == "register") && role) {
        return NextResponse.redirect(new URL(`/${role}`, req.url));
      } else {
        return NextResponse.next();
      }
    }

    return NextResponse.next();
  },
  {
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      authorized: ({ token }) => {
        if (token) return true;
        return false;
      },
    },
    pages: {
      signIn: "/login",
      error: "/api/auth/error",
    },
  },
);

export const config = {
  matcher: [
    "/",
    "/admin",
    "/anggota",
    "/pustakawan",
    "/admin/:path*",
    "/anggota/:path*",
    "/pustakawan/:path*",
    "/login",
  ],
};
