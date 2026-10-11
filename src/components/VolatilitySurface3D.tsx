import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import {
  generateVolatilitySurface,
  VolatilityPoint,
  SkewRegime,
  VolatilitySurfaceData,
} from '../utils/blackScholes';
import { StockData } from '../types/stock';
import {
  RotateCcw,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Layers,
  Sparkles,
  ShieldAlert,
  Info,
  Sliders,
  Compass,
  Activity,
  Eye,
  Maximize2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface VolatilitySurface3DProps {
  stock: StockData;
  onSelectOptionContract?: (point: VolatilityPoint) => void;
}

type SurfaceMetric = 'iv' | 'delta' | 'gamma' | 'vega' | 'theta' | 'callPrice' | 'putPrice';
type ColorScheme = 'cyber' | 'turbo' | 'viridis' | 'inferno';

export const VolatilitySurface3D: React.FC<VolatilitySurface3DProps> = ({
  stock,
  onSelectOptionContract,
}) => {
  // Scenario & Model Parameters
  const [skewRegime, setSkewRegime] = useState<SkewRegime>('standard');
  const [ivShock, setIvShock] = useState<number>(0); // e.g. -5 to +15%
  const [spotShock, setSpotShock] = useState<number>(0); // e.g. -10 to +10%
  const [activeMetric, setActiveMetric] = useState<SurfaceMetric>('iv');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('cyber');
  const [showWireframe, setShowWireframe] = useState<boolean>(true);
  const [showFloorShadow, setShowFloorShadow] = useState<boolean>(true);
  const [isAutoOrbiting, setIsAutoOrbiting] = useState<boolean>(false);
  const [showChainTable, setShowChainTable] = useState<boolean>(false);

  // 3D Camera Angles & Scale
  const [pitch, setPitch] = useState<number>(34); // degrees (elevation, -80 to 80)
  const [yaw, setYaw] = useState<number>(42); // degrees (azimuth, -180 to 180)
  const [zoom, setZoom] = useState<number>(1.0);

  // Interactive Selected / Hovered Point
  const [selectedPoint, setSelectedPoint] = useState<VolatilityPoint | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<VolatilityPoint | null>(null);

  // SVG & Animation references
  const svgRef = useRef<SVGSVGElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Generate Volatility Surface Data
  const baseVol = stock.volatilityAnn || 22.5;
  const surfaceData: VolatilitySurfaceData = useMemo(() => {
    return generateVolatilitySurface(
      stock.price,
      stock.currency || (stock.exchange === 'NSE' ? '₹' : '$'),
      baseVol,
      skewRegime,
      ivShock,
      spotShock
    );
  }, [stock.price, stock.currency, stock.exchange, baseVol, skewRegime, ivShock, spotShock]);

  // Default selection to 30D ATM option
  useEffect(() => {
    if (!selectedPoint && surfaceData.grid.length > 2) {
      setSelectedPoint(surfaceData.grid[2][7] || surfaceData.grid[0][0]);
    }
  }, [surfaceData, selectedPoint]);

  // Auto-Orbit Animation Loop
  useEffect(() => {
    if (!isAutoOrbiting) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const orbit = () => {
      setYaw((prev) => (prev >= 180 ? -180 : prev + 0.35));
      animFrameRef.current = requestAnimationFrame(orbit);
    };

    animFrameRef.current = requestAnimationFrame(orbit);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAutoOrbiting]);

  // Extract metric value for a point
  const getMetricValue = (p: VolatilityPoint, metric: SurfaceMetric): number => {
    switch (metric) {
      case 'iv':
        return p.impliedVol;
      case 'delta':
        return Math.abs(p.greeks.callDelta);
      case 'gamma':
        return p.greeks.gamma * 1000; // scaled for readability
      case 'vega':
        return p.greeks.vega;
      case 'theta':
        return Math.abs(p.greeks.callTheta);
      case 'callPrice':
        return p.greeks.callPrice;
      case 'putPrice':
        return p.greeks.putPrice;
      default:
        return p.impliedVol;
    }
  };

  const metricLabel = useMemo(() => {
    switch (activeMetric) {
      case 'iv':
        return 'Implied Volatility (σ, %)';
      case 'delta':
        return 'Call Delta (|Δ|)';
      case 'gamma':
        return 'Call Gamma (Γ × 1000)';
      case 'vega':
        return `Option Vega (${surfaceData.currency}/1% IV)`;
      case 'theta':
        return `Daily Theta Decay (${surfaceData.currency}/day)`;
      case 'callPrice':
        return `Theoretical Call Price (${surfaceData.currency})`;
      case 'putPrice':
        return `Theoretical Put Price (${surfaceData.currency})`;
    }
  }, [activeMetric, surfaceData.currency]);

  // D3 Color Scales
  const colorInterpolator = useMemo(() => {
    switch (colorScheme) {
      case 'turbo':
        return d3.interpolateTurbo;
      case 'viridis':
        return d3.interpolateViridis;
      case 'inferno':
        return d3.interpolateInferno;
      case 'cyber':
      default:
        // High-tech Cyberpunk Cyan -> Blue -> Purple -> Magenta palette
        return (t: number) => {
          return d3.interpolateRgbBasis([
            '#06b6d4', // bright cyan
            '#3b82f6', // electric blue
            '#8b5cf6', // purple
            '#ec4899', // hot pink
            '#f43f5e', // coral red
          ])(t);
        };
    }
  }, [colorScheme]);

  // Calculate min and max for active metric
  const [metricMin, metricMax] = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    surfaceData.points.forEach((p) => {
      const v = getMetricValue(p, activeMetric);
      if (v < min) min = v;
      if (v > max) max = v;
    });
    if (min === max) max = min + 1;
    return [min, max];
  }, [surfaceData, activeMetric]);

  // 3D Canvas Projection Setup
  const width = 840;
  const height = 480;
  const cx = width / 2;
  const cy = height / 2 + 10;

  // Normalization boundaries
  const boxWidth = 320; // X: Moneyness/Strike span
  const boxDepth = 300; // Y: Expiry Tenor span
  const boxHeight = 160; // Z: Metric Height span

  // Rotation Radian angles
  const radPitch = (pitch * Math.PI) / 180;
  const radYaw = (yaw * Math.PI) / 180;
  const cosPitch = Math.cos(radPitch);
  const sinPitch = Math.sin(radPitch);
  const cosYaw = Math.cos(radYaw);
  const sinYaw = Math.sin(radYaw);

  // 3D to 2D projection function
  const project3D = (x: number, y: number, z: number) => {
    // 1. Rotate around Z (Yaw / Azimuth)
    const x1 = x * cosYaw + y * sinYaw;
    const y1 = -x * sinYaw + y * cosYaw;
    const z1 = z;

    // 2. Rotate around X (Pitch / Elevation)
    const x2 = x1;
    const y2 = y1 * cosPitch - z1 * sinPitch;
    const z2 = y1 * sinPitch + z1 * cosPitch;

    // 3. Project to screen with zoom
    const screenX = cx + x2 * zoom;
    const screenY = cy - y2 * zoom;
    const depth = z2; // Camera depth for Painter's sorting

    return { screenX, screenY, depth, origX: x, origY: y, origZ: z };
  };

  // Convert grid indices (i, j) to 3D box coordinates
  const numStrikes = surfaceData.grid[0].length;
  const numDays = surfaceData.grid.length;

  const getCoord = (i: number, j: number) => {
    const point = surfaceData.grid[j][i];
    const val = getMetricValue(point, activeMetric);

    // Normalize X from -boxWidth/2 to +boxWidth/2
    const normX = ((i / (numStrikes - 1)) - 0.5) * boxWidth;

    // Normalize Y from -boxDepth/2 to +boxDepth/2
    const normY = ((j / (numDays - 1)) - 0.5) * boxDepth;

    // Normalize Z from -boxHeight/2 to +boxHeight/2
    const normZ = (((val - metricMin) / (metricMax - metricMin)) - 0.5) * boxHeight;

    return { normX, normY, normZ, point, val };
  };

  // Build projected mesh polygons & depth sort (Painter's Algorithm)
  interface ProjectedFace {
    points: { screenX: number; screenY: number }[];
    depth: number;
    valAvg: number;
    color: string;
    normalZ: number;
    i: number;
    j: number;
    point: VolatilityPoint;
  }

  const { faces, projectedGrid, floorGridLines, axisMarkers } = useMemo(() => {
    const projGrid: {
      screenX: number;
      screenY: number;
      depth: number;
      point: VolatilityPoint;
      val: number;
      normX: number;
      normY: number;
      normZ: number;
    }[][] = [];

    // 1. Project all grid vertices
    for (let j = 0; j < numDays; j++) {
      const row = [];
      for (let i = 0; i < numStrikes; i++) {
        const c = getCoord(i, j);
        const p = project3D(c.normX, c.normY, c.normZ);
        row.push({
          screenX: p.screenX,
          screenY: p.screenY,
          depth: p.depth,
          point: c.point,
          val: c.val,
          normX: c.normX,
          normY: c.normY,
          normZ: c.normZ,
        });
      }
      projGrid.push(row);
    }

    // 2. Build surface polygons (quads split into 2 triangles or quads)
    const faceList: ProjectedFace[] = [];

    // Directional light vector normalized
    const light = { x: 0.35, y: -0.55, z: 0.75 };
    const lightMag = Math.sqrt(light.x * light.x + light.y * light.y + light.z * light.z);
    const lx = light.x / lightMag;
    const ly = light.y / lightMag;
    const lz = light.z / lightMag;

    for (let j = 0; j < numDays - 1; j++) {
      for (let i = 0; i < numStrikes - 1; i++) {
        const p00 = projGrid[j][i];
        const p10 = projGrid[j][i + 1];
        const p11 = projGrid[j + 1][i + 1];
        const p01 = projGrid[j + 1][i];

        const avgDepth = (p00.depth + p10.depth + p11.depth + p01.depth) / 4;
        const avgVal = (p00.val + p10.val + p11.val + p01.val) / 4;
        const normVal = Math.max(0, Math.min(1, (avgVal - metricMin) / (metricMax - metricMin)));

        // Normal vector via cross product
        const v1 = { x: p10.normX - p00.normX, y: p10.normY - p00.normY, z: p10.normZ - p00.normZ };
        const v2 = { x: p01.normX - p00.normX, y: p01.normY - p00.normY, z: p01.normZ - p00.normZ };
        let nx = v1.y * v2.z - v1.z * v2.y;
        let ny = v1.z * v2.x - v1.x * v2.z;
        let nz = v1.x * v2.y - v1.y * v2.x;
        const mag = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
        nx /= mag;
        ny /= mag;
        nz /= mag;

        // Diffuse Lambertian shading
        const dot = Math.max(0, nx * lx + ny * ly + nz * lz);
        const shade = 0.45 + 0.55 * dot;

        // Base color from color scale
        const baseColor = d3.rgb(colorInterpolator(normVal));
        const shadedColor = d3.rgb(
          Math.min(255, baseColor.r * shade),
          Math.min(255, baseColor.g * shade),
          Math.min(255, baseColor.b * shade)
        ).formatRgb();

        faceList.push({
          points: [
            { screenX: p00.screenX, screenY: p00.screenY },
            { screenX: p10.screenX, screenY: p10.screenY },
            { screenX: p11.screenX, screenY: p11.screenY },
            { screenX: p01.screenX, screenY: p01.screenY },
          ],
          depth: avgDepth,
          valAvg: avgVal,
          color: shadedColor,
          normalZ: nz,
          i,
          j,
          point: p00.point,
        });
      }
    }

    // Sort back-to-front (Painter's algorithm)
    faceList.sort((a, b) => a.depth - b.depth);

    // 3. Build Floor Grid Lines & Axis Markers at Z = -boxHeight/2 - 20
    const floorZ = -boxHeight / 2 - 20;
    const floorLines: { p1: { screenX: number; screenY: number }; p2: { screenX: number; screenY: number } }[] = [];

    // Strike grid lines on floor
    for (let i = 0; i < numStrikes; i += 2) {
      const normX = ((i / (numStrikes - 1)) - 0.5) * boxWidth;
      const pt1 = project3D(normX, -boxDepth / 2, floorZ);
      const pt2 = project3D(normX, boxDepth / 2, floorZ);
      floorLines.push({ p1: pt1, p2: pt2 });
    }

    // Tenor grid lines on floor
    for (let j = 0; j < numDays; j++) {
      const normY = ((j / (numDays - 1)) - 0.5) * boxDepth;
      const pt1 = project3D(-boxWidth / 2, normY, floorZ);
      const pt2 = project3D(boxWidth / 2, normY, floorZ);
      floorLines.push({ p1: pt1, p2: pt2 });
    }

    // Key bounding box corners
    const b00 = project3D(-boxWidth / 2, -boxDepth / 2, floorZ);
    const b10 = project3D(boxWidth / 2, -boxDepth / 2, floorZ);
    const b11 = project3D(boxWidth / 2, boxDepth / 2, floorZ);
    const b01 = project3D(-boxWidth / 2, boxDepth / 2, floorZ);
    const bTop = project3D(-boxWidth / 2, -boxDepth / 2, boxHeight / 2);

    const axis = {
      origin: b00,
      xEnd: b10,
      yEnd: b01,
      zEnd: bTop,
      floorCorners: [b00, b10, b11, b01],
    };

    return {
      faces: faceList,
      projectedGrid: projGrid,
      floorGridLines: floorLines,
      axisMarkers: axis,
    };
  }, [
    pitch,
    yaw,
    zoom,
    surfaceData,
    activeMetric,
    colorInterpolator,
    metricMin,
    metricMax,
    numDays,
    numStrikes,
  ]);

  // Handle Mouse / Touch Drag for 3D Orbiting
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    if (isAutoOrbiting) setIsAutoOrbiting(false);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    // Update yaw and pitch
    setYaw((prev) => {
      let next = prev + dx * 0.5;
      if (next > 180) next -= 360;
      if (next < -180) next += 360;
      return next;
    });

    setPitch((prev) => {
      const next = prev - dy * 0.5;
      return Math.max(-80, Math.min(80, next));
    });
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Find nearest vertex on hover
  const handleSvgHover = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDraggingRef.current) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let nearestPt: VolatilityPoint | null = null;
    let minDistance = 24; // 24px threshold

    projectedGrid.forEach((row) => {
      row.forEach((cell) => {
        const d = Math.hypot(cell.screenX - mouseX, cell.screenY - mouseY);
        if (d < minDistance) {
          minDistance = d;
          nearestPt = cell.point;
        }
      });
    });

    setHoveredPoint(nearestPt);
  };

  // Projection coordinate for the selected or hovered active point
  const activeInspectionPoint = hoveredPoint || selectedPoint;
  const activeProjVertex = useMemo(() => {
    if (!activeInspectionPoint) return null;
    const j = activeInspectionPoint.gridJ;
    const i = activeInspectionPoint.gridI;
    if (projectedGrid[j] && projectedGrid[j][i]) {
      const cell = projectedGrid[j][i];
      // Also project down to the floor
      const floorZ = -boxHeight / 2 - 20;
      const floorPt = project3D(cell.normX, cell.normY, floorZ);
      return {
        screenX: cell.screenX,
        screenY: cell.screenY,
        floorX: floorPt.screenX,
        floorY: floorPt.screenY,
        point: activeInspectionPoint,
      };
    }
    return null;
  }, [activeInspectionPoint, projectedGrid, pitch, yaw, zoom]);

  // View Angle Presets
  const setPresetAngle = (name: 'perspective' | 'smile' | 'term' | 'top') => {
    setIsAutoOrbiting(false);
    switch (name) {
      case 'perspective':
        setPitch(34);
        setYaw(42);
        setZoom(1.0);
        break;
      case 'smile': // Front view: strike skew curve
        setPitch(4);
        setYaw(0);
        setZoom(1.05);
        break;
      case 'term': // Side view: tenor term structure
        setPitch(6);
        setYaw(90);
        setZoom(1.05);
        break;
      case 'top': // 2D contour heatmap top-down
        setPitch(84);
        setYaw(0);
        setZoom(1.1);
        break;
    }
  };

  return (
    <div className="bg-[#101a2b] rounded-2xl border border-[#1e293b] p-4 lg:p-5 shadow-xl space-y-4 font-sans text-[#f1f5f9]">
      {/* 1. Header & Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#1e293b]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#22d3ee]/10 text-[#22d3ee] flex items-center justify-center border border-[#22d3ee]/20">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[17px] font-bold text-[#f1f5f9] tracking-tight">
                  3D Volatility Surface &amp; Option Risk Profile
                </h3>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#22d3ee]/15 text-[#22d3ee] font-semibold border border-[#22d3ee]/30">
                  D3 MESH ENGINE
                </span>
              </div>
              <p className="text-[12px] text-[#94a3b8] font-mono">
                {stock.symbol} ({stock.exchange}) • Spot: {stock.priceFormatted} • Baseline IV:{' '}
                {baseVol.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* View Presets & Camera Action Buttons */}
        <div className="flex items-center flex-wrap gap-1.5 font-mono text-[11px]">
          <button
            onClick={() => setPresetAngle('perspective')}
            className={`px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
              pitch === 34 && yaw === 42
                ? 'bg-[#22d3ee]/20 text-[#22d3ee] border-[#22d3ee]/50 font-bold'
                : 'bg-[#0a1120] text-[#94a3b8] border-[#1e293b] hover:text-[#f1f5f9]'
            }`}
          >
            3D Iso
          </button>
          <button
            onClick={() => setPresetAngle('smile')}
            className={`px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
              pitch === 4 && yaw === 0
                ? 'bg-[#22d3ee]/20 text-[#22d3ee] border-[#22d3ee]/50 font-bold'
                : 'bg-[#0a1120] text-[#94a3b8] border-[#1e293b] hover:text-[#f1f5f9]'
            }`}
          >
            Smile Skew
          </button>
          <button
            onClick={() => setPresetAngle('term')}
            className={`px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
              pitch === 6 && yaw === 90
                ? 'bg-[#22d3ee]/20 text-[#22d3ee] border-[#22d3ee]/50 font-bold'
                : 'bg-[#0a1120] text-[#94a3b8] border-[#1e293b] hover:text-[#f1f5f9]'
            }`}
          >
            Term Structure
          </button>
          <button
            onClick={() => setPresetAngle('top')}
            className={`px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
              pitch === 84
                ? 'bg-[#22d3ee]/20 text-[#22d3ee] border-[#22d3ee]/50 font-bold'
                : 'bg-[#0a1120] text-[#94a3b8] border-[#1e293b] hover:text-[#f1f5f9]'
            }`}
          >
            2D Heatmap
          </button>
          <div className="w-[1px] h-5 bg-[#1e293b] mx-0.5 hidden sm:block" />
          <button
            onClick={() => setIsAutoOrbiting(!isAutoOrbiting)}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition-all cursor-pointer ${
              isAutoOrbiting
                ? 'bg-[#a855f7]/25 text-[#c084fc] border-[#a855f7]/50 font-semibold shadow-sm shadow-[#a855f7]/20 animate-pulse'
                : 'bg-[#0a1120] text-[#94a3b8] border-[#1e293b] hover:text-[#f1f5f9]'
            }`}
            title="Toggle smooth 3D auto rotation"
          >
            {isAutoOrbiting ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoOrbiting ? 'Orbiting' : 'Auto Orbit'}</span>
          </button>
          <button
            onClick={() => {
              setPitch(34);
              setYaw(42);
              setZoom(1.0);
              setIsAutoOrbiting(false);
            }}
            className="p-1.5 rounded-lg bg-[#0a1120] border border-[#1e293b] text-[#94a3b8] hover:text-[#f1f5f9] transition-colors cursor-pointer"
            title="Reset view angles"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Institutional Volatility Summary Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-[11px]">
        <div className="bg-[#0a1120] p-2.5 rounded-xl border border-[#1e293b] space-y-0.5">
          <span className="text-[#64748b] text-[10px] uppercase block">ATM 30D Implied Vol</span>
          <div className="text-[16px] font-bold text-[#22d3ee]">
            {surfaceData.atmVol30D.toFixed(1)}%
          </div>
          <span className="text-[10px] text-[#94a3b8]">
            Benchmark Δ: {(surfaceData.atmVol30D - baseVol > 0 ? '+' : '')}
            {(surfaceData.atmVol30D - baseVol).toFixed(1)}%
          </span>
        </div>

        <div className="bg-[#0a1120] p-2.5 rounded-xl border border-[#1e293b] space-y-0.5">
          <span className="text-[#64748b] text-[10px] uppercase block">
            25Δ Put Skew (Risk Reversal)
          </span>
          <div className="text-[16px] font-bold text-[#f59e0b]">
            +{surfaceData.skew25Delta.toFixed(1)}%
          </div>
          <span className="text-[10px] text-[#94a3b8]">Downside Hedging Premium</span>
        </div>

        <div className="bg-[#0a1120] p-2.5 rounded-xl border border-[#1e293b] space-y-0.5">
          <span className="text-[#64748b] text-[10px] uppercase block">
            25Δ Fly (Tail Kurtosis)
          </span>
          <div className="text-[16px] font-bold text-[#a855f7]">
            +{surfaceData.fly25Delta.toFixed(1)}%
          </div>
          <span className="text-[10px] text-[#94a3b8]">Wing Convexity Risk</span>
        </div>

        <div className="bg-[#0a1120] p-2.5 rounded-xl border border-[#1e293b] space-y-0.5">
          <span className="text-[#64748b] text-[10px] uppercase block">Term Structure Slope</span>
          <div
            className={`text-[16px] font-bold ${
              surfaceData.termStructureSlope >= 0 ? 'text-[#10b981]' : 'text-[#f43f5e]'
            }`}
          >
            {surfaceData.termStructureSlope >= 0 ? '+' : ''}
            {surfaceData.termStructureSlope.toFixed(1)}%
          </div>
          <span className="text-[10px] text-[#94a3b8]">
            {surfaceData.termStructureSlope >= 0 ? 'Normal Contango' : 'Inverted (Backwardation)'}
          </span>
        </div>
      </div>

      {/* 3. Surface Controls & Shading Mode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0a1120] p-3 rounded-xl border border-[#1e293b] font-mono text-[11px]">
        {/* Metric Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[#94a3b8] text-[11px]">Surface Z-Axis:</span>
          <select
            value={activeMetric}
            onChange={(e) => setActiveMetric(e.target.value as SurfaceMetric)}
            className="bg-[#16243c] text-[#f1f5f9] border border-[#1e293b] rounded-lg px-2.5 py-1 text-[11px] font-mono focus:outline-none focus:border-[#22d3ee] cursor-pointer"
          >
            <option value="iv">Implied Volatility (σ, %)</option>
            <option value="delta">Call Delta (|Δ|)</option>
            <option value="gamma">Gamma Convexity (Γ × 1000)</option>
            <option value="vega">Option Vega (Sensitivity)</option>
            <option value="theta">Daily Theta Decay (Time bleed)</option>
            <option value="callPrice">Call Theoretical Price</option>
            <option value="putPrice">Put Theoretical Price</option>
          </select>
        </div>

        {/* Color Palette & Shading Options */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[#94a3b8]">Palette:</span>
            <div className="flex items-center bg-[#16243c] p-0.5 rounded-lg border border-[#1e293b]">
              {(['cyber', 'turbo', 'viridis', 'inferno'] as ColorScheme[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setColorScheme(c)}
                  className={`px-2 py-0.5 text-[10px] rounded capitalize transition-colors cursor-pointer ${
                    colorScheme === c
                      ? 'bg-[#22d3ee] text-[#070d19] font-bold'
                      : 'text-[#94a3b8] hover:text-[#f1f5f9]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-1.5 text-[#94a3b8] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showWireframe}
              onChange={(e) => setShowWireframe(e.target.checked)}
              className="accent-[#22d3ee] rounded"
            />
            <span className="text-[10px]">Wireframe</span>
          </label>

          <label className="flex items-center gap-1.5 text-[#94a3b8] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showFloorShadow}
              onChange={(e) => setShowFloorShadow(e.target.checked)}
              className="accent-[#22d3ee] rounded"
            />
            <span className="text-[10px]">Floor Grid</span>
          </label>
        </div>
      </div>

      {/* 4. Interactive 3D D3 Viewport & Canvas Area */}
      <div className="relative bg-[#070d19] rounded-xl border border-[#1e293b] overflow-hidden select-none">
        {/* HUD Overlay: Camera Angles & Drag Instruction */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 font-mono text-[10px] text-[#64748b] bg-[#101a2b]/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#1e293b]">
          <Compass className="w-3.5 h-3.5 text-[#22d3ee]" />
          <span>Pitch: {Math.round(pitch)}°</span>
          <span>•</span>
          <span>Yaw: {Math.round(yaw)}°</span>
          <span>•</span>
          <span className="text-[#22d3ee]">Click &amp; Drag to Orbit</span>
        </div>

        {/* Zoom Controls Overlay */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-[#101a2b]/80 backdrop-blur-md p-1 rounded-lg border border-[#1e293b]">
          <button
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}
            className="p-1 rounded text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#16243c] transition-colors cursor-pointer"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[10px] text-[#22d3ee] px-1.5 font-semibold">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(1.8, z + 0.1))}
            className="p-1 rounded text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#16243c] transition-colors cursor-pointer"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Color Legend Gradient Bar */}
        <div className="absolute bottom-3 left-3 z-10 bg-[#101a2b]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#1e293b] flex items-center gap-2.5 font-mono text-[10px]">
          <span className="text-[#94a3b8]">Min: {metricMin.toFixed(1)}</span>
          <div
            className="w-24 h-2 rounded-full"
            style={{
              background: `linear-gradient(to right, ${colorInterpolator(0)}, ${colorInterpolator(
                0.25
              )}, ${colorInterpolator(0.5)}, ${colorInterpolator(0.75)}, ${colorInterpolator(1)})`,
            }}
          />
          <span className="text-[#94a3b8]">Max: {metricMax.toFixed(1)}</span>
          <span className="text-[#22d3ee] font-semibold">({metricLabel})</span>
        </div>

        {/* The D3 SVG Element */}
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-[420px] sm:h-[480px] cursor-grab active:cursor-grabbing block"
          onMouseDown={handleMouseDown}
          onMouseMove={(e) => {
            handleMouseMove(e);
            handleSvgHover(e);
          }}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Defs for Lighting, Gradients, and Glow Filters */}
          <defs>
            <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="floorRadialGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#070d19" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 1. Floor Shadow & Plane */}
          {showFloorShadow && (
            <g className="floor-plane opacity-70">
              {/* Floor bounding polygon */}
              <polygon
                points={axisMarkers.floorCorners.map((p) => `${p.screenX},${p.screenY}`).join(' ')}
                fill="url(#floorRadialGlow)"
                stroke="#1e293b"
                strokeWidth="1"
              />

              {/* Floor grid mesh lines */}
              {floorGridLines.map((line, idx) => (
                <line
                  key={`floor-line-${idx}`}
                  x1={line.p1.screenX}
                  y1={line.p1.screenY}
                  x2={line.p2.screenX}
                  y2={line.p2.screenY}
                  stroke="#1e293b"
                  strokeWidth="0.8"
                  strokeDasharray="2,3"
                />
              ))}

              {/* Floor Axis Labels */}
              <text
                x={axisMarkers.xEnd.screenX}
                y={axisMarkers.xEnd.screenY + 14}
                fill="#94a3b8"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="middle"
              >
                Strike / Moneyness (K/S) →
              </text>
              <text
                x={axisMarkers.yEnd.screenX - 10}
                y={axisMarkers.yEnd.screenY + 12}
                fill="#94a3b8"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="end"
              >
                ← Tenor Expiration (Days)
              </text>
            </g>
          )}

          {/* 2. Shaded 3D Mesh Surface Polygons */}
          <g className="surface-mesh">
            {faces.map((face, idx) => {
              const ptsStr = face.points.map((p) => `${p.screenX},${p.screenY}`).join(' ');
              return (
                <polygon
                  key={`face-${idx}`}
                  points={ptsStr}
                  fill={face.color}
                  stroke={showWireframe ? 'rgba(255,255,255,0.14)' : 'none'}
                  strokeWidth={showWireframe ? '0.6' : '0'}
                  strokeLinejoin="round"
                  className="transition-opacity hover:opacity-90 cursor-pointer"
                  onClick={() => {
                    setSelectedPoint(face.point);
                    if (onSelectOptionContract) onSelectOptionContract(face.point);
                  }}
                />
              );
            })}
          </g>

          {/* 3. Highlighted / Active Point Indicator with Plumb Line */}
          {activeProjVertex && (
            <g className="active-vertex animate-fadeIn">
              {/* Vertical Plumb Line down to floor */}
              <line
                x1={activeProjVertex.screenX}
                y1={activeProjVertex.screenY}
                x2={activeProjVertex.floorX}
                y2={activeProjVertex.floorY}
                stroke="#22d3ee"
                strokeWidth="1.5"
                strokeDasharray="3,3"
                className="opacity-75"
              />

              {/* Floor target point */}
              <circle
                cx={activeProjVertex.floorX}
                cy={activeProjVertex.floorY}
                r="3.5"
                fill="#22d3ee"
                className="opacity-60"
              />

              {/* 3D Surface Node Outer Pulse */}
              <circle
                cx={activeProjVertex.screenX}
                cy={activeProjVertex.screenY}
                r="9"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="1.5"
                className="animate-ping opacity-75"
              />

              {/* 3D Surface Node Core */}
              <circle
                cx={activeProjVertex.screenX}
                cy={activeProjVertex.screenY}
                r="4.5"
                fill="#ffffff"
                stroke="#22d3ee"
                strokeWidth="2.5"
                filter="url(#nodeGlow)"
              />

              {/* Floating Node Value Tag */}
              <g
                transform={`translate(${activeProjVertex.screenX + 10}, ${
                  activeProjVertex.screenY - 14
                })`}
              >
                <rect
                  x="0"
                  y="-12"
                  width="130"
                  height="22"
                  rx="4"
                  fill="#070d19"
                  stroke="#22d3ee"
                  strokeWidth="1"
                  className="opacity-95"
                />
                <text
                  x="6"
                  y="2"
                  fill="#22d3ee"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  K: {surfaceData.currency}
                  {activeProjVertex.point.strike} • {activeProjVertex.point.impliedVol}% IV
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* 5. Deep Option Contract Risk Inspector & Greeks Breakdown */}
      {selectedPoint && (
        <div className="bg-[#0a1120] rounded-xl border border-[#1e293b] p-4 space-y-4 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#1e293b]">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-3.5 h-3.5 rounded-full ${
                  selectedPoint.riskAssessment.level === 'Extreme'
                    ? 'bg-[#f43f5e] animate-ping'
                    : selectedPoint.riskAssessment.level === 'High'
                    ? 'bg-[#f59e0b]'
                    : 'bg-[#22d3ee]'
                }`}
              />
              <div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[15px] font-bold text-[#f1f5f9]">
                    Strike: {surfaceData.currency}
                    {selectedPoint.strike.toLocaleString()}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-[#16243c] text-[#22d3ee] border border-[#22d3ee]/30 font-semibold">
                    {(selectedPoint.moneyness * 100).toFixed(0)}% Moneyness (
                    {selectedPoint.moneyness < 0.98
                      ? 'OTM Put / ITM Call'
                      : selectedPoint.moneyness > 1.02
                      ? 'OTM Call / ITM Put'
                      : 'ATM'}
                    )
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-[#16243c] text-[#a855f7] border border-[#a855f7]/30 font-semibold">
                    {selectedPoint.expiryLabel}
                  </span>
                </div>
                <p className="text-[12px] text-[#94a3b8] font-sans">
                  Regime: <strong className="text-[#dfe2f1]">{selectedPoint.riskAssessment.regime}</strong> •{' '}
                  {selectedPoint.riskAssessment.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="text-[#64748b]">Risk Rating:</span>
              <span
                className={`px-2.5 py-1 rounded-lg font-bold border ${
                  selectedPoint.riskAssessment.level === 'Extreme'
                    ? 'bg-[#f43f5e]/20 text-[#f43f5e] border-[#f43f5e]/40'
                    : selectedPoint.riskAssessment.level === 'High'
                    ? 'bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/40'
                    : 'bg-[#22d3ee]/20 text-[#22d3ee] border-[#22d3ee]/40'
                }`}
              >
                {selectedPoint.riskAssessment.level.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Pricing & Greeks Quantitative Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 font-mono text-[11px]">
            {/* Call Price */}
            <div className="bg-[#101a2b] p-2.5 rounded-lg border border-[#1e293b]">
              <span className="text-[#64748b] text-[10px] uppercase block">Call Premium</span>
              <div className="text-[15px] font-bold text-[#10b981]">
                {surfaceData.currency}
                {selectedPoint.greeks.callPrice.toFixed(2)}
              </div>
              <span className="text-[10px] text-[#94a3b8]">Theoretical BS</span>
            </div>

            {/* Put Price */}
            <div className="bg-[#101a2b] p-2.5 rounded-lg border border-[#1e293b]">
              <span className="text-[#64748b] text-[10px] uppercase block">Put Premium</span>
              <div className="text-[15px] font-bold text-[#f43f5e]">
                {surfaceData.currency}
                {selectedPoint.greeks.putPrice.toFixed(2)}
              </div>
              <span className="text-[10px] text-[#94a3b8]">Theoretical BS</span>
            </div>

            {/* Delta */}
            <div className="bg-[#101a2b] p-2.5 rounded-lg border border-[#1e293b]">
              <span className="text-[#64748b] text-[10px] uppercase block">Delta (Δ)</span>
              <div className="text-[15px] font-bold text-[#22d3ee]">
                {selectedPoint.greeks.callDelta.toFixed(3)}
              </div>
              <span className="text-[10px] text-[#94a3b8]">
                Put: {selectedPoint.greeks.putDelta.toFixed(3)}
              </span>
            </div>

            {/* Gamma */}
            <div className="bg-[#101a2b] p-2.5 rounded-lg border border-[#1e293b]">
              <span className="text-[#64748b] text-[10px] uppercase block">Gamma (Γ)</span>
              <div
                className={`text-[15px] font-bold ${
                  selectedPoint.greeks.gamma > 0.003 ? 'text-[#f59e0b]' : 'text-[#dfe2f1]'
                }`}
              >
                {(selectedPoint.greeks.gamma * 100).toFixed(4)}
              </div>
              <span className="text-[10px] text-[#94a3b8]">Curvature Risk</span>
            </div>

            {/* Vega */}
            <div className="bg-[#101a2b] p-2.5 rounded-lg border border-[#1e293b]">
              <span className="text-[#64748b] text-[10px] uppercase block">Vega (ν)</span>
              <div className="text-[15px] font-bold text-[#a855f7]">
                {surfaceData.currency}
                {selectedPoint.greeks.vega.toFixed(2)}
              </div>
              <span className="text-[10px] text-[#94a3b8]">per 1% IV shift</span>
            </div>

            {/* Theta */}
            <div className="bg-[#101a2b] p-2.5 rounded-lg border border-[#1e293b]">
              <span className="text-[#64748b] text-[10px] uppercase block">Theta (Θ)</span>
              <div className="text-[15px] font-bold text-[#f43f5e]">
                {surfaceData.currency}
                {selectedPoint.greeks.callTheta.toFixed(2)}
              </div>
              <span className="text-[10px] text-[#94a3b8]">Daily decay</span>
            </div>

            {/* Implied Vol */}
            <div className="bg-[#101a2b] p-2.5 rounded-lg border border-[#1e293b]">
              <span className="text-[#64748b] text-[10px] uppercase block">Implied Vol (σ)</span>
              <div className="text-[15px] font-bold text-[#22d3ee]">
                {selectedPoint.impliedVol.toFixed(1)}%
              </div>
              <span className="text-[10px] text-[#94a3b8]">
                Smile Δ: {(selectedPoint.impliedVol - surfaceData.atmVol30D > 0 ? '+' : '')}
                {(selectedPoint.impliedVol - surfaceData.atmVol30D).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 6. Scenario Stress Testing & Macro Volatility Simulator */}
      <div className="bg-[#0a1120] rounded-xl border border-[#1e293b] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#22d3ee]" />
            <span className="font-mono text-[12px] font-bold uppercase tracking-wider text-[#dfe2f1]">
              Options Scenario Stress Simulator
            </span>
          </div>
          <button
            onClick={() => {
              setIvShock(0);
              setSpotShock(0);
              setSkewRegime('standard');
            }}
            className="text-[11px] font-mono text-[#94a3b8] hover:text-[#22d3ee] transition-colors cursor-pointer"
          >
            Reset Stress Factors
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-[11px]">
          {/* Volatility Regime Selector */}
          <div className="space-y-1.5">
            <label className="text-[#94a3b8] block">Volatility Smile Regime</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'standard', label: 'Standard Skew' },
                { id: 'panic_put', label: 'Panic Put Skew' },
                { id: 'earnings_spike', label: 'Earnings Event' },
                { id: 'flattened', label: 'Neutral Smile' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSkewRegime(item.id as SkewRegime)}
                  className={`p-2 rounded-lg border text-left transition-colors cursor-pointer text-[10px] ${
                    skewRegime === item.id
                      ? 'bg-[#22d3ee]/20 text-[#22d3ee] border-[#22d3ee]/50 font-bold'
                      : 'bg-[#101a2b] text-[#94a3b8] border-[#1e293b] hover:text-[#f1f5f9]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Implied Volatility Shift Slider */}
          <div className="bg-[#101a2b] p-3 rounded-lg border border-[#1e293b] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[#94a3b8]">IV Parallel Shock</span>
              <span
                className={`font-bold ${
                  ivShock > 0 ? 'text-[#f59e0b]' : ivShock < 0 ? 'text-[#10b981]' : 'text-[#dfe2f1]'
                }`}
              >
                {ivShock > 0 ? `+${ivShock}%` : `${ivShock}%`}
              </span>
            </div>
            <input
              type="range"
              min="-10"
              max="20"
              step="1"
              value={ivShock}
              onChange={(e) => setIvShock(parseFloat(e.target.value))}
              className="w-full accent-[#22d3ee] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#64748b]">
              <span>-10% (IV Crush)</span>
              <span>0% Normal</span>
              <span>+20% (Panic Spike)</span>
            </div>
          </div>

          {/* Spot Underlying Shock Slider */}
          <div className="bg-[#101a2b] p-3 rounded-lg border border-[#1e293b] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[#94a3b8]">Spot Price Shift</span>
              <span
                className={`font-bold ${
                  spotShock > 0
                    ? 'text-[#10b981]'
                    : spotShock < 0
                    ? 'text-[#f43f5e]'
                    : 'text-[#dfe2f1]'
                }`}
              >
                {spotShock > 0 ? `+${spotShock}%` : `${spotShock}%`} (
                {surfaceData.currency}
                {surfaceData.spotPrice.toFixed(0)})
              </span>
            </div>
            <input
              type="range"
              min="-15"
              max="15"
              step="1"
              value={spotShock}
              onChange={(e) => setSpotShock(parseFloat(e.target.value))}
              className="w-full accent-[#22d3ee] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#64748b]">
              <span>-15% Shock</span>
              <span>Baseline</span>
              <span>+15% Breakout</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Collapsible Option Greek & Pricing Chain Matrix Table */}
      <div className="bg-[#0a1120] rounded-xl border border-[#1e293b] overflow-hidden">
        <button
          onClick={() => setShowChainTable(!showChainTable)}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#16243c]/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#22d3ee]" />
            <span className="font-mono text-[12px] font-bold uppercase tracking-wider text-[#dfe2f1]">
              Option Risk &amp; Greeks Strike Matrix Table
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#16243c] text-[#94a3b8]">
              {surfaceData.points.length} nodes computed
            </span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[11px] text-[#22d3ee]">
            <span>{showChainTable ? 'Hide Table' : 'Expand Matrix'}</span>
            {showChainTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showChainTable && (
          <div className="p-3 border-t border-[#1e293b] overflow-x-auto animate-fadeIn">
            <table className="w-full text-left font-mono text-[11px]">
              <thead>
                <tr className="border-b border-[#1e293b] text-[#64748b] text-[10px]">
                  <th className="py-2 px-2.5">Tenor</th>
                  <th className="py-2 px-2.5">Strike</th>
                  <th className="py-2 px-2.5">Moneyness</th>
                  <th className="py-2 px-2.5">Implied Vol</th>
                  <th className="py-2 px-2.5">Call BS</th>
                  <th className="py-2 px-2.5">Put BS</th>
                  <th className="py-2 px-2.5">Delta (Δ)</th>
                  <th className="py-2 px-2.5">Gamma (Γ)</th>
                  <th className="py-2 px-2.5">Vega (ν)</th>
                  <th className="py-2 px-2.5">Theta (Θ)</th>
                  <th className="py-2 px-2.5">Risk Regime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]/60">
                {/* Sample a representative slice of key strikes across near tenors */}
                {surfaceData.points
                  .filter((p) => [7, 30, 90].includes(p.daysToExpiry) && p.gridI % 2 === 0)
                  .map((p, idx) => {
                    const isSelected = selectedPoint?.strike === p.strike && selectedPoint?.daysToExpiry === p.daysToExpiry;
                    return (
                      <tr
                        key={`chain-row-${idx}`}
                        onClick={() => setSelectedPoint(p)}
                        className={`transition-colors cursor-pointer hover:bg-[#16243c] ${
                          isSelected ? 'bg-[#22d3ee]/10 font-bold' : ''
                        }`}
                      >
                        <td className="py-2 px-2.5 text-[#a855f7]">{p.expiryLabel}</td>
                        <td className="py-2 px-2.5 text-[#f1f5f9]">
                          {surfaceData.currency}
                          {p.strike.toLocaleString()}
                        </td>
                        <td className="py-2 px-2.5 text-[#94a3b8]">
                          {(p.moneyness * 100).toFixed(0)}%
                        </td>
                        <td className="py-2 px-2.5 text-[#22d3ee] font-semibold">
                          {p.impliedVol.toFixed(1)}%
                        </td>
                        <td className="py-2 px-2.5 text-[#10b981]">
                          {surfaceData.currency}
                          {p.greeks.callPrice.toFixed(2)}
                        </td>
                        <td className="py-2 px-2.5 text-[#f43f5e]">
                          {surfaceData.currency}
                          {p.greeks.putPrice.toFixed(2)}
                        </td>
                        <td className="py-2 px-2.5 text-[#dfe2f1]">
                          {p.greeks.callDelta.toFixed(3)}
                        </td>
                        <td className="py-2 px-2.5 text-[#dfe2f1]">
                          {(p.greeks.gamma * 100).toFixed(3)}
                        </td>
                        <td className="py-2 px-2.5 text-[#dfe2f1]">
                          {p.greeks.vega.toFixed(2)}
                        </td>
                        <td className="py-2 px-2.5 text-[#f43f5e]">
                          {p.greeks.callTheta.toFixed(2)}
                        </td>
                        <td className="py-2 px-2.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] ${
                              p.riskAssessment.level === 'Extreme'
                                ? 'bg-[#f43f5e]/20 text-[#f43f5e]'
                                : p.riskAssessment.level === 'High'
                                ? 'bg-[#f59e0b]/20 text-[#f59e0b]'
                                : 'bg-[#22d3ee]/15 text-[#22d3ee]'
                            }`}
                          >
                            {p.riskAssessment.regime}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 8. Quantitative Guidance & Methodology Note */}
      <div className="bg-[#0a1120] p-3 rounded-xl border border-[#1e293b] flex items-start gap-2.5 text-[#94a3b8] text-[11px] font-mono">
        <Info className="w-4 h-4 text-[#22d3ee] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          The 3D Volatility Surface projects institutional implied volatility smiles and term structure curves onto a discrete parametric mesh. Theoretical option pricing utilizes Black-Scholes continuous formulation with continuous dividends and risk-free curves (RBI 10Y G-Sec / US Fed Funds). Convexity pin risk and skew risk reversals evaluate non-linear option portfolio fragility.
        </p>
      </div>
    </div>
  );
};
