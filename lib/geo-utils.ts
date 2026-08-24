/**
 * Geofencing & Distance Utilities for Chetana Institute of Management and Research (CIMR / CIEL)
 */

export const CHETANA_CAMPUS_POINTS = [
  { name: "Chetana Main Campus", lat: 19.0618, lng: 72.8532 },
  { name: "CIMR Management Building", lat: 19.0628, lng: 72.8546 },
  { name: "Chetana College Gate", lat: 19.0612, lng: 72.8522 },
  { name: "Bandra East Educational Complex", lat: 19.0620, lng: 72.8538 },
];

export const CHETANA_CAMPUS_COORDS = {
  lat: parseFloat(process.env.CHETANA_CAMPUS_LAT || "19.0618"),
  lng: parseFloat(process.env.CHETANA_CAMPUS_LNG || "72.8532"),
  // Expanded radius to 500m to account for indoor Wi-Fi & GPS positioning accuracy on laptops/mobiles
  radiusMeters: parseFloat(process.env.CHETANA_GEOFENCE_RADIUS_METERS || "500"),
  campusName: "Chetana Institute of Management and Research",
};

/**
 * Calculates distance between two GPS coordinates using the Haversine formula.
 * Returns distance in meters.
 */
export function calculateHaversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number = CHETANA_CAMPUS_COORDS.lat,
  lon2: number = CHETANA_CAMPUS_COORDS.lng
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10;
}

/**
 * Verifies if user coordinates are within the Chetana Institute geofence.
 * Calculates distance against all campus reference points for maximum accuracy.
 */
export function checkChetanaGeofence(userLat: number, userLng: number) {
  // Calculate distance to all known Chetana campus points
  const distances = CHETANA_CAMPUS_POINTS.map((pt) => ({
    name: pt.name,
    distanceMeters: calculateHaversineDistanceMeters(userLat, userLng, pt.lat, pt.lng),
  }));

  // Find shortest distance to any part of Chetana Campus
  distances.sort((a, b) => a.distanceMeters - b.distanceMeters);
  const closestPoint = distances[0];
  const distanceMeters = closestPoint.distanceMeters;

  const maxAllowedMeters = CHETANA_CAMPUS_COORDS.radiusMeters;
  const isWithinGeofence = distanceMeters <= maxAllowedMeters;

  return {
    userLat,
    userLng,
    distanceMeters,
    closestCampusArea: closestPoint.name,
    isWithinGeofence,
    maxAllowedMeters,
    campusName: CHETANA_CAMPUS_COORDS.campusName,
    campusLat: CHETANA_CAMPUS_COORDS.lat,
    campusLng: CHETANA_CAMPUS_COORDS.lng,
  };
}
