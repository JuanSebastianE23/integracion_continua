import React from 'react';

interface FractionEquivalentsProps {
  selectedCount: number;
  divisions: number;
}

const FractionEquivalents: React.FC<FractionEquivalentsProps> = ({
  selectedCount,
  divisions
}) => {
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  
  const fraction = divisions > 0 ? `${selectedCount}/${divisions}` : '0/1';
  const decimal = divisions > 0 ? (selectedCount / divisions).toFixed(3) : '0.000';
  const percentage = divisions > 0 ? ((selectedCount / divisions) * 100).toFixed(1) : '0.0';
  
  const simplifyFraction = () => {
    if (selectedCount === 0) return '0/1';
    const divisor = gcd(selectedCount, divisions);
    return `${selectedCount / divisor}/${divisions / divisor}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Equivalencias</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Fracción</div>
          <div className="text-3xl font-bold text-blue-600">{fraction}</div>
          <div className="text-sm text-gray-500 mt-1">
            Simplificada: {simplifyFraction()}
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Porcentaje</div>
          <div className="text-3xl font-bold text-green-600">{percentage}%</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Decimal</div>
          <div className="text-3xl font-bold text-purple-600">{decimal}</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Porciones</div>
          <div className="text-3xl font-bold text-orange-600">
            {selectedCount}/{divisions}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FractionEquivalents;

