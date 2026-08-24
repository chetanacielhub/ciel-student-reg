import { NextRequest, NextResponse } from "next/server";
import { getEmpSession } from "@/lib/emp-auth";
import {
  getAttendanceRecords,
  markAttendance,
  AttendanceStatus,
} from "@/lib/emp-store";
import { checkChetanaGeofence } from "@/lib/geo-utils";

export async function GET(req: NextRequest) {
  const session = await getEmpSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const requestedEmpId = searchParams.get("employee_id");
  const date = searchParams.get("date") || undefined;
  const status = searchParams.get("status") || undefined;

  let empFilter = session.id;

  // Employee Admin can view any employee's attendance
  if (session.role === "admin") {
    empFilter = requestedEmpId || undefined!;
  }

  const records = await getAttendanceRecords({
    employee_id: empFilter,
    date,
    status,
  });

  return NextResponse.json({ success: true, data: records });
}

export async function POST(req: NextRequest) {
  const session = await getEmpSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    let status: AttendanceStatus = body.status || "Present";
    const action: "check_in" | "check_out" | "set_status" | "auto_location" = body.action || "set_status";
    const { latitude, longitude, bypassGeofence } = body;

    let geoResult = null;

    // Check geofence if latitude & longitude provided or action is auto_location
    if (typeof latitude === "number" && typeof longitude === "number") {
      geoResult = checkChetanaGeofence(latitude, longitude);

      if (action === "auto_location" || action === "check_in") {
        if (!geoResult.isWithinGeofence && !bypassGeofence) {
          return NextResponse.json(
            {
              success: false,
              isOutsideGeofence: true,
              error: `Location Verification Failed: You are ${geoResult.distanceMeters}m away from Chetana Institute. Auto-attendance requires being within ${geoResult.maxAllowedMeters}m radius.`,
              geofence: geoResult,
            },
            { status: 403 }
          );
        }
        // User is within 200m -> status automatically marked Present
        status = "Present";
      }
    }

    // Record attendance with location metadata
    const record = await markAttendance(
      session.id,
      status,
      action,
      geoResult
        ? {
            lat: geoResult.userLat,
            lng: geoResult.userLng,
            distanceMeters: geoResult.distanceMeters,
            isWithinGeofence: geoResult.isWithinGeofence,
          }
        : undefined
    );

    return NextResponse.json({
      success: true,
      data: record,
      geofence: geoResult,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to record attendance." },
      { status: 500 }
    );
  }
}
