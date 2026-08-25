import { NextResponse } from "next/server";
import { checkChetanaGeofence, CHETANA_CAMPUS_COORDS } from "@/lib/geo-utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { latitude, longitude } = body;

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return NextResponse.json(
        { success: false, error: "Valid latitude and longitude coordinates are required for campus geofence verification." },
        { status: 400 }
      );
    }

    const geoResult = checkChetanaGeofence(latitude, longitude);

    return NextResponse.json({
      success: true,
      ...geoResult,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify geolocation." },
      { status: 500 }
    );
  }
}
