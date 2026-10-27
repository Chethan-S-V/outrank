import sharp from "sharp";

async function run() {
  const img = sharp("public/images/earth-night-map.jpg");
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

  function getBrightness(px: number, py: number) {
    if (px < 0 || px >= w || py < 0 || py >= h) return 0;
    const idx = (py * w + px) * 3;
    return (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
  }

  function findPeak(minX: number, maxX: number, minY: number, maxY: number) {
    let bestB = -1;
    let bx = minX, by = minY;
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const b = getBrightness(x, y);
        if (b > bestB) {
          bestB = b;
          bx = x;
          by = y;
        }
      }
    }
    return { x: bx, y: by, b: bestB, svgX: Math.round((bx / w) * 1000), svgY: Math.round((by / h) * 500) };
  }

  console.log("London area:", findPeak(420, 480, 100, 140));
  console.log("India area (Delhi/Ganges/Nagpur):", findPeak(630, 700, 190, 250));
  console.log("US East (New York/DC):", findPeak(240, 310, 140, 190));
  console.log("US Midwest/Center:", findPeak(180, 240, 140, 200));
  console.log("Japan (Tokyo):", findPeak(800, 870, 140, 190));
  console.log("Australia (Sydney):", findPeak(780, 870, 340, 410));
  console.log("Moscow (European Russia):", findPeak(530, 600, 90, 130));
  console.log("Central Russia / Siberia:", findPeak(680, 780, 80, 160));
}

run();
