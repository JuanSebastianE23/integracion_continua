// Servicio para interactuar con MapTiler API
// Nota: Necesitarás obtener una API key gratuita de https://www.maptiler.com/cloud/

const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY || 'get_your_own_OpIi9ZULNHzrESv6T2vL'; // Key pública de ejemplo

export interface MapTilerCountryData {
  name: string;
  capital?: string;
  population?: number;
  area?: number;
  currency?: string;
  languages?: string[];
  timezone?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

/**
 * Obtiene la URL de textura del mapa de MapTiler
 */
export const getMapTilerTextureUrl = (style: 'satellite' | 'streets' | 'topo' = 'satellite'): string => {
  const styleMap: Record<string, string> = {
    satellite: 'satellite',
    streets: 'streets-v2',
    topo: 'topo-v2'
  };
  
  return `https://api.maptiler.com/maps/${styleMap[style]}/style.json?key=${MAPTILER_API_KEY}`;
};

/**
 * Obtiene la URL de tiles de MapTiler para usar como textura
 */
export const getMapTilerTileUrl = (x: number, y: number, z: number): string => {
  return `https://api.maptiler.com/tiles/satellite-v2/${z}/${x}/${y}.jpg?key=${MAPTILER_API_KEY}`;
};

/**
 * Obtiene información adicional de un país usando MapTiler Geocoding API
 */
export const getCountryInfoFromMapTiler = async (countryName: string): Promise<MapTilerCountryData | null> => {
  try {
    const response = await fetch(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(countryName)}.json?key=${MAPTILER_API_KEY}&limit=1`
    );
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      return {
        name: feature.properties.name || countryName,
        coordinates: feature.geometry.coordinates 
          ? { lng: feature.geometry.coordinates[0], lat: feature.geometry.coordinates[1] }
          : undefined
      };
    }
    return null;
  } catch (error) {
    console.warn('Error obteniendo datos de MapTiler:', error);
    return null;
  }
};

/**
 * Obtiene la textura del mapa mundial de MapTiler
 */
export const getWorldMapTexture = (): string => {
  // Usar una textura de mapa mundial de MapTiler
  return `https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${MAPTILER_API_KEY}`;
};

