import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const messages = await prisma.messageContact.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(messages);
}