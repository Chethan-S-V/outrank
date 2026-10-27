import sharp from "sharp";

async function main() {
  const image = sharp("public/images/earth-night-map.jpg");
  const metadata = await image.metadata();
  console.log("Image Metadata:", { width: metadata.width, height: metadata.height });

  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const W = info.width;
  const H = info.height;

  function getBrightestCenter(minX: number, maxX: number, minY: number, maxY: number) {
    let sumX = 0;
    let sumY = 0;
    let totalWeight = 0;

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const idx = (y * W + x) * info.channels;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const brightness = (r + g + b) / 3;

        if (brightness > 60) {
          const weight = Math.pow(brightness, 2);
          sumX += x * weight;
          sumY += y * weight;
          totalWeight += weight;
        }
      }
    }

    if (totalWeight === 0) return null;
    return {
      pixelX: Math.round(sumX / totalWeight),
      pixelY: Math.round(sumY / totalWeight),
      svgX: Math.round(((sumX / totalWeight) / W) * 1000),
      svgY: Math.round(((sumY / totalWeight) / H) * 500),
    };
  }

  console.log("India Subcontinent:", getBrightestCenter(630, 720, 180, 270));
  console.log("USA East:", getBrightestCenter(180, 280, 130, 200));
  console.log("USA West Coast:", getBrightestCenter(110, 160, 140, 200));
  console.log("UK / London:", getBrightestCenter(445, 475, 95, 135));
  console.log("France / Paris:", getBrightestCenter(455, 480, 120, 150));
  console.log("Japan / Tokyo:", getBrightestCenter(820, 865, 140, 185));
  console.log("Australia East:", getBrightestCenter(780, 880, 330, 400));
  console.log("South Africa:", getBrightestCenter(490, 535, 330, 385));
  console.log("Egypt / Cairo:", getBrightestCenter(525, 555, 185, 225));
  console.log("Brazil East:", getBrightestCenter(305, 360, 290, 360));
  console.log("UAE / Dubai:", getBrightestCenter(580, 610, 205, 235));
}

main().catch(console.error);
