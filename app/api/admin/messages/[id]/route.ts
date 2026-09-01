import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  const statutsValides = ["NON_LU", "LU", "ARCHIVE"];
  if (!statutsValides.includes(body.statut)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const message = await prisma.messageContact.update({
    where: { id },
    data: { statut: body.statut },
  });

  return NextResponse.json(message);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const { id } = await params;
  await prisma.messageContact.delete({ where: { id } });

  return NextResponse.json({ success: true });
}