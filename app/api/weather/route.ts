"use server";

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json({ error: "Ingen stad angiven" }, { status: 400 });
  }

  try {
    const apiKey = process.env.OPENWEATHER_KEY;
    console.log("API key:", apiKey);
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric&lang=sv`
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Stad hittades inte" },
        { status: 404 }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      city: data.name,
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Kunde inte hämta väder just nu" },
      { status: 500 }
    );
  }
}
