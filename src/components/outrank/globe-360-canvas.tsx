"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  CountryTerritory,
  CONTINENT_POLYGONS,
  WORLD_TERRITORIES,
  STATE_REGIONS,
  CITY_SPACES,
  StateRegion,
  CityVillageSpace,
} from "@/lib/data/countries-territories";
import {
  HOSKOTE_TALUK_DATA,
  HOSKOTE_TALUK_BOUNDARY,
  HOSKOTE_HOBLIS,
  HOSKOTE_VILLAGES,
} from "@/lib/data/hoskote-taluk";
import {
  RotateCw,
  ZoomIn,
  ZoomOut,
  Compass,
  Expand,
  MapPin,
  Maximize2,
  Minimize2,
  Crosshair,
} from "lucide-react";

export type ViewMode = "Map" | "Country" | "Region" | "City";
export type ProjectionType = "3D-Globe" | "2D-Flat";

export interface Globe360CanvasProps {
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  selectedCountry: CountryTerritory;
  onSelectCountry: (country: CountryTerritory) => void;
  selectedRegion: StateRegion | null;
  onSelectRegion: (region: StateRegion) => void;
  selectedCity: CityVillageSpace | null;
  onSelectCity: (city: CityVillageSpace) => void;
  pinnedLocation?: { lat: number; lon: number } | null;
  onPinLocation?: (coords: { lat: number; lon: number }) => void;
  isPinningActive?: boolean;
  expansionPolygon?: [number, number][] | null;
  expansionLevel?: 1 | 2 | 3 | 4;
  showHoskoteBoundary?: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  className?: string;
}

export function Globe360Canvas({
  viewMode,
  onChangeViewMode,
  selectedCountry,
  onSelectCountry,
  selectedRegion,
  onSelectRegion,
  selectedCity,
  onSelectCity,
  pinnedLocation = null,
  onPinLocation,
  isPinningActive = false,
  expansionPolygon = null,
  expansionLevel = 1,
  showHoskoteBoundary = true,
  isFullscreen = false,
  onToggleFullscreen,
  className = "",
}: Globe360CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Projection mode: 3D Globe or 2D Flat Map (Apple Maps style)
  const [projection, setProjection] = useState<ProjectionType>("3D-Globe");

  // Globe orientation in radians: phi = latitude [-pi/2, pi/2], lambda = longitude [-pi, pi]
  const [rotation, setRotation] = useState<{ phi: number; lambda: number }>({
    phi: (selectedCountry.centerLat * Math.PI) / 180,
    lambda: (selectedCountry.centerLon * Math.PI) / 180,
  });

  const [scale, setScale] = useState(1);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const [hoveredEntity, setHoveredEntity] = useState<{
    type: "country" | "region" | "city" | "village" | "pin";
    data: any;
  } | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Interaction tracking refs
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotationStartRef = useRef<{ phi: number; lambda: number }>({ phi: 0, lambda: 0 });
  const velocityRef = useRef<{ dPhi: number; dLambda: number }>({ dPhi: 0, dLambda: 0 });
  const animFrameIdRef = useRef<number | null>(null);
  const targetRotationRef = useRef<{ phi: number; lambda: number; targetScale?: number } | null>(null);
  const pulseAnimRef = useRef<number>(0);

  // Smooth fly to target location when selection changes or when pin is placed
  useEffect(() => {
    let lat = selectedCountry.centerLat;
    let lon = selectedCountry.centerLon;

    if (pinnedLocation) {
      lat = pinnedLocation.lat;
      lon = pinnedLocation.lon;
    } else if (viewMode === "City" && selectedCity) {
      lat = selectedCity.lat;
      lon = selectedCity.lon;
    } else if (viewMode === "Region" && selectedRegion) {
      lat = selectedRegion.centerLat;
      lon = selectedRegion.centerLon;
    }

    targetRotationRef.current = {
      phi: (lat * Math.PI) / 180,
      lambda: (lon * Math.PI) / 180,
    };
  }, [viewMode, selectedCountry, selectedRegion, selectedCity, pinnedLocation]);

  // Handle zoom in / out
  const handleZoom = useCallback((delta: number) => {
    setScale((prev) => Math.min(3.2, Math.max(0.65, prev + delta)));
  }, []);

  // Reset to default orientation
  const handleReset = useCallback(() => {
    targetRotationRef.current = {
      phi: (selectedCountry.centerLat * Math.PI) / 180,
      lambda: (selectedCountry.centerLon * Math.PI) / 180,
    };
    setScale(1);
  }, [selectedCountry]);

  // Fly to Hoskote Taluk quick navigation
  const handleFlyToHoskote = useCallback(() => {
    targetRotationRef.current = {
      phi: (HOSKOTE_TALUK_DATA.center[0] * Math.PI) / 180,
      lambda: (HOSKOTE_TALUK_DATA.center[1] * Math.PI) / 180,
    };
    setScale(2.1);
    const ind = WORLD_TERRITORIES.find((t) => t.id === "IND");
    if (ind) onSelectCountry(ind);
    const ka = STATE_REGIONS.find((r) => r.id === "IN-KA");
    if (ka) onSelectRegion(ka);
    const hos = CITY_SPACES.find((c) => c.id === "city-hoskote");
    if (hos) onSelectCity(hos);
    onChangeViewMode("City");
  }, [onSelectCountry, onSelectRegion, onSelectCity, onChangeViewMode]);

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let localRotation = { ...rotation };

    const render = () => {
      pulseAnimRef.current = (pulseAnimRef.current + 0.04) % (Math.PI * 2);

      // 1. Smoothly interpolate to target rotation if set
      if (targetRotationRef.current) {
        const target = targetRotationRef.current;
        const speed = 0.08;

        let diffLambda = target.lambda - localRotation.lambda;
        while (diffLambda > Math.PI) diffLambda -= 2 * Math.PI;
        while (diffLambda < -Math.PI) diffLambda += 2 * Math.PI;

        const diffPhi = target.phi - localRotation.phi;

        localRotation.lambda += diffLambda * speed;
        localRotation.phi += diffPhi * speed;

        if (Math.abs(diffLambda) < 0.002 && Math.abs(diffPhi) < 0.002) {
          localRotation.lambda = target.lambda;
          localRotation.phi = target.phi;
          targetRotationRef.current = null;
        }
        setRotation({ ...localRotation });
      } else if (isAutoSpinning && !isDraggingRef.current && projection === "3D-Globe") {
        localRotation.lambda += 0.003;
        if (localRotation.lambda > Math.PI) localRotation.lambda -= 2 * Math.PI;
        setRotation({ ...localRotation });
      } else if (!isDraggingRef.current && (Math.abs(velocityRef.current.dLambda) > 0.0001 || Math.abs(velocityRef.current.dPhi) > 0.0001)) {
        localRotation.lambda += velocityRef.current.dLambda;
        localRotation.phi = Math.max(-1.3, Math.min(1.3, localRotation.phi + velocityRef.current.dPhi));
        velocityRef.current.dLambda *= 0.92;
        velocityRef.current.dPhi *= 0.92;
        setRotation({ ...localRotation });
      }

      // Responsive canvas size with device pixel ratio
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width * window.devicePixelRatio || canvas.height !== height * window.devicePixelRatio) {
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
      }

      ctx.save();
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const baseRadius = Math.min(width, height) * 0.42;
      const radius = baseRadius * scale;

      const phi0 = localRotation.phi;
      const lambda0 = localRotation.lambda;

      // Projection mapping: 3D Orthographic vs 2D Flat Map (Apple Maps style)
      const project = (latDeg: number, lonDeg: number): { x: number; y: number; z: number } => {
        const phi = (latDeg * Math.PI) / 180;
        const lambda = (lonDeg * Math.PI) / 180;

        if (projection === "2D-Flat") {
          let deltaLambda = lambda - lambda0;
          while (deltaLambda > Math.PI) deltaLambda -= 2 * Math.PI;
          while (deltaLambda < -Math.PI) deltaLambda += 2 * Math.PI;

          const x = cx + ((deltaLambda) / Math.PI) * (radius * 1.55);
          const y = cy - (phi / (Math.PI / 2)) * (radius * 0.78);
          return { x, y, z: 1 };
        } else {
          // 3D Spherical Orthographic Projection
          const deltaLambda = lambda - lambda0;
          const cosC =
            Math.sin(phi0) * Math.sin(phi) +
            Math.cos(phi0) * Math.cos(phi) * Math.cos(deltaLambda);

          const x = cx + radius * Math.cos(phi) * Math.sin(deltaLambda);
          const y =
            cy -
            radius *
              (Math.cos(phi0) * Math.sin(phi) -
                Math.sin(phi0) * Math.cos(phi) * Math.cos(deltaLambda));

          return { x, y, z: cosC };
        }
      };

      // --- LAYER 1: Deep Dark Apple Maps Slate Canvas Background ---
      ctx.fillStyle = "#121316";
      ctx.fillRect(0, 0, width, height);

      if (projection === "3D-Globe") {
        // Subtle outer atmospheric glow
        const haloGrad = ctx.createRadialGradient(cx, cy, radius * 0.96, cx, cy, radius * 1.12);
        haloGrad.addColorStop(0, "rgba(56, 189, 248, 0.22)");
        haloGrad.addColorStop(0.5, "rgba(30, 41, 59, 0.12)");
        haloGrad.addColorStop(1, "rgba(18, 19, 22, 0)");
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 1.12, 0, Math.PI * 2);
        ctx.fill();

        // Clip inside the 3D sphere
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.clip();

        // Ocean Base: dark muted slate
        ctx.fillStyle = "#15171c";
        ctx.fill();
      } else {
        // 2D Flat Map Border boundary
        ctx.save();
        const mapW = radius * 3.1;
        const mapH = radius * 1.6;
        ctx.beginPath();
        ctx.rect(cx - mapW / 2, cy - mapH / 2, mapW, mapH);
        ctx.clip();

        ctx.fillStyle = "#16181d";
        ctx.fillRect(cx - mapW / 2, cy - mapH / 2, mapW, mapH);
      }

      // --- LAYER 2: Graticule Grid Lines ---
      const parallels = [-60, -30, 0, 30, 60];
      parallels.forEach((lat) => {
        ctx.beginPath();
        let first = true;
        for (let lon = -180; lon <= 180; lon += 4) {
          const pt = project(lat, lon);
          if (pt.z >= -0.05) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        }
        ctx.strokeStyle = lat === 0 ? "rgba(100, 116, 139, 0.25)" : "rgba(71, 85, 105, 0.12)";
        ctx.lineWidth = lat === 0 ? 0.9 : 0.5;
        ctx.stroke();
      });

      for (let lon = -180; lon < 180; lon += 30) {
        ctx.beginPath();
        let first = true;
        for (let lat = -80; lat <= 80; lat += 4) {
          const pt = project(lat, lon);
          if (pt.z >= -0.05) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        }
        ctx.strokeStyle = "rgba(71, 85, 105, 0.12)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // --- LAYER 3: World Continents & Landmass Vector Fills ---
      CONTINENT_POLYGONS.forEach((poly) => {
        ctx.beginPath();
        let anyVisible = false;
        let started = false;

        poly.forEach(([lat, lon]) => {
          const pt = project(lat, lon);
          if (pt.z >= -0.08) {
            anyVisible = true;
            if (!started) {
              ctx.moveTo(pt.x, pt.y);
              started = true;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            started = false;
          }
        });

        if (anyVisible) {
          ctx.fillStyle = "#222a36"; // Muted slate land fill
          ctx.fill();
          ctx.strokeStyle = "#384556"; // Clean exact 0.8px border
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      });

      // --- LAYER 4: Country Territories & Exact Highlight Borders ---
      WORLD_TERRITORIES.forEach((country) => {
        const isSelected = country.id === selectedCountry.id;
        const projectedPoints: { x: number; y: number; z: number }[] = [];
        let visibleCount = 0;

        country.borderPolygon.forEach(([lat, lon]) => {
          const pt = project(lat, lon);
          projectedPoints.push(pt);
          if (pt.z > 0) visibleCount++;
        });

        if (visibleCount >= projectedPoints.length * 0.25) {
          ctx.beginPath();
          let first = true;
          projectedPoints.forEach((pt) => {
            if (pt.z >= -0.05) {
              if (first) {
                ctx.moveTo(pt.x, pt.y);
                first = false;
              } else {
                ctx.lineTo(pt.x, pt.y);
              }
            }
          });
          ctx.closePath();

          if (isSelected) {
            // Radiant sky blue fill and glow matching visual reference
            ctx.fillStyle = "rgba(56, 189, 248, 0.55)";
            ctx.fill();

            ctx.strokeStyle = "#7dd3fc";
            ctx.lineWidth = 2.0;
            ctx.shadowColor = "#38bdf8";
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.shadowBlur = 0;
          } else {
            ctx.fillStyle = "rgba(36, 45, 57, 0.75)";
            ctx.fill();
            ctx.strokeStyle = "#475569";
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });

      // --- LAYER 5: State & Region Borders ---
      if (viewMode === "Region" || viewMode === "City") {
        STATE_REGIONS.forEach((region) => {
          const isSelected = selectedRegion?.id === region.id;
          const projectedPts: { x: number; y: number; z: number }[] = [];
          let visibleCount = 0;

          region.borderPolygon.forEach(([lat, lon]) => {
            const pt = project(lat, lon);
            projectedPts.push(pt);
            if (pt.z > 0) visibleCount++;
          });

          if (visibleCount >= projectedPts.length * 0.3) {
            ctx.beginPath();
            let first = true;
            projectedPts.forEach((pt) => {
              if (pt.z >= -0.05) {
                if (first) {
                  ctx.moveTo(pt.x, pt.y);
                  first = false;
                } else {
                  ctx.lineTo(pt.x, pt.y);
                }
              }
            });
            ctx.closePath();

            if (isSelected) {
              ctx.fillStyle = "rgba(56, 189, 248, 0.30)";
              ctx.fill();
              ctx.strokeStyle = "#38bdf8";
              ctx.lineWidth = 1.6;
              ctx.stroke();
            } else {
              ctx.strokeStyle = "rgba(148, 163, 184, 0.6)";
              ctx.lineWidth = 0.9;
              ctx.setLineDash([3, 4]);
              ctx.stroke();
              ctx.setLineDash([]);
            }
          }
        });
      }

      // --- LAYER 6: VERIFIED HOSKOTE TALUK ADMINISTRATIVE BOUNDARY ---
      // Signature Demonstration Region: 582.84 km²
      const isIndiaOrKarnataka = selectedCountry.id === "IND";
      if (showHoskoteBoundary && isIndiaOrKarnataka) {
        // 1. Draw Hoblis internal boundaries (dashed lines)
        HOSKOTE_HOBLIS.forEach((hobli) => {
          ctx.beginPath();
          let started = false;
          hobli.boundary.forEach(([hLat, hLon]) => {
            const pt = project(hLat, hLon);
            if (pt.z > 0) {
              if (!started) {
                ctx.moveTo(pt.x, pt.y);
                started = true;
              } else {
                ctx.lineTo(pt.x, pt.y);
              }
            }
          });
          ctx.closePath();
          ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
          ctx.lineWidth = 0.8;
          ctx.setLineDash([2, 3]);
          ctx.stroke();
          ctx.setLineDash([]);
        });

        // 2. Draw Verified Outer Boundary of Hoskote Taluk (~582.84 km²)
        ctx.beginPath();
        let startedOuter = false;
        HOSKOTE_TALUK_BOUNDARY.forEach(([bLat, bLon]) => {
          const pt = project(bLat, bLon);
          if (pt.z > 0) {
            if (!startedOuter) {
              ctx.moveTo(pt.x, pt.y);
              startedOuter = true;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          }
        });
        ctx.closePath();

        // High-contrast glowing cyan perimeter
        ctx.fillStyle = "rgba(14, 165, 233, 0.14)";
        ctx.fill();
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2.2;
        ctx.shadowColor = "#0284c7";
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // 3. Draw Hoskote Villages & Hobli HQ nodes
        HOSKOTE_VILLAGES.forEach((v) => {
          const pt = project(v.lat, v.lon);
          if (pt.z > 0) {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, v.type === "Town" ? 4.5 : 3.0, 0, Math.PI * 2);
            ctx.fillStyle = v.status === "Claimed" ? "#38bdf8" : "#10b981";
            ctx.fill();
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1.0;
            ctx.stroke();

            // Label if zoomed in
            if (scale >= 1.6) {
              ctx.font = "bold 8px -apple-system, BlinkMacSystemFont, sans-serif";
              ctx.fillStyle = "#e2e8f0";
              ctx.fillText(v.name, pt.x + 6, pt.y + 3);
            }
          }
        });
      }

      // --- LAYER 7: City & Village Boundaries + Acquired Territories ---
      CITY_SPACES.forEach((city) => {
        const pt = project(city.lat, city.lon);
        if (pt.z > 0) {
          const isSelected = selectedCity?.id === city.id;

          // Expanding territory boundary radius
          const expansionRadiusPx = Math.max(
            12,
            Math.min(65, (city.expansionRadiusKm / 500) * radius * 0.9)
          );

          // 1. Draw Expanding Acquired Territory Outer Wave
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, expansionRadiusPx, 0, Math.PI * 2);
          ctx.fillStyle = isSelected
            ? "rgba(56, 189, 248, 0.28)"
            : "rgba(168, 85, 247, 0.16)";
          ctx.fill();

          ctx.strokeStyle = isSelected ? "#38bdf8" : "rgba(168, 85, 247, 0.7)";
          ctx.lineWidth = isSelected ? 1.8 : 1.0;
          ctx.setLineDash(isSelected ? [4, 4] : []);
          ctx.stroke();
          ctx.setLineDash([]);

          // 2. Exact Local Boundary
          if (city.localBorders && city.localBorders.length > 0) {
            ctx.beginPath();
            let firstB = true;
            city.localBorders.forEach(([bLat, bLon]) => {
              const bPt = project(bLat, bLon);
              if (bPt.z > 0) {
                if (firstB) {
                  ctx.moveTo(bPt.x, bPt.y);
                  firstB = false;
                } else {
                  ctx.lineTo(bPt.x, bPt.y);
                }
              }
            });
            ctx.closePath();
            ctx.strokeStyle = isSelected ? "rgba(56, 189, 248, 0.85)" : "rgba(148, 163, 184, 0.35)";
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }

          // 3. City Pin Node
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, isSelected ? 5.0 : 3.5, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? "#38bdf8" : "#ffffff";
          ctx.fill();
          ctx.strokeStyle = "#0f172a";
          ctx.lineWidth = 1.4;
          ctx.stroke();

          // 4. Label Pill
          if (viewMode === "City" || isSelected) {
            const pillLabel = `${city.name} · ${city.currentHolder} (${city.acquiredAreaKm2} km²)`;
            ctx.font = "bold 9px -apple-system, BlinkMacSystemFont, sans-serif";
            const tw = ctx.measureText(pillLabel).width;

            const px = pt.x - tw / 2 - 4;
            const py = pt.y - 17;

            ctx.fillStyle = isSelected ? "rgba(2, 132, 199, 0.95)" : "rgba(15, 23, 42, 0.85)";
            if (typeof ctx.roundRect === "function") {
              ctx.beginPath();
              ctx.roundRect(px, py, tw + 8, 14, 4);
              ctx.fill();
            } else {
              ctx.fillRect(px, py, tw + 8, 14);
            }

            ctx.strokeStyle = isSelected ? "#ffffff" : "rgba(56, 189, 248, 0.4)";
            ctx.lineWidth = 0.8;
            ctx.stroke();

            ctx.fillStyle = "#ffffff";
            ctx.fillText(pillLabel, px + 4, py + 10);
          }
        }
      });

      // --- LAYER 8: ORGANIC BOUNDARY-AWARE EXPANSION POLYGON ---
      // Signature Pin & Expand Feature
      if (expansionPolygon && expansionPolygon.length > 2) {
        ctx.beginPath();
        let firstPoly = true;
        expansionPolygon.forEach(([polyLat, polyLon]) => {
          const pt = project(polyLat, polyLon);
          if (pt.z > 0) {
            if (firstPoly) {
              ctx.moveTo(pt.x, pt.y);
              firstPoly = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          }
        });
        ctx.closePath();

        // Dynamic fluid glowing border with breathing pulse
        const pulse = 0.25 + 0.15 * Math.sin(pulseAnimRef.current);
        ctx.fillStyle = `rgba(56, 189, 248, ${pulse})`;
        ctx.fill();

        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2.4;
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Inner dashed contour line
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.0;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // --- LAYER 9: PLACED PIN MARKER ---
      if (pinnedLocation) {
        const pinPt = project(pinnedLocation.lat, pinnedLocation.lon);
        if (pinPt.z > 0) {
          // Pulsing radar ripple
          const rippleRadius = 14 + 10 * Math.sin(pulseAnimRef.current);
          ctx.beginPath();
          ctx.arc(pinPt.x, pinPt.y, Math.max(4, rippleRadius), 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(56, 189, 248, 0.7)";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Outer beacon ring
          ctx.beginPath();
          ctx.arc(pinPt.x, pinPt.y, 7, 0, Math.PI * 2);
          ctx.fillStyle = "#38bdf8";
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.stroke();

          // Center dot
          ctx.beginPath();
          ctx.arc(pinPt.x, pinPt.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = "#0f172a";
          ctx.fill();

          // Pin label tooltip pill
          const pinLabel = `PIN: ${pinnedLocation.lat.toFixed(3)}°, ${pinnedLocation.lon.toFixed(3)}° (Lv ${expansionLevel})`;
          ctx.font = "bold 9px monospace";
          const tw = ctx.measureText(pinLabel).width;
          const px = pinPt.x - tw / 2 - 6;
          const py = pinPt.y - 24;

          ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
          if (typeof ctx.roundRect === "function") {
            ctx.beginPath();
            ctx.roundRect(px, py, tw + 12, 16, 4);
            ctx.fill();
          } else {
            ctx.fillRect(px, py, tw + 12, 16);
          }
          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = 1.0;
          ctx.stroke();

          ctx.fillStyle = "#38bdf8";
          ctx.fillText(pinLabel, px + 6, py + 11);
        }
      }

      // --- LAYER 10: 3D Sphere Specular Lighting Mask ---
      if (projection === "3D-Globe") {
        const specGrad = ctx.createRadialGradient(
          cx - radius * 0.45,
          cy - radius * 0.45,
          radius * 0.05,
          cx,
          cy,
          radius
        );
        specGrad.addColorStop(0, "rgba(255, 255, 255, 0.1)");
        specGrad.addColorStop(0.5, "rgba(255, 255, 255, 0)");
        specGrad.addColorStop(0.85, "rgba(5, 7, 10, 0.35)");
        specGrad.addColorStop(1, "rgba(2, 3, 5, 0.7)");

        ctx.fillStyle = specGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        // Rim highlight
        ctx.strokeStyle = "rgba(125, 211, 252, 0.4)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(cx, cy, radius - 1, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore(); // Restore clip
      ctx.restore();

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [
    rotation,
    scale,
    isAutoSpinning,
    projection,
    viewMode,
    selectedCountry,
    selectedRegion,
    selectedCity,
    pinnedLocation,
    expansionPolygon,
    expansionLevel,
    showHoskoteBoundary,
  ]);

  // Inverse projection: convert canvas screen coordinate (x, y) to spherical (lat, lon)
  const unproject = useCallback(
    (x: number, y: number): { lat: number; lon: number } | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const cx = width / 2;
      const cy = height / 2;
      const baseRadius = Math.min(width, height) * 0.42;
      const radius = baseRadius * scale;
      const phi0 = rotation.phi;
      const lambda0 = rotation.lambda;

      if (projection === "2D-Flat") {
        const deltaLambda = ((x - cx) / (radius * 1.55)) * Math.PI;
        let lon = ((lambda0 + deltaLambda) * 180) / Math.PI;
        while (lon > 180) lon -= 360;
        while (lon < -180) lon += 360;
        const lat = ((cy - y) / (radius * 0.78)) * 90;
        if (lat >= -85 && lat <= 85) {
          return { lat, lon };
        }
        return null;
      } else {
        // 3D Orthographic Inverse
        const dx = (x - cx) / radius;
        const dy = (cy - y) / radius;
        const rho = Math.hypot(dx, dy);
        if (rho > 1.0) return null; // Outside globe sphere

        const c = Math.asin(rho);
        const sinC = Math.sin(c);
        const cosC = Math.cos(c);

        const sinPhi = cosC * Math.sin(phi0) + (dy * sinC * Math.cos(phi0)) / (rho || 1);
        const phi = Math.asin(Math.max(-1, Math.min(1, sinPhi)));

        const cosPhiSinDelta = (dx * sinC) / (rho || 1);
        const cosPhiCosDelta = cosC * Math.cos(phi0) - (dy * sinC * Math.sin(phi0)) / (rho || 1);
        const deltaLambda = Math.atan2(cosPhiSinDelta, cosPhiCosDelta);

        let lambda = lambda0 + deltaLambda;
        let lon = (lambda * 180) / Math.PI;
        while (lon > 180) lon -= 360;
        while (lon < -180) lon += 360;
        const lat = (phi * 180) / Math.PI;

        return { lat, lon };
      }
    },
    [projection, rotation, scale]
  );

  // Pointer drag interactions
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    rotationStartRef.current = { ...rotation };
    velocityRef.current = { dPhi: 0, dLambda: 0 };
    targetRotationRef.current = null;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x: e.clientX, y: e.clientY });

    if (isDraggingRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;

      const sensitivity = 0.0055 / scale;
      const newLambda = rotationStartRef.current.lambda + dx * sensitivity;
      const newPhi = Math.max(
        -1.3,
        Math.min(1.3, rotationStartRef.current.phi - dy * sensitivity)
      );

      velocityRef.current = {
        dLambda: (newLambda - rotation.lambda) * 0.35,
        dPhi: (newPhi - rotation.phi) * 0.35,
      };

      setRotation({ phi: newPhi, lambda: newLambda });
    } else {
      // Hover detection across Villages, Cities, Regions, and Countries
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.42 * scale;
      const phi0 = rotation.phi;
      const lambda0 = rotation.lambda;

      let matched: { type: "country" | "region" | "city" | "village" | "pin"; data: any } | null = null;

      // Check Hoskote Villages first if zoomed in
      if (showHoskoteBoundary && selectedCountry.id === "IND") {
        for (const v of HOSKOTE_VILLAGES) {
          const phi = (v.lat * Math.PI) / 180;
          const lambda = (v.lon * Math.PI) / 180;
          const deltaLambda = lambda - lambda0;
          const cosC =
            Math.sin(phi0) * Math.sin(phi) +
            Math.cos(phi0) * Math.cos(phi) * Math.cos(deltaLambda);

          if (cosC > 0) {
            const px = cx + radius * Math.cos(phi) * Math.sin(deltaLambda);
            const py =
              cy -
              radius *
                (Math.cos(phi0) * Math.sin(phi) -
                  Math.sin(phi0) * Math.cos(phi) * Math.cos(deltaLambda));

            if (Math.hypot(px - x, py - y) < 14) {
              matched = { type: "village", data: v };
              break;
            }
          }
        }
      }

      // Check Cities
      if (!matched) {
        for (const city of CITY_SPACES) {
          const phi = (city.lat * Math.PI) / 180;
          const lambda = (city.lon * Math.PI) / 180;
          const deltaLambda = lambda - lambda0;
          const cosC =
            Math.sin(phi0) * Math.sin(phi) +
            Math.cos(phi0) * Math.cos(phi) * Math.cos(deltaLambda);

          if (cosC > 0) {
            const px = cx + radius * Math.cos(phi) * Math.sin(deltaLambda);
            const py =
              cy -
              radius *
                (Math.cos(phi0) * Math.sin(phi) -
                  Math.sin(phi0) * Math.cos(phi) * Math.cos(deltaLambda));

            if (Math.hypot(px - x, py - y) < 18) {
              matched = { type: "city", data: city };
              break;
            }
          }
        }
      }

      // Check Regions
      if (!matched && (viewMode === "Region" || viewMode === "City")) {
        for (const reg of STATE_REGIONS) {
          const phi = (reg.centerLat * Math.PI) / 180;
          const lambda = (reg.centerLon * Math.PI) / 180;
          const deltaLambda = lambda - lambda0;
          const cosC =
            Math.sin(phi0) * Math.sin(phi) +
            Math.cos(phi0) * Math.cos(phi) * Math.cos(deltaLambda);

          if (cosC > 0) {
            const px = cx + radius * Math.cos(phi) * Math.sin(deltaLambda);
            const py =
              cy -
              radius *
                (Math.cos(phi0) * Math.sin(phi) -
                  Math.sin(phi0) * Math.cos(phi) * Math.cos(deltaLambda));

            if (Math.hypot(px - x, py - y) < 24) {
              matched = { type: "region", data: reg };
              break;
            }
          }
        }
      }

      // Check Countries
      if (!matched) {
        for (const country of WORLD_TERRITORIES) {
          const phi = (country.centerLat * Math.PI) / 180;
          const lambda = (country.centerLon * Math.PI) / 180;
          const deltaLambda = lambda - lambda0;
          const cosC =
            Math.sin(phi0) * Math.sin(phi) +
            Math.cos(phi0) * Math.cos(phi) * Math.cos(deltaLambda);

          if (cosC > 0) {
            const px = cx + radius * Math.cos(phi) * Math.sin(deltaLambda);
            const py =
              cy -
              radius *
                (Math.cos(phi0) * Math.sin(phi) -
                  Math.sin(phi0) * Math.cos(phi) * Math.cos(deltaLambda));

            if (Math.hypot(px - x, py - y) < 26) {
              matched = { type: "country", data: country };
              break;
            }
          }
        }
      }

      setHoveredEntity(matched);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const wasDragging = isDraggingRef.current;
    isDraggingRef.current = false;

    // If drag was negligible, interpret as click
    const dx = Math.abs(e.clientX - dragStartRef.current.x);
    const dy = Math.abs(e.clientY - dragStartRef.current.y);

    if (wasDragging && dx < 5 && dy < 5) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // If Pinning Mode is active, drop pin at unprojected coordinates
      if (isPinningActive && onPinLocation) {
        const coords = unproject(x, y);
        if (coords) {
          onPinLocation(coords);
          return;
        }
      }

      // Otherwise select hovered entity
      if (hoveredEntity) {
        if (hoveredEntity.type === "village") {
          const v = hoveredEntity.data;
          if (onPinLocation) {
            onPinLocation({ lat: v.lat, lon: v.lon });
          }
        } else if (hoveredEntity.type === "city") {
          onSelectCity(hoveredEntity.data as CityVillageSpace);
        } else if (hoveredEntity.type === "region") {
          onSelectRegion(hoveredEntity.data as StateRegion);
        } else if (hoveredEntity.type === "country") {
          onSelectCountry(hoveredEntity.data as CountryTerritory);
        }
      }
    }
  };

  return (
    <div className={`relative w-full h-full select-none overflow-hidden bg-[#121316] ${className}`}>
      {/* TOP-LEFT CAPSULE SWITCHER: [ Map | Country | Region | City ] */}
      <div className="absolute top-4 left-4 z-30">
        <div className="inline-flex items-center p-1 rounded-2xl bg-[#1c1d22]/90 backdrop-blur-md border border-white/10 shadow-2xl">
          {(["Map", "Country", "Region", "City"] as ViewMode[]).map((mode) => {
            const isActive = viewMode === mode;
            return (
              <button
                key={mode}
                onClick={() => onChangeViewMode(mode)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#2b2d35] text-white shadow-sm border border-white/10"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {mode}
              </button>
            );
          })}
        </div>
      </div>

      {/* Top-Right HUD Controls: Hoskote Shortcut, 3D/2D Toggle, Zoom, Fullscreen */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-30">
        {/* Fly to Hoskote Demonstration Region Action */}
        <button
          onClick={handleFlyToHoskote}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-sky-950/80 hover:bg-sky-900 border border-[#38bdf8]/40 text-[#38bdf8] text-[11px] font-bold shadow-lg shadow-sky-500/10 transition-all active:scale-95"
          title="Fly to Hoskote Taluk Demonstration Region (~582.84 km²)"
        >
          <Crosshair className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Hoskote Taluk</span>
        </button>

        {/* 3D Globe vs 2D Flat Map Toggle */}
        <div className="flex items-center p-1 rounded-2xl bg-[#1c1d22]/90 backdrop-blur-md border border-white/10">
          <button
            onClick={() => setProjection("3D-Globe")}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
              projection === "3D-Globe"
                ? "bg-[#38bdf8] text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            360° Globe
          </button>
          <button
            onClick={() => setProjection("2D-Flat")}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
              projection === "2D-Flat"
                ? "bg-[#38bdf8] text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            2D Map
          </button>
        </div>

        {/* Zoom & Camera Controls */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#1c1d22]/90 backdrop-blur-md border border-white/10">
          <button
            onClick={() => handleZoom(0.2)}
            className="w-7 h-7 rounded-lg text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleZoom(-0.2)}
            className="w-7 h-7 rounded-lg text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsAutoSpinning((prev) => !prev)}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
              isAutoSpinning ? "text-[#38bdf8]" : "text-slate-400 hover:text-white"
            }`}
            title="Auto-Spin 360°"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoSpinning ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleReset}
            className="w-7 h-7 rounded-lg text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            title="Center View"
          >
            <Compass className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mandatory Fullscreen Toggle Icon with Tooltip */}
        {onToggleFullscreen ? (
          <button
            onClick={onToggleFullscreen}
            className="group relative flex items-center justify-center w-8 h-8 rounded-2xl bg-[#1c1d22]/90 hover:bg-[#282a32] backdrop-blur-md border border-white/10 text-slate-300 hover:text-white transition-all shadow-md active:scale-95"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-[#38bdf8]" />
            ) : (
              <Maximize2 className="w-4 h-4 text-slate-300 group-hover:text-white" />
            )}
            {/* Custom Tooltip */}
            <span className="absolute -bottom-8 right-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-50">
              {isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            </span>
          </button>
        ) : null}
      </div>

      {/* Main Interactive Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => {
          isDraggingRef.current = false;
          setHoveredEntity(null);
          setMousePos(null);
        }}
        className={`w-full h-full touch-none block ${
          isPinningActive ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing"
        }`}
      />

      {/* Hover Callout Tooltip */}
      {hoveredEntity && mousePos ? (
        <div
          className="fixed pointer-events-none z-50 px-3.5 py-2 rounded-2xl bg-[#1a1d24]/95 border border-[#38bdf8]/40 shadow-2xl backdrop-blur-md text-xs -translate-x-1/2 -translate-y-full mb-3"
          style={{ left: mousePos.x, top: mousePos.y - 12 }}
        >
          <div className="flex items-center gap-2 font-bold text-white">
            <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-ping" />
            <span>{hoveredEntity.data.name}</span>
            <span className="text-[10px] text-slate-400 font-mono uppercase">
              {hoveredEntity.type}
            </span>
          </div>

          {"population" in hoveredEntity.data ? (
            <div className="text-[10px] text-slate-400 mt-0.5">
              Pop: {hoveredEntity.data.population.toLocaleString()} · Status:{" "}
              <strong className={hoveredEntity.data.status === "Claimed" ? "text-sky-400" : "text-emerald-400"}>
                {hoveredEntity.data.status}
              </strong>
            </div>
          ) : null}

          {"acquiredAreaKm2" in hoveredEntity.data ? (
            <div className="mt-1 text-[11px] text-sky-300 flex items-center gap-1.5">
              <Expand className="w-3 h-3 text-[#38bdf8]" />
              <span>
                Acquired: {hoveredEntity.data.acquiredAreaKm2.toLocaleString()} km²
              </span>
            </div>
          ) : null}

          {"currentHolder" in hoveredEntity.data ? (
            <div className="text-[10px] text-slate-300 mt-0.5">
              Space Leader: <strong className="text-white">{hoveredEntity.data.currentHolder}</strong>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
