const groundTruth = [
  { name: "United States (Center)", code: "US", lat: 38.0, lon: -97.0, targetX: 200, targetY: 160 },
  { name: "United States (NY)", code: "US_NY", lat: 40.7, lon: -74.0, targetX: 245, targetY: 153 },
  { name: "United States (LA)", code: "US_LA", lat: 34.0, lon: -118.2, targetX: 145, targetY: 172 },
  { name: "Canada (Ottawa/Toronto)", code: "CA", lat: 44.5, lon: -77.5, targetX: 240, targetY: 140 },
  { name: "Mexico (Mexico City)", code: "MX", lat: 19.4, lon: -99.1, targetX: 195, targetY: 220 },
  { name: "Brazil (Brasilia)", code: "BR", lat: -15.8, lon: -47.9, targetX: 320, targetY: 300 },
  { name: "Argentina (Buenos Aires)", code: "AR", lat: -34.6, lon: -58.4, targetX: 300, targetY: 360 },
  { name: "United Kingdom (London)", code: "GB", lat: 51.5, lon: -0.1, targetX: 452, targetY: 118 },
  { name: "France (Paris)", code: "FR", lat: 48.8, lon: 2.3, targetX: 458, targetY: 129 },
  { name: "Germany (Berlin)", code: "DE", lat: 52.5, lon: 13.4, targetX: 485, targetY: 118 },
  { name: "Italy (Rome)", code: "IT", lat: 41.9, lon: 12.5, targetX: 485, targetY: 153 },
  { name: "Russia (Moscow)", code: "RU", lat: 55.7, lon: 37.6, targetX: 540, targetY: 110 },
  { name: "Egypt (Cairo)", code: "EG", lat: 30.0, lon: 31.2, targetX: 526, targetY: 194 },
  { name: "Nigeria (Lagos)", code: "NG", lat: 6.5, lon: 3.4, targetX: 462, targetY: 250 },
  { name: "South Africa (Johannesburg)", code: "ZA", lat: -26.2, lon: 28.0, targetX: 512, targetY: 346 },
  { name: "Saudi Arabia (Riyadh)", code: "SA", lat: 24.7, lon: 46.7, targetX: 565, targetY: 210 },
  { name: "UAE (Dubai)", code: "AE", lat: 25.2, lon: 55.3, targetX: 583, targetY: 211 },
  { name: "India (Delhi)", code: "IN_DEL", lat: 28.6, lon: 77.2, targetX: 645, targetY: 198 },
  { name: "India (Center / Nagpur)", code: "IN", lat: 20.6, lon: 79.0, targetX: 651, targetY: 220 },
  { name: "India (Bengaluru)", code: "IN_BLR", lat: 12.9, lon: 77.6, targetX: 650, targetY: 242 },
  { name: "China (Beijing)", code: "CN", lat: 39.9, lon: 116.4, targetX: 745, targetY: 155 },
  { name: "China (Shanghai)", code: "CN_SH", lat: 31.2, lon: 121.5, targetX: 755, targetY: 180 },
  { name: "Japan (Tokyo)", code: "JP", lat: 35.7, lon: 139.7, targetX: 826, targetY: 160 },
  { name: "South Korea (Seoul)", code: "KR", lat: 37.5, lon: 127.0, targetX: 775, targetY: 160 },
  { name: "Indonesia (Jakarta)", code: "ID", lat: -6.2, lon: 106.8, targetX: 725, targetY: 275 },
  { name: "Australia (Sydney)", code: "AU_SYD", lat: -33.8, lon: 151.2, targetX: 835, targetY: 366 },
  { name: "Australia (Center)", code: "AU", lat: -25.0, lon: 134.0, targetX: 785, targetY: 335 },
  { name: "New Zealand (Auckland)", code: "NZ", lat: -36.8, lon: 174.7, targetX: 895, targetY: 375 },
];

function projectRefined(lat: number, lon: number): [number, number] {
  // Longitude: Greenwich is at 455
  let x = 455 + lon * 2.48;

  // Western hemisphere slight shift in NASA cylindrical composite
  if (lon < -10) {
    x -= 16;
  } else if (lon > 130) {
    // East Asia / Japan / Pacific slight rightward expansion
    x += 16 * ((lon - 130) / 45);
  }

  // Latitude:
  const rad = (lat * Math.PI) / 180;
  const miller = Math.log(Math.tan(Math.PI / 4 + 0.4 * rad));
  let y = 258 - 175 * miller;

  // Southern Hemisphere slight expansion for Southern Ocean/Antarctica
  if (lat < 0) {
    y += Math.abs(lat) * 0.55;
  } else if (lat > 15 && lat < 35) {
    // Subtropical Northern Hemisphere (India, Egypt, Arabia) calibration
    y += 11;
  }

  return [x, y];
}

let totalErrX = 0;
let totalErrY = 0;

for (const g of groundTruth) {
  const [px, py] = projectRefined(g.lat, g.lon);
  const errX = px - g.targetX;
  const errY = py - g.targetY;
  totalErrX += Math.abs(errX);
  totalErrY += Math.abs(errY);
  console.log(
    g.name.padEnd(28),
    `Target: [${g.targetX}, ${g.targetY}]`,
    `Proj: [${Math.round(px)}, ${Math.round(py)}]`,
    `Diff: [${Math.round(errX)}, ${Math.round(errY)}]`
  );
}

console.log(`\nRefined Average Error: X: ${(totalErrX / groundTruth.length).toFixed(1)}px, Y: ${(totalErrY / groundTruth.length).toFixed(1)}px`);
