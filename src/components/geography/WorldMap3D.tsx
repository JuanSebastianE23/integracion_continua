import React, { useEffect, useRef, useState } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { 
  getCountryData, 
  getTemperatureColor, 
  getPopulationColor, 
  getGDPColor,
  type CountryInfo 
} from "../../data/countriesData";

// Configuración de la API Key
maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_KEY as string;

interface WorldMap3DProps {
  mode?: "select" | "drag" | "compare";
  category?: "clima" | "población" | "economía" | null;
}

const WorldMap3D: React.FC<WorldMap3DProps> = ({
  mode = "select",
  category = null,
}) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const [selectedCountries, setSelectedCountries] = useState<CountryInfo[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const modeRef = useRef(mode);
  const categoryRef = useRef(category);

  // Mantener refs actualizados
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    categoryRef.current = category;
    console.log("📝 Categoría actualizada a:", category);
  }, [category]);

  // Función para actualizar colores de países según categoría
  const updateCountryColors = () => {
    if (!map.current || !mapLoaded || !geoJsonData) {
      console.log("⏳ Esperando mapa y datos...");
      return;
    }

    const currentCategory = categoryRef.current;
    console.log("🎨 Actualizando colores, categoría:", currentCategory);

    // Si no hay categoría, volver al color por defecto
    if (!currentCategory) {
      try {
        if (map.current?.getLayer('country-fill')) {
          map.current.setPaintProperty('country-fill', 'fill-color', '#88c9f9');
          console.log("✅ Color por defecto aplicado");
        }
      } catch (error) {
        console.error("❌ Error al aplicar color por defecto:", error);
      }
      return;
    }

    // Crear expresión de color basada en la categoría
    const colorExpression: any = ['match', ['get', 'ISO_A3']];

    let coloredCount = 0;
    geoJsonData.features.forEach((feature: any) => {
      const iso_a3 = feature.properties.ISO_A3;
      const countryData = getCountryData(iso_a3);
      
      let color = '#88c9f9'; // Color por defecto azul claro
      
      if (countryData) {
        coloredCount++;
        if (currentCategory === 'clima') {
          color = getTemperatureColor(countryData.avgTemperature);
        } else if (currentCategory === 'población') {
          color = getPopulationColor(countryData.population);
        } else if (currentCategory === 'economía') {
          color = getGDPColor(countryData.gdpPerCapita);
        }
      }
      
      colorExpression.push(iso_a3, color);
    });

    // Color por defecto para países no encontrados
    colorExpression.push('#88c9f9');

    console.log(`🎨 Coloreando ${coloredCount} países con categoría: ${currentCategory}`);
    console.log("📋 Expresión de color completa:", colorExpression);
    console.log("📋 Total elementos en expresión:", colorExpression.length);

    // Aplicar la expresión de color
    try {
      if (map.current?.getLayer('country-fill')) {
        map.current.setPaintProperty('country-fill', 'fill-color', colorExpression);
        
        // Forzar re-render del mapa
        map.current.triggerRepaint();
        
        console.log("✅ Colores aplicados correctamente para categoría:", currentCategory);
      } else {
        console.error("❌ Capa 'country-fill' no encontrada");
      }
    } catch (error) {
      console.error("❌ Error al aplicar colores:", error);
    }
  };

  // Inicializar el mapa
  useEffect(() => {
    if (map.current) return;

    const apiKey = maptilersdk.config.apiKey;

    // Crear un estilo personalizado vacío
    const emptyStyle = {
      version: 8,
      sources: {
        'raster-tiles': {
          type: 'raster',
          tiles: [`https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=${apiKey}`],
          tileSize: 256,
          attribution: '© MapTiler © OpenStreetMap contributors'
        }
      },
      layers: [
        {
          id: 'background',
          type: 'background',
          paint: {
            'background-color': '#e0e8f0'
          }
        }
      ],
      glyphs: `https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=${apiKey}`
    };

    map.current = new maptilersdk.Map({
      container: mapContainer.current!,
      style: emptyStyle as any,
      center: [0, 20],
      zoom: 1.5,
      pitch: 45,
    });

    map.current.on("load", () => {
      console.log("✅ Mapa cargado correctamente");
      
      // Cargar GeoJSON de países
      fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson')
        .then(response => response.json())
        .then(data => {
          console.log("✅ GeoJSON de países cargado:", data.features.length, "países");
          
          setGeoJsonData(data);
          
          if (!map.current) return;

          // Agregar la fuente GeoJSON
          map.current.addSource('countries', {
            type: 'geojson',
            data: data
          });

          // Encontrar la primera capa de símbolo para insertar nuestras capas antes
          const layers = map.current.getStyle().layers;
          let firstSymbolId: string | undefined;
          for (const layer of layers) {
            if (layer.type === 'symbol') {
              firstSymbolId = layer.id;
              break;
            }
          }

          // Capa de relleno de países
          map.current.addLayer({
            id: 'country-fill',
            type: 'fill',
            source: 'countries',
            paint: {
              'fill-color': '#88c9f9',
              'fill-opacity': 0.8
            }
          }, firstSymbolId);

          // Capa de bordes de países
          map.current.addLayer({
            id: 'country-outline',
            type: 'line',
            source: 'countries',
            paint: {
              'line-color': '#333',
              'line-width': 1.5
            }
          }, firstSymbolId);

          // Capa de países destacados (para comparar)
          map.current.addLayer({
            id: 'country-highlight',
            type: 'line',
            source: 'countries',
            paint: {
              'line-color': '#0066ff',
              'line-width': 4
            },
            filter: ['in', 'ISO_A3', '']
          }, firstSymbolId);

          console.log("✅ Capas agregadas");
          console.log("🔍 Verificando capas:", map.current.getStyle().layers.map((l: any) => l.id));
          
          // Ocultar capas específicas del estilo base que están bloqueando nuestra visualización
          const layersToHide = [
            'Background',
            'Residential', 
            'Glacier', 
            'Forest', 
            'Sand', 
            'Grass', 
            'Wood', 
            'Water'
          ];
          
          layersToHide.forEach(layerId => {
            try {
              if (map.current?.getLayer(layerId)) {
                map.current.setLayoutProperty(layerId, 'visibility', 'none');
                console.log("🔇 Ocultando capa:", layerId);
              }
            } catch {
              console.log("⚠️ No se pudo ocultar capa:", layerId);
            }
          });
          
          // Verificar que country-fill esté visible
          console.log("👁️ Verificando visibilidad de country-fill");
          
          setMapLoaded(true);

          // Configurar event listeners
          setupEventListeners();
        })
        .catch(error => {
          console.error("❌ Error al cargar países:", error);
        });
    });

    const setupEventListeners = () => {
      if (!map.current) return;

      // Cambiar cursor al pasar sobre país
      map.current.on("mouseenter", "country-fill", () => {
        if (map.current && (modeRef.current === "select" || modeRef.current === "compare")) {
          map.current.getCanvas().style.cursor = "pointer";
        }
      });

      map.current.on("mouseleave", "country-fill", () => {
        if (map.current && modeRef.current !== "drag") {
          map.current.getCanvas().style.cursor = "";
        }
      });

      // Click en país
      map.current.on("click", "country-fill", (e: any) => {
        if (modeRef.current !== "select" && modeRef.current !== "compare") {
          return;
        }

        if (!e.features || e.features.length === 0) return;

        const geoJsonProps = e.features[0].properties;
        const iso_a3 = geoJsonProps.ISO_A3;
        
        // Buscar datos del país en nuestra base de datos
        let countryData = getCountryData(iso_a3);
        
        if (!countryData) {
          // Si no tenemos datos, crear objeto básico del GeoJSON
          countryData = {
            iso_a3: iso_a3,
            name: geoJsonProps.NAME || geoJsonProps.ADMIN || "Desconocido",
            capital: geoJsonProps.CAPITAL || "No disponible",
            population: geoJsonProps.POP_EST || 0,
            avgTemperature: 0,
            climate: "No disponible",
            gdpPerCapita: 0,
            currency: "No disponible",
            area: 0,
            continent: "No disponible",
            language: "No disponible"
          };
        }

        if (modeRef.current === "compare") {
          // Modo comparar: agregar o quitar país de la lista
          setSelectedCountries(prev => {
            const exists = prev.find(c => c.iso_a3 === iso_a3);
            if (exists) {
              // Si ya está, quitarlo
              console.log("❌ Removiendo país de comparación:", countryData.name);
              return prev.filter(c => c.iso_a3 !== iso_a3);
            } else {
              // Si no está, agregarlo
              console.log("✅ Agregando país a comparación:", countryData.name);
              return [...prev, countryData];
            }
          });
        } else {
          // Modo select: solo un país
          console.log("🔍 País seleccionado:", countryData.name);
          setSelectedCountries([countryData]);
        }
      });
    };

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Actualizar highlight cuando cambia la lista de países seleccionados
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const iso_codes = selectedCountries.map(c => c.iso_a3);
    
    if (iso_codes.length > 0) {
      map.current.setFilter("country-highlight", ['in', 'ISO_A3', ...iso_codes]);
    } else {
      map.current.setFilter("country-highlight", ['in', 'ISO_A3', '']);
    }
  }, [selectedCountries, mapLoaded]);

  // Cambiar colores cuando cambia la categoría
  useEffect(() => {
    console.log("🔄 Trigger de actualización de colores, categoria:", category, "mapLoaded:", mapLoaded, "geoJsonData:", !!geoJsonData);
    if (mapLoaded && geoJsonData) {
      // Actualizar ref primero
      categoryRef.current = category;
      
      // Esperar a que el mapa esté completamente listo
      if (map.current) {
        // Usar idle event para asegurar que el mapa terminó de renderizar
        const applyColors = () => {
          updateCountryColors();
          map.current?.off('idle', applyColors);
        };
        
        map.current.once('idle', applyColors);
        
        // Fallback por si acaso el evento no se dispara
        const timer = setTimeout(() => {
          updateCountryColors();
        }, 200);
        
        return () => {
          clearTimeout(timer);
          map.current?.off('idle', applyColors);
        };
      }
    }
  }, [category, mapLoaded, geoJsonData]);

  // Limpiar selección al cambiar modo
  useEffect(() => {
    if (mode === "drag") {
      setSelectedCountries([]);
    } else if (mode === "select" && selectedCountries.length > 1) {
      // Si cambiamos a modo select y hay varios países, mantener solo el último
      setSelectedCountries(prev => [prev[prev.length - 1]]);
    }
  }, [mode]);

  // Función para remover un país específico
  const removeCountry = (iso_a3: string) => {
    setSelectedCountries(prev => prev.filter(c => c.iso_a3 !== iso_a3));
  };

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-lg">
      <div 
        ref={mapContainer} 
        className="absolute top-0 left-0 w-full h-full"
      />

      {/* Panel de información de países */}
      {selectedCountries.length > 0 && (
        <div className="absolute top-4 right-4 max-h-[560px] overflow-y-auto z-10 space-y-3">
          {selectedCountries.map((country, index) => (
            <div 
              key={country.iso_a3}
              className="bg-white/95 p-4 rounded-xl shadow-2xl w-80 border-2 border-blue-500"
              style={{ borderColor: index === 0 ? '#0066ff' : '#00cc66' }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-800">
                      {country.name}
                    </h3>
                    {mode === "compare" && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        #{index + 1}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{country.continent}</p>
                </div>
                <button
                  onClick={() => removeCountry(country.iso_a3)}
                  className="text-gray-400 hover:text-gray-700 transition-colors text-xl leading-none font-light ml-2"
                >
                  ×
                </button>
              </div>

              <div className="space-y-2 text-sm">
                {/* Información básica */}
                <div className="pb-2 border-b border-gray-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-600 text-xs">Capital:</span>
                    <span className="font-semibold text-gray-800 text-xs">{country.capital}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-xs">Código:</span>
                    <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{country.iso_a3}</span>
                  </div>
                </div>

                {/* Población */}
                {country.population > 0 && (
                  <div className="bg-yellow-50 p-2 rounded-lg">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-sm">👥</span>
                      <span className="font-bold text-gray-700 text-xs">Población</span>
                    </div>
                    <p className="text-lg font-bold text-yellow-700">
                      {country.population.toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Clima */}
                {country.avgTemperature !== 0 && (
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-sm">🌡️</span>
                      <span className="font-bold text-gray-700 text-xs">Clima</span>
                    </div>
                    <p className="text-lg font-bold text-blue-700">
                      {country.avgTemperature > 0 ? '+' : ''}{country.avgTemperature}°C
                    </p>
                    <p className="text-xs text-gray-600 mt-1">{country.climate}</p>
                  </div>
                )}

                {/* Economía */}
                {country.gdpPerCapita > 0 && (
                  <div className="bg-green-50 p-2 rounded-lg">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-sm">💰</span>
                      <span className="font-bold text-gray-700 text-xs">PIB per cápita</span>
                    </div>
                    <p className="text-lg font-bold text-green-700">
                      ${country.gdpPerCapita.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">{country.currency}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mensaje de ayuda en modo comparar */}
      {mode === "compare" && selectedCountries.length === 0 && (
        <div className="absolute top-4 right-4 bg-blue-50 border-2 border-blue-300 p-4 rounded-lg shadow-lg z-10 w-80">
          <p className="text-sm font-semibold text-blue-800 mb-2">
            ⚖️ Modo Comparación
          </p>
          <p className="text-xs text-blue-700">
            Haz click en varios países para compararlos. Puedes seleccionar todos los que quieras.
          </p>
        </div>
      )}

      {/* Leyenda de colores */}
      {category && mapLoaded && (
        <div className="absolute bottom-20 right-4 bg-white/95 p-3 rounded-lg shadow-lg z-10 w-64">
          <p className="text-xs font-bold text-gray-700 mb-2">
            {category === 'clima' && '🌡️ Temperatura Promedio'}
            {category === 'población' && '👥 Población'}
            {category === 'economía' && '💰 PIB per Cápita'}
          </p>
          <div className="space-y-1 text-xs">
            {category === 'clima' && (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 rounded" style={{backgroundColor: '#1a237e'}}></div>
                  <span className="text-gray-700">Muy frío (&lt; 0°C)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 rounded" style={{backgroundColor: '#1976d2'}}></div>
                  <span className="text-gray-700">Frío (0-10°C)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 rounded" style={{backgroundColor: '#fff176'}}></div>
                  <span className="text-gray-700">Templado (10-20°C)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 rounded" style={{backgroundColor: '#ff9800'}}></div>
                  <span className="text-gray-700">Cálido (20-25°C)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 rounded" style={{backgroundColor: '#f44336'}}></div>
                  <span className="text-gray-700">Muy cálido (&gt; 25°C)</span>
                </div>
              </>
            )}
            {category === 'población' && (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 rounded" style={{backgroundColor: '#fff9c4'}}></div>
                  <span className="text-gray-700">&lt; 1M</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 rounded" style={{backgroundColor: '#ffeb3b'}}></div>
                  <span className="text-gray-700">1M - 10M</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 rounded" style={{backgroundColor: '#ffc107'}}></div>
                  <span className="text-gray-700">10M - 30M</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 rounded" style={{backgroundColor: '#ff5722'}}></div>
                  <span className="text-gray-700">30M - 100M</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 rounded" style={{backgroundColor: '#d32f2f'}}></div>
                  <span className="text-gray-700">&gt; 100M</span>
                </div>
              </>
            )}
            {category === 'economía' && (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 rounded" style={{backgroundColor: '#b71c1c'}}></div>
                  <span className="text-gray-700">&lt; $2,000</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 rounded" style={{backgroundColor: '#ff9800'}}></div>
                  <span className="text-gray-700">$2,000 - $10,000</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 rounded" style={{backgroundColor: '#ffeb3b'}}></div>
                  <span className="text-gray-700">$10,000 - $20,000</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 rounded" style={{backgroundColor: '#8bc34a'}}></div>
                  <span className="text-gray-700">$20,000 - $40,000</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 rounded" style={{backgroundColor: '#4caf50'}}></div>
                  <span className="text-gray-700">&gt; $40,000</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Indicador de modo */}
      <div className="absolute top-4 left-4 bg-white/90 px-4 py-2 rounded-lg shadow-md z-10">
        <p className="text-sm font-medium text-gray-700">
          Modo: <span className="text-blue-600 font-bold">
            {mode === "select" ? "🔍 Seleccionar" : mode === "drag" ? "🖐️ Arrastrar" : "⚖️ Comparar"}
          </span>
        </p>
        {category && (
          <p className="text-xs text-gray-600 mt-1">
            Categoría: <span className="font-semibold capitalize">{category}</span>
          </p>
        )}
        {mode === "compare" && selectedCountries.length > 0 && (
          <p className="text-xs text-blue-600 mt-1 font-semibold">
            {selectedCountries.length} país{selectedCountries.length !== 1 ? 'es' : ''} seleccionado{selectedCountries.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Controles del mapa */}
      <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg shadow-md z-10">
        <p className="text-xs font-semibold text-gray-600 mb-1">💡 Controles:</p>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>• <strong>Click:</strong> Seleccionar país</li>
          <li>• <strong>Arrastrar:</strong> Mover mapa</li>
          <li>• <strong>Scroll:</strong> Zoom</li>
        </ul>
      </div>

      {/* Indicador de carga */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600 font-medium">Cargando mapa y datos...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorldMap3D;