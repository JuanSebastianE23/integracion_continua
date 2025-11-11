import { useState } from 'react';
import FractionCanvas from './FractionCanvas';
import FractionControls from './FractionControls';
import FractionEquivalents from './FractionEquivalents';

const FractionVisualizer = () => {
  const [objectType, setObjectType] = useState<'pizza' | 'cake'>('pizza');
  const [divisions, setDivisions] = useState(8);
  const [selectedSlices, setSelectedSlices] = useState<Set<number>>(new Set());
  const [rotX, setRotX] = useState(15);
  const [rotY, setRotY] = useState(0);
  const [rotZ, setRotZ] = useState(45);
  const [zoom, setZoom] = useState(1);
  const [showLabels, setShowLabels] = useState(true);
  const [showEquivalents, setShowEquivalents] = useState(true);

  const handleObjectTypeChange = (type: 'pizza' | 'cake') => {
    setObjectType(type);
    setSelectedSlices(new Set());
  };

  const handleDivisionsChange = (newDivisions: number) => {
    setDivisions(newDivisions);
    setSelectedSlices(new Set());
  };

  const handleSliceSelect = (sliceIndex: number) => {
    const newSelected = new Set(selectedSlices);
    if (newSelected.has(sliceIndex)) {
      newSelected.delete(sliceIndex);
    } else {
      newSelected.add(sliceIndex);
    }
    setSelectedSlices(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedSlices.size === divisions) {
      setSelectedSlices(new Set());
    } else {
      const all = new Set<number>();
      for (let i = 0; i < divisions; i++) all.add(i);
      setSelectedSlices(all);
    }
  };

  const handleRotate = (newRotX: number, newRotY: number, newRotZ: number) => {
    setRotX(newRotX);
    setRotY(newRotY);
    setRotZ(newRotZ);
  };

  const handleReset = () => {
    setSelectedSlices(new Set());
    setRotZ(45);
    setRotX(15);
    setRotY(0);
    setZoom(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Visualizador 3D de Fracciones
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          <FractionControls
            objectType={objectType}
            divisions={divisions}
            zoom={zoom}
            showLabels={showLabels}
            showEquivalents={showEquivalents}
            selectedSlices={selectedSlices}
            onObjectTypeChange={handleObjectTypeChange}
            onDivisionsChange={handleDivisionsChange}
            onZoomChange={setZoom}
            onShowLabelsChange={setShowLabels}
            onShowEquivalentsChange={setShowEquivalents}
            onSelectAll={handleSelectAll}
            onReset={handleReset}
          />

          <div className="md:col-span-2 space-y-6">
            <FractionCanvas
              objectType={objectType}
              divisions={divisions}
              selectedSlices={selectedSlices}
              rotX={rotX}
              rotY={rotY}
              rotZ={rotZ}
              zoom={zoom}
              showLabels={showLabels}
              onSliceSelect={handleSliceSelect}
              onRotate={handleRotate}
            />

            {showEquivalents && (
              <FractionEquivalents
                selectedCount={selectedSlices.size}
                divisions={divisions}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FractionVisualizer;

