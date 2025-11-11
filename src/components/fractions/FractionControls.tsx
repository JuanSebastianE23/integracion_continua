/* eslint-disable no-unused-vars */
import React from 'react';
import { ZoomIn, ZoomOut, RefreshCw, Eye, EyeOff } from 'lucide-react';

interface FractionControlsProps {
  objectType: 'pizza' | 'cake';
  divisions: number;
  zoom: number;
  showLabels: boolean;
  showEquivalents: boolean;
  selectedSlices: Set<number>;
  onObjectTypeChange: (type: 'pizza' | 'cake') => void;
  onDivisionsChange: (divisions: number) => void;
  onZoomChange: (zoom: number) => void;
  onShowLabelsChange: (show: boolean) => void;
  onShowEquivalentsChange: (show: boolean) => void;
  onSelectAll: () => void;
  onReset: () => void;
}

const FractionControls: React.FC<FractionControlsProps> = ({
  objectType,
  divisions,
  zoom,
  showLabels,
  showEquivalents,
  selectedSlices: _selectedSlices,
  onObjectTypeChange,
  onDivisionsChange,
  onZoomChange,
  onShowLabelsChange,
  onShowEquivalentsChange,
  onSelectAll,
  onReset
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Tipo de Objeto</h2>
        <div className="flex gap-2">
          <button
            onClick={() => onObjectTypeChange('pizza')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              objectType === 'pizza'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pizza
          </button>
          <button
            onClick={() => onObjectTypeChange('cake')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              objectType === 'cake'
                ? 'bg-pink-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pastel
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Divisiones</h2>
        <select
          value={divisions}
          onChange={(e) => onDivisionsChange(Number(e.target.value))}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        >
          {[2, 3, 4, 6, 8, 10, 12, 16].map(num => (
            <option key={num} value={num}>{num} partes</option>
          ))}
        </select>
      </div>
      
      <div>
        <button
          onClick={onSelectAll}
          className="w-full mt-3 p-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 font-medium"
        >
          Seleccionar / Deseleccionar todo
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Visualización</h2>
        <div className="space-y-3">
          <button
            onClick={() => onShowLabelsChange(!showLabels)}
            className="w-full flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
          >
            <span className="flex items-center gap-2">
              {showLabels ? <Eye size={20} /> : <EyeOff size={20} />}
              Etiquetas
            </span>
            <span className={`font-medium ${showLabels ? 'text-green-600' : 'text-gray-400'}`}>
              {showLabels ? 'ON' : 'OFF'}
            </span>
          </button>

          <button
            onClick={() => onShowEquivalentsChange(!showEquivalents)}
            className="w-full flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
          >
            <span className="flex items-center gap-2">
              {showEquivalents ? <Eye size={20} /> : <EyeOff size={20} />}
              Equivalencias
            </span>
            <span className={`font-medium ${showEquivalents ? 'text-green-600' : 'text-gray-400'}`}>
              {showEquivalents ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Controles de Zoom</h2>
        <div className="flex gap-2">
          <button
            onClick={() => onZoomChange(Math.max(0.5, zoom - 0.2))}
            className="flex-1 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
          >
            <ZoomOut size={20} />
            Alejar
          </button>
          <button
            onClick={() => onZoomChange(Math.min(2, zoom + 0.2))}
            className="flex-1 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
          >
            <ZoomIn size={20} />
            Acercar
          </button>
        </div>
        <div className="mt-2 text-center text-sm text-gray-600">
          Zoom: {(zoom * 100).toFixed(0)}%
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2 font-medium"
      >
        <RefreshCw size={20} />
        Reiniciar
      </button>
    </div>
  );
};

export default FractionControls;