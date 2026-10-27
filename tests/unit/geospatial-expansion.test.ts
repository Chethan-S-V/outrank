import { describe, expect, it } from "vitest";
import {
  HOSKOTE_TALUK_DATA,
  HOSKOTE_TALUK_BOUNDARY,
  HOSKOTE_HOBLIS,
  HOSKOTE_VILLAGES,
  isPointInPolygon,
  geodesicDistanceKm,
  calculatePolygonAreaKm2,
  generateOrganicExpansionPolygon,
} from "@/lib/data/hoskote-taluk";

describe("Geospatial & Hoskote Taluk Organic Expansion Engine", () => {
  it("contains verified Hoskote Taluk administrative data", () => {
    expect(HOSKOTE_TALUK_DATA.talukName).toBe("Hoskote Taluk");
    expect(HOSKOTE_TALUK_DATA.district).toBe("Bengaluru Rural");
    expect(HOSKOTE_TALUK_DATA.totalAreaKm2).toBe(582.84);
    expect(HOSKOTE_TALUK_BOUNDARY.length).toBeGreaterThan(15);
    expect(HOSKOTE_HOBLIS.length).toBe(5);
    expect(HOSKOTE_VILLAGES.length).toBeGreaterThan(10);
  });

  it("calculates geodesic distance accurately", () => {
    // Hoskote Town to Sulibele is approx 9-10 km
    const dist = geodesicDistanceKm(13.0708, 77.7981, 13.1482, 77.8286);
    expect(dist).toBeGreaterThan(8);
    expect(dist).toBeLessThan(12);
  });

  it("detects whether a coordinate is inside the boundary polygon", () => {
    // Center of Hoskote Town is inside
    const insideCenter = isPointInPolygon([13.0716, 77.7983], HOSKOTE_TALUK_BOUNDARY);
    expect(insideCenter).toBe(true);

    // Far away point (e.g. Mumbai or Delhi) is outside
    const outsideFar = isPointInPolygon([19.0760, 72.8777], HOSKOTE_TALUK_BOUNDARY);
    expect(outsideFar).toBe(false);
  });

  it("calculates polygon area in square kilometers", () => {
    const area = calculatePolygonAreaKm2(HOSKOTE_TALUK_BOUNDARY);
    // Calculated spherical area should be around ~580 km²
    expect(area).toBeGreaterThan(450);
    expect(area).toBeLessThan(700);
  });

  it("generates organic boundary-aware expansion for Levels 1 to 4", () => {
    const centerLat = 13.0716;
    const centerLon = 77.7983;

    const lv1 = generateOrganicExpansionPolygon({ centerLat, centerLon, level: 1 });
    const lv2 = generateOrganicExpansionPolygon({ centerLat, centerLon, level: 2 });
    const lv3 = generateOrganicExpansionPolygon({ centerLat, centerLon, level: 3 });
    const lv4 = generateOrganicExpansionPolygon({ centerLat, centerLon, level: 4 });

    // Ensure progressively growing area
    expect(lv1.areaKm2).toBeLessThan(lv2.areaKm2);
    expect(lv2.areaKm2).toBeLessThan(lv3.areaKm2);
    expect(lv3.areaKm2).toBeLessThan(lv4.areaKm2);

    // Ensure metrics are populated correctly
    expect(lv2.areaHectares).toBe(Math.round(lv2.areaKm2 * 100));
    expect(lv2.areaSqMeters).toBe(Math.round(lv2.areaKm2 * 1000000));
    expect(lv2.percentageOfTaluk).toBeGreaterThan(0);
    expect(lv2.percentageOfTaluk).toBeLessThanOrEqual(100);
    expect(lv2.polygon.length).toBeGreaterThan(30);
  });
});
