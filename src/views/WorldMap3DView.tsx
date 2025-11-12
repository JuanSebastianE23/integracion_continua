import React, { useState } from "react";
import WorldMap3D from "../components/geography/WorldMap3D";

const WorldMap3DView: React.FC = () => {
  const [mode, setMode] = useState<"select" | "drag" | "compare">("select");
  const [category, setCategory] = useState<"clima" | "población" | "economía" | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            Mapa 3D Interactivo del Mundo 🌎
          </h1>
          <p className="text-gray-600 text-sm mb-4">
            Explora países, compara datos y visualiza información geográfica
          </p>
          
          <div className="flex gap-3 items-center flex-wrap">
            <div className="flex gap-2">
              <button
                onClick={() => setMode("select")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  mode === "select" 
                    ? "bg-blue-600 text-white shadow-lg scale-105" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                📍 Seleccionar País
              </button>
              <button
                onClick={() => setMode("drag")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  mode === "drag" 
                    ? "bg-blue-600 text-white shadow-lg scale-105" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                🖐️ Arrastrar
              </button>
              <button
                onClick={() => setMode("compare")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  mode === "compare" 
                    ? "bg-blue-600 text-white shadow-lg scale-105" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                ⚖️ Comparar
              </button>
            </div>

            <div className="h-8 w-px bg-gray-300"></div>

            <div className="flex gap-2">
              <button
                onClick={() => setCategory(category === "clima" ? null : "clima")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  category === "clima"
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                🌡️ Clima
              </button>
              <button
                onClick={() => setCategory(category === "población" ? null : "población")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  category === "población"
                    ? "bg-yellow-500 text-white shadow-lg"
                    : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                }`}
              >
                👥 Población
              </button>
              <button
                onClick={() => setCategory(category === "economía" ? null : "economía")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  category === "economía"
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                }`}
              >
                💰 Economía
              </button>
            </div>
          </div>
        </div>

        <WorldMap3D mode={mode} category={category} />
      </div>
    </div>
  );
};

export default WorldMap3DView;