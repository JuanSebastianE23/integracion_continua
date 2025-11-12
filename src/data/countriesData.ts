export interface CountryInfo {
  iso_a3: string;
  name: string;
  capital: string;
  population: number;
  // Datos de clima (temperatura promedio anual en °C)
  avgTemperature: number;
  climate: string;
  // Datos económicos (PIB per cápita en USD)
  gdpPerCapita: number;
  currency: string;
  // Datos adicionales
  area: number; // km²
  continent: string;
  language: string;
}

export const countriesData: Record<string, CountryInfo> = {
  // América del Norte
  USA: {
    iso_a3: "USA",
    name: "Estados Unidos",
    capital: "Washington D.C.",
    population: 331900000,
    avgTemperature: 12,
    climate: "Variado (continental, subtropical, árido)",
    gdpPerCapita: 76398,
    currency: "Dólar estadounidense (USD)",
    area: 9833517,
    continent: "América del Norte",
    language: "Inglés"
  },
  CAN: {
    iso_a3: "CAN",
    name: "Canadá",
    capital: "Ottawa",
    population: 38250000,
    avgTemperature: -3,
    climate: "Continental frío",
    gdpPerCapita: 52051,
    currency: "Dólar canadiense (CAD)",
    area: 9984670,
    continent: "América del Norte",
    language: "Inglés, Francés"
  },
  MEX: {
    iso_a3: "MEX",
    name: "México",
    capital: "Ciudad de México",
    population: 128900000,
    avgTemperature: 19,
    climate: "Tropical, desértico",
    gdpPerCapita: 10405,
    currency: "Peso mexicano (MXN)",
    area: 1964375,
    continent: "América del Norte",
    language: "Español"
  },

  // América del Sur
  BRA: {
    iso_a3: "BRA",
    name: "Brasil",
    capital: "Brasilia",
    population: 214300000,
    avgTemperature: 25,
    climate: "Tropical",
    gdpPerCapita: 8917,
    currency: "Real brasileño (BRL)",
    area: 8515767,
    continent: "América del Sur",
    language: "Portugués"
  },
  ARG: {
    iso_a3: "ARG",
    name: "Argentina",
    capital: "Buenos Aires",
    population: 45810000,
    avgTemperature: 14,
    climate: "Templado, subtropical",
    gdpPerCapita: 10636,
    currency: "Peso argentino (ARS)",
    area: 2780400,
    continent: "América del Sur",
    language: "Español"
  },
  COL: {
    iso_a3: "COL",
    name: "Colombia",
    capital: "Bogotá",
    population: 51270000,
    avgTemperature: 24,
    climate: "Tropical, ecuatorial",
    gdpPerCapita: 6417,
    currency: "Peso colombiano (COP)",
    area: 1141748,
    continent: "América del Sur",
    language: "Español"
  },
  CHL: {
    iso_a3: "CHL",
    name: "Chile",
    capital: "Santiago",
    population: 19210000,
    avgTemperature: 12,
    climate: "Templado mediterráneo",
    gdpPerCapita: 15355,
    currency: "Peso chileno (CLP)",
    area: 756102,
    continent: "América del Sur",
    language: "Español"
  },
  PER: {
    iso_a3: "PER",
    name: "Perú",
    capital: "Lima",
    population: 33720000,
    avgTemperature: 19,
    climate: "Tropical, andino",
    gdpPerCapita: 6692,
    currency: "Sol peruano (PEN)",
    area: 1285216,
    continent: "América del Sur",
    language: "Español"
  },

  // Europa
  GBR: {
    iso_a3: "GBR",
    name: "Reino Unido",
    capital: "Londres",
    population: 67330000,
    avgTemperature: 9,
    climate: "Templado oceánico",
    gdpPerCapita: 46371,
    currency: "Libra esterlina (GBP)",
    area: 242495,
    continent: "Europa",
    language: "Inglés"
  },
  FRA: {
    iso_a3: "FRA",
    name: "Francia",
    capital: "París",
    population: 67750000,
    avgTemperature: 11,
    climate: "Templado oceánico",
    gdpPerCapita: 43518,
    currency: "Euro (EUR)",
    area: 643801,
    continent: "Europa",
    language: "Francés"
  },
  DEU: {
    iso_a3: "DEU",
    name: "Alemania",
    capital: "Berlín",
    population: 83240000,
    avgTemperature: 9,
    climate: "Templado continental",
    gdpPerCapita: 50802,
    currency: "Euro (EUR)",
    area: 357114,
    continent: "Europa",
    language: "Alemán"
  },
  ITA: {
    iso_a3: "ITA",
    name: "Italia",
    capital: "Roma",
    population: 59550000,
    avgTemperature: 13,
    climate: "Mediterráneo",
    gdpPerCapita: 35551,
    currency: "Euro (EUR)",
    area: 301340,
    continent: "Europa",
    language: "Italiano"
  },
  ESP: {
    iso_a3: "ESP",
    name: "España",
    capital: "Madrid",
    population: 47350000,
    avgTemperature: 14,
    climate: "Mediterráneo",
    gdpPerCapita: 30103,
    currency: "Euro (EUR)",
    area: 505990,
    continent: "Europa",
    language: "Español"
  },
  RUS: {
    iso_a3: "RUS",
    name: "Rusia",
    capital: "Moscú",
    population: 144100000,
    avgTemperature: -5,
    climate: "Continental frío",
    gdpPerCapita: 12172,
    currency: "Rublo ruso (RUB)",
    area: 17098242,
    continent: "Europa/Asia",
    language: "Ruso"
  },

  // Asia
  CHN: {
    iso_a3: "CHN",
    name: "China",
    capital: "Pekín",
    population: 1412000000,
    avgTemperature: 8,
    climate: "Variado (subtropical, continental)",
    gdpPerCapita: 12556,
    currency: "Yuan chino (CNY)",
    area: 9596961,
    continent: "Asia",
    language: "Mandarín"
  },
  IND: {
    iso_a3: "IND",
    name: "India",
    capital: "Nueva Delhi",
    population: 1408000000,
    avgTemperature: 25,
    climate: "Tropical monzónico",
    gdpPerCapita: 2389,
    currency: "Rupia india (INR)",
    area: 3287263,
    continent: "Asia",
    language: "Hindi, Inglés"
  },
  JPN: {
    iso_a3: "JPN",
    name: "Japón",
    capital: "Tokio",
    population: 125800000,
    avgTemperature: 11,
    climate: "Templado, subtropical",
    gdpPerCapita: 39285,
    currency: "Yen japonés (JPY)",
    area: 377975,
    continent: "Asia",
    language: "Japonés"
  },
  KOR: {
    iso_a3: "KOR",
    name: "Corea del Sur",
    capital: "Seúl",
    population: 51780000,
    avgTemperature: 11,
    climate: "Templado continental",
    gdpPerCapita: 34998,
    currency: "Won surcoreano (KRW)",
    area: 100210,
    continent: "Asia",
    language: "Coreano"
  },
  IDN: {
    iso_a3: "IDN",
    name: "Indonesia",
    capital: "Yakarta",
    population: 273800000,
    avgTemperature: 26,
    climate: "Tropical ecuatorial",
    gdpPerCapita: 4333,
    currency: "Rupia indonesia (IDR)",
    area: 1904569,
    continent: "Asia",
    language: "Indonesio"
  },
  THA: {
    iso_a3: "THA",
    name: "Tailandia",
    capital: "Bangkok",
    population: 69950000,
    avgTemperature: 28,
    climate: "Tropical monzónico",
    gdpPerCapita: 7233,
    currency: "Baht tailandés (THB)",
    area: 513120,
    continent: "Asia",
    language: "Tailandés"
  },

  // África
  EGY: {
    iso_a3: "EGY",
    name: "Egipto",
    capital: "El Cairo",
    population: 104300000,
    avgTemperature: 22,
    climate: "Desértico",
    gdpPerCapita: 3876,
    currency: "Libra egipcia (EGP)",
    area: 1002450,
    continent: "África",
    language: "Árabe"
  },
  ZAF: {
    iso_a3: "ZAF",
    name: "Sudáfrica",
    capital: "Pretoria",
    population: 59390000,
    avgTemperature: 17,
    climate: "Subtropical, mediterráneo",
    gdpPerCapita: 6994,
    currency: "Rand sudafricano (ZAR)",
    area: 1221037,
    continent: "África",
    language: "Inglés, Afrikáans"
  },
  NGA: {
    iso_a3: "NGA",
    name: "Nigeria",
    capital: "Abuja",
    population: 211400000,
    avgTemperature: 27,
    climate: "Tropical",
    gdpPerCapita: 2097,
    currency: "Naira nigeriana (NGN)",
    area: 923768,
    continent: "África",
    language: "Inglés"
  },
  KEN: {
    iso_a3: "KEN",
    name: "Kenia",
    capital: "Nairobi",
    population: 53770000,
    avgTemperature: 24,
    climate: "Tropical, semiárido",
    gdpPerCapita: 2006,
    currency: "Chelín keniano (KES)",
    area: 580367,
    continent: "África",
    language: "Inglés, Suajili"
  },

  // Oceanía
  AUS: {
    iso_a3: "AUS",
    name: "Australia",
    capital: "Canberra",
    population: 25690000,
    avgTemperature: 22,
    climate: "Árido, tropical, templado",
    gdpPerCapita: 59934,
    currency: "Dólar australiano (AUD)",
    area: 7692024,
    continent: "Oceanía",
    language: "Inglés"
  },
  NZL: {
    iso_a3: "NZL",
    name: "Nueva Zelanda",
    capital: "Wellington",
    population: 5090000,
    avgTemperature: 11,
    climate: "Templado oceánico",
    gdpPerCapita: 47278,
    currency: "Dólar neozelandés (NZD)",
    area: 268021,
    continent: "Oceanía",
    language: "Inglés, Maorí"
  },

  // Medio Oriente
  SAU: {
    iso_a3: "SAU",
    name: "Arabia Saudita",
    capital: "Riad",
    population: 35340000,
    avgTemperature: 25,
    climate: "Desértico",
    gdpPerCapita: 23186,
    currency: "Riyal saudí (SAR)",
    area: 2149690,
    continent: "Asia",
    language: "Árabe"
  },
  TUR: {
    iso_a3: "TUR",
    name: "Turquía",
    capital: "Ankara",
    population: 84780000,
    avgTemperature: 12,
    climate: "Templado, mediterráneo",
    gdpPerCapita: 9587,
    currency: "Lira turca (TRY)",
    area: 783562,
    continent: "Europa/Asia",
    language: "Turco"
  },
  ARE: {
    iso_a3: "ARE",
    name: "Emiratos Árabes Unidos",
    capital: "Abu Dabi",
    population: 9890000,
    avgTemperature: 28,
    climate: "Desértico",
    gdpPerCapita: 43103,
    currency: "Dírham (AED)",
    area: 83600,
    continent: "Asia",
    language: "Árabe"
  }
};

// Función para obtener datos de un país
export const getCountryData = (iso_a3: string): CountryInfo | null => {
  return countriesData[iso_a3] || null;
};

// Función para calcular color basado en temperatura
export const getTemperatureColor = (temperature: number): string => {
  // Rango: -10°C (oscuro/frío) a 30°C (brillante/cálido)
  const normalized = Math.max(0, Math.min(1, (temperature + 10) / 40));
  
  if (normalized < 0.2) return '#1a237e'; // Muy frío - Azul muy oscuro
  if (normalized < 0.4) return '#1976d2'; // Frío - Azul oscuro
  if (normalized < 0.6) return '#64b5f6'; // Templado frío - Azul claro
  if (normalized < 0.7) return '#fff176'; // Templado - Amarillo brillante
  if (normalized < 0.85) return '#ff9800'; // Cálido - Naranja brillante
  return '#f44336'; // Muy cálido - Rojo brillante
};

// Función para calcular color basado en población
export const getPopulationColor = (population: number): string => {
  // Escala logarítmica - más población = más oscuro/intenso
  const logPop = Math.log10(population);
  
  if (logPop < 6) return '#fff9c4'; // < 1M - Amarillo muy claro
  if (logPop < 6.5) return '#ffeb3b'; // 1-3M - Amarillo brillante
  if (logPop < 7) return '#ffc107'; // 3-10M - Ámbar brillante
  if (logPop < 7.5) return '#ff9800'; // 10-30M - Naranja brillante
  if (logPop < 8) return '#ff5722'; // 30-100M - Naranja rojizo brillante
  return '#d32f2f'; // > 100M - Rojo oscuro intenso
};

// Función para calcular color basado en PIB per cápita
export const getGDPColor = (gdpPerCapita: number): string => {
  // Más PIB = color más brillante/verde
  if (gdpPerCapita < 2000) return '#b71c1c'; // Muy bajo - Rojo oscuro
  if (gdpPerCapita < 5000) return '#f44336'; // Bajo - Rojo brillante
  if (gdpPerCapita < 10000) return '#ff9800'; // Medio-bajo - Naranja brillante
  if (gdpPerCapita < 20000) return '#ffeb3b'; // Medio - Amarillo brillante
  if (gdpPerCapita < 40000) return '#8bc34a'; // Medio-alto - Verde claro brillante
  return '#4caf50'; // Alto - Verde brillante
};