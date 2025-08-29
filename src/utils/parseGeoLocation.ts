export const parseGeoLocation = (geoStr: string) => {
  try {
    const geo = JSON.parse(geoStr);
    if (!geo || geo.type !== "Point" || !Array.isArray(geo.coordinates) || geo.coordinates.length !== 2) {
      throw new Error("Invalid geolocation format");
    }
    return geo;
  } catch {
    throw new Error("Invalid geolocation JSON");
  }
};
