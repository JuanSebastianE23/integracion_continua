/* eslint-disable no-unused-vars */
import React, { useRef, useEffect } from 'react';
import { RotateCw } from 'lucide-react';

interface FractionCanvasProps {
  objectType: 'pizza' | 'cake';
  divisions: number;
  selectedSlices: Set<number>;
  rotX: number;
  rotY: number;
  rotZ: number;
  zoom: number;
  showLabels: boolean;
  onSliceSelect: (sliceIndex: number) => void;
  onRotate: (rotX: number, rotY: number, rotZ: number) => void;
}

const colors = {
  pizza: { base: '#F4A460', selected: '#FF6347', crust: '#D2691E' },
  cake: { base: '#FFE4B5', selected: '#FF69B4', frosting: '#FFF8DC' }
};

const FractionCanvas: React.FC<FractionCanvasProps> = ({
  objectType,
  divisions,
  selectedSlices,
  rotX,
  rotY,
  rotZ,
  zoom,
  showLabels,
  onSliceSelect,
  onRotate
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerStateRef = useRef<{ 
    down: boolean; 
    startX: number; 
    lastX: number; 
    startY: number; 
    lastY: number; 
    moved: boolean; 
    pointerId?: number 
  }>({ 
    down: false, 
    startX: 0, 
    lastX: 0, 
    startY: 0, 
    lastY: 0, 
    moved: false 
  });

  const render = (selected?: Set<number>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150 * zoom;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;

    const usedSelected = selected ?? selectedSlices;
    if (objectType === 'pizza') {
      drawPizza(ctx, centerX, centerY, radius, usedSelected);
    } else {
      drawCake(ctx, centerX, centerY, radius, usedSelected);
    }

    ctx.restore();
  };

  const drawPizza = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    selected: Set<number>
  ) => {
    const angleStep = (Math.PI * 2) / divisions;
    const rotationRad = (rotZ * Math.PI) / 180;

    for (let i = 0; i < divisions; i++) {
      const startAngle = rotationRad + (i * angleStep) - Math.PI / 2;
      const endAngle = startAngle + angleStep;
      const isSelected = selected.has(i);
      
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      if (isSelected) {
        gradient.addColorStop(0, colors.pizza.selected);
        gradient.addColorStop(1, '#CC4534');
      } else {
        gradient.addColorStop(0, colors.pizza.base);
        gradient.addColorStop(1, '#D2691E');
      }
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.strokeStyle = colors.pizza.crust;
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      const endX = cx + Math.cos(startAngle) * radius;
      const endY = cy + Math.sin(startAngle) * radius;
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (!isSelected) {
        const midAngle = startAngle + angleStep / 2;
        const midRadius = radius * 0.6;
        const pepX = cx + Math.cos(midAngle) * midRadius;
        const pepY = cy + Math.sin(midAngle) * midRadius;

        ctx.beginPath();
        ctx.arc(pepX, pepY, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#8B0000';
        ctx.fill();
      }

      if (showLabels) {
        const labelAngle = startAngle + angleStep / 2;
        const labelRadius = radius * 0.4;
        const labelX = cx + Math.cos(labelAngle) * labelRadius;
        const labelY = cy + Math.sin(labelAngle) * labelRadius;

        ctx.save();
        ctx.translate(labelX, labelY);
        ctx.fillStyle = 'white';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const text = `1/${divisions}`;
        ctx.strokeText(text, 0, 0);
        ctx.fillText(text, 0, 0);
        ctx.restore();
      }
    }
  };

  const drawCake = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    selected: Set<number>
  ) => {
    const angleStep = (Math.PI * 2) / divisions;
    const innerRadius = 0;
    const height = 60 * zoom;
    const f = 700;

    const project = (x: number, y: number, z: number) => {
      const rx = rotX * Math.PI / 180;
      const ry = rotY * Math.PI / 180;
      const rz = rotZ * Math.PI / 180;
      let x1 = x;
      let y1 = y * Math.cos(rx) - z * Math.sin(rx);
      let z1 = y * Math.sin(rx) + z * Math.cos(rx);
      let x2 = x1 * Math.cos(ry) + z1 * Math.sin(ry);
      let y2 = y1;
      let z2 = -x1 * Math.sin(ry) + z1 * Math.cos(ry);
      let x3 = x2 * Math.cos(rz) - y2 * Math.sin(rz);
      let y3 = x2 * Math.sin(rz) + y2 * Math.cos(rz);
      let z3 = z2;
      const scale = f / (f - z3);
      return { x: cx + x3 * scale, y: cy + y3 * scale, z: z3, scale };
    };

    type Poly = {pts:Array<{x:number,y:number}>, avgZ:number, fillStyle:string, stroke?:boolean};
    const polys: Poly[] = [];

    for (let i = 0; i < divisions; i++) {
      const startAngle = i * angleStep - Math.PI / 2;
      const endAngle = startAngle + angleStep;
      const steps = 24;

      const topOuter: Array<{x:number,y:number,z:number}> = [];
      const topInner: Array<{x:number,y:number,z:number}> = [];
      const botOuter: Array<{x:number,y:number,z:number}> = [];
      const botInner: Array<{x:number,y:number,z:number}> = [];
      for (let s = 0; s <= steps; s++) {
        const a = startAngle + (s/steps)*(endAngle - startAngle);
        const ox = Math.cos(a) * radius;
        const oy = Math.sin(a) * radius;
        const ix = Math.cos(a) * innerRadius;
        const iy = Math.sin(a) * innerRadius;
        topOuter.push({x:ox,y:oy,z:0});
        topInner.push({x:ix,y:iy,z:0});
        botOuter.push({x:ox,y:oy,z:-height});
        botInner.push({x:ix,y:iy,z:-height});
      }

      const topOuterP = topOuter.map(p => project(p.x,p.y,p.z));
      const topInnerP = topInner.map(p => project(p.x,p.y,p.z));
      const botOuterP = botOuter.map(p => project(p.x,p.y,p.z));
      const botInnerP = botInner.map(p => project(p.x,p.y,p.z));

      const topPolyPts: Array<{x:number,y:number}> = [];
      for (const p of topOuterP) topPolyPts.push({x:p.x,y:p.y});
      for (let k = topInnerP.length-1; k >= 0; k--) topPolyPts.push({x: topInnerP[k].x, y: topInnerP[k].y});
      const topAvgZ = (topOuterP.reduce((a,p)=>a+p.z,0) + topInnerP.reduce((a,p)=>a+p.z,0)) / (topOuterP.length + topInnerP.length);
      polys.push({ pts: topPolyPts, avgZ: topAvgZ, fillStyle: (selected.has(i) ? '#FFB6C1' : '#FFF8DC'), stroke: true });

      const outerSidePts: Array<{x:number,y:number}> = [];
      for (let k=0;k<topOuterP.length;k++) outerSidePts.push({x: topOuterP[k].x, y: topOuterP[k].y});
      for (let k=botOuterP.length-1;k>=0;k--) outerSidePts.push({x: botOuterP[k].x, y: botOuterP[k].y});
      const outerAvgZ = (topOuterP.reduce((a,p)=>a+p.z,0) + botOuterP.reduce((a,p)=>a+p.z,0)) / (topOuterP.length + botOuterP.length);
      polys.push({ pts: outerSidePts, avgZ: outerAvgZ, fillStyle: (selected.has(i) ? '#FF9AB3' : '#D8B58A'), stroke: true });

      const innerSidePts: Array<{x:number,y:number}> = [];
      for (let k=0;k<botInnerP.length;k++) innerSidePts.push({x: botInnerP[k].x, y: botInnerP[k].y});
      for (let k=topInnerP.length-1;k>=0;k--) innerSidePts.push({x: topInnerP[k].x, y: topInnerP[k].y});
      const innerAvgZ = (botInnerP.reduce((a,p)=>a+p.z,0) + topInnerP.reduce((a,p)=>a+p.z,0)) / (botInnerP.length + topInnerP.length);
      polys.push({ pts: innerSidePts, avgZ: innerAvgZ, fillStyle: (selected.has(i) ? '#FF7FA0' : '#CDA674'), stroke: true });

      const startFace: Array<{x:number,y:number}> = [];
      startFace.push({x: topOuterP[0].x, y: topOuterP[0].y});
      startFace.push({x: botOuterP[0].x, y: botOuterP[0].y});
      startFace.push({x: botInnerP[0].x, y: botInnerP[0].y});
      startFace.push({x: topInnerP[0].x, y: topInnerP[0].y});
      const startAvgZ = (topOuterP[0].z + botOuterP[0].z + botInnerP[0].z + topInnerP[0].z)/4;
      polys.push({ pts: startFace, avgZ: startAvgZ, fillStyle: (selected.has(i) ? '#FFB0C9' : '#E0C29A'), stroke: true });

      const endFace: Array<{x:number,y:number}> = [];
      const L = topOuterP.length-1;
      endFace.push({x: topOuterP[L].x, y: topOuterP[L].y});
      endFace.push({x: botOuterP[L].x, y: botOuterP[L].y});
      endFace.push({x: botInnerP[L].x, y: botInnerP[L].y});
      endFace.push({x: topInnerP[L].x, y: topInnerP[L].y});
      const endAvgZ = (topOuterP[L].z + botOuterP[L].z + botInnerP[L].z + topInnerP[L].z)/4;
      polys.push({ pts: endFace, avgZ: endAvgZ, fillStyle: (selected.has(i) ? '#FFB0C9' : '#E0C29A'), stroke: true });
    }

    polys.sort((a,b)=>a.avgZ - b.avgZ);
    for (const p of polys) {
      ctx.beginPath();
      for (let i = 0; i < p.pts.length; i++) {
        const pt = p.pts[i];
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();
      ctx.fillStyle = p.fillStyle;
      ctx.fill();
      if (p.stroke) { ctx.strokeStyle = '#8B4513'; ctx.lineWidth = 1.2; ctx.stroke(); }
    }
  };

  const getSliceIndexFromClient = (clientX: number, clientY: number): number | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const px = (clientX - rect.left) * scaleX;
    const py = (clientY - rect.top) * scaleY;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = 150 * zoom;

    const toScreen = (x: number, y: number, z: number) => {
      const rx = rotX * Math.PI / 180;
      const ry = rotY * Math.PI / 180;
      const rz = rotZ * Math.PI / 180;
      let x1 = x;
      let y1 = y * Math.cos(rx) - z * Math.sin(rx);
      let z1 = y * Math.sin(rx) + z * Math.cos(rx);
      let x2 = x1 * Math.cos(ry) + z1 * Math.sin(ry);
      let y2 = y1;
      let z2 = -x1 * Math.sin(ry) + z1 * Math.cos(ry);
      let x3 = x2 * Math.cos(rz) - y2 * Math.sin(rz);
      let y3 = x2 * Math.sin(rz) + y2 * Math.cos(rz);
      let z3 = z2;
      const f = 700;
      const scale = f / (f - z3);
      return { x: cx + x3 * scale, y: cy + y3 * scale, z: z3 };
    };

    const pointInPolygon = (px: number, py: number, poly: Array<{x:number,y:number}>) => {
      let inside = false;
      for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const xi = poly[i].x, yi = poly[i].y;
        const xj = poly[j].x, yj = poly[j].y;
        const intersect = ((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }
      return inside;
    };

    const angleStep = (Math.PI * 2) / divisions;
    const innerRadius = 0;
    for (let i = 0; i < divisions; i++) {
      const startAngle = (i * angleStep) - Math.PI / 2;
      const endAngle = startAngle + angleStep;
      const steps = 12;
      const poly: Array<{x:number,y:number}> = [];
      for (let s = 0; s <= steps; s++) {
        const a = startAngle + (s / steps) * (endAngle - startAngle);
        const x = Math.cos(a) * radius;
        const y = Math.sin(a) * radius;
        const p = toScreen(x, y, 0);
        poly.push({ x: p.x, y: p.y });
      }
      for (let s = steps; s >= 0; s--) {
        const a = startAngle + (s / steps) * (endAngle - startAngle);
        const x = Math.cos(a) * innerRadius;
        const y = Math.sin(a) * innerRadius;
        const p = toScreen(x, y, 0);
        poly.push({ x: p.x, y: p.y });
      }
      if (pointInPolygon(px, py, poly)) return i;
    }
    return null;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // setPointerCapture no está implementado en jsdom; comprobar antes de invocar
    try {
      if (typeof (e.target as any).setPointerCapture === 'function') {
        (e.target as any).setPointerCapture(e.pointerId);
      }
    } catch (e) {
      console.debug('Failed to release pointer capture:', e);
    }
    pointerStateRef.current = { 
      down: true, 
      startX: e.clientX, 
      lastX: e.clientX, 
      startY: e.clientY, 
      lastY: e.clientY, 
      moved: false, 
      pointerId: e.pointerId 
    };
    e.preventDefault();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = pointerStateRef.current;
    if (!s.down) return;
    const dx = e.clientX - s.lastX;
    const dy = e.clientY - s.lastY;
    if (Math.abs(e.clientX - s.startX) > 6 || Math.abs(e.clientY - s.startY) > 6) s.moved = true;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
    
    let newRotY = rotY;
    let newRotZ = rotZ;
    let newRotX = rotX;

    if (e.shiftKey) {
      newRotY = (rotY + dx * 0.5) % 360;
      if (newRotY < 0) newRotY += 360;
    } else {
      newRotZ = (rotZ + dx * 0.5) % 360;
      if (newRotZ < 0) newRotZ += 360;
    }
    newRotX = Math.max(-80, Math.min(80, rotX + dy * 0.3));
    
    onRotate(newRotX, newRotY, newRotZ);
    requestAnimationFrame(() => render());
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = pointerStateRef.current;
    if (!s.down) return;
    try { (e.target as Element).releasePointerCapture(e.pointerId); } catch (error) {
          console.debug('Failed to release pointer capture:', error);
        }
    if (!s.moved) {
      const sliceIndex = getSliceIndexFromClient(e.clientX, e.clientY);
      if (sliceIndex !== null) {
        onSliceSelect(sliceIndex);
      }
    }
    pointerStateRef.current.down = false;
    pointerStateRef.current.moved = false;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.width || 600;
      canvas.height = canvas.height || 400;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 150 * zoom;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;

      if (objectType === 'pizza') {
        drawPizza(ctx, centerX, centerY, radius, selectedSlices);
      } else {
        drawCake(ctx, centerX, centerY, radius, selectedSlices);
      }

      ctx.restore();
    }
  }, [objectType, divisions, selectedSlices, rotX, rotY, rotZ, zoom, showLabels, drawPizza, drawCake]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Vista 3D</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <RotateCw size={16} />
          Arrastra para rotar
        </div>
      </div>
      <canvas
        data-testid="fraction-canvas"
        ref={canvasRef}
        width={600}
        height={400}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full border-2 border-gray-200 rounded-lg cursor-pointer"
        style={{ touchAction: 'none' }}
      />
      <p className="mt-4 text-center text-gray-600">
        Haz clic en las porciones para seleccionarlas
      </p>
    </div>
  );
};

export default FractionCanvas;