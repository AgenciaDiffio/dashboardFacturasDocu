import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/verify-auth";

const protectedRoutes = ["/", "/dashboard", "/perfil", "/facturas"];

export async function proxy(req: Request) {
  const url = new URL(req.url);
  const path = url.pathname;

  if (!protectedRoutes.includes(path)) return NextResponse.next();

  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.redirect("/login");

  try {
    await verifyAuth(token);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect("/login");
  }
}
