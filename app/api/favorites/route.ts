"use server";

import { db } from "@/prisma/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const favorites = await db.favoriteCity.findMany();
    return NextResponse.json(favorites);
  } catch (err) {
    return NextResponse.json(
      { error: "Kunde inte hämta favoriter" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const favorite = await db.favoriteCity.create({ data });
    return NextResponse.json(favorite);
  } catch (err) {
    return NextResponse.json(
      { error: "Kunde inte spara favorit" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    if (!city)
      return NextResponse.json(
        { error: "Ingen stad angiven" },
        { status: 400 }
      );

    await db.favoriteCity.deleteMany({ where: { city } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Kunde inte ta bort favorit" },
      { status: 500 }
    );
  }
}
