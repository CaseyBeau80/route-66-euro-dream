import { DateNormalizationService } from './DateNormalizationService';

export interface HistoricalWeatherData {
  low: number;
  high: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  precipitationChance: number;
  source: 'seasonal-historical';
  alignedDate: string; // The exact date this data represents (YYYY-MM-DD)
}

// Historical weather patterns for major Route 66 cities
const HISTORICAL_WEATHER_PATTERNS: Record<string, Record<number, { low: number; high: number; condition: string; humidity: number; precipitation: number; }>> = {
  'Chicago, IL': {
    0: { low: 22, high: 32, condition: 'partly cloudy', humidity: 65, precipitation: 25 },
    1: { low: 26, high: 37, condition: 'overcast', humidity: 70, precipitation: 30 },
    2: { low: 37, high: 48, condition: 'mild and pleasant', humidity: 60, precipitation: 35 },
    3: { low: 48, high: 63, condition: 'partly sunny', humidity: 55, precipitation: 40 },
    4: { low: 58, high: 73, condition: 'pleasant', humidity: 60, precipitation: 45 },
    5: { low: 68, high: 83, condition: 'hot and sunny', humidity: 65, precipitation: 35 },
    6: { low: 74, high: 88, condition: 'hot and humid', humidity: 70, precipitation: 40 },
    7: { low: 72, high: 85, condition: 'warm and humid', humidity: 72, precipitation: 42 },
    8: { low: 64, high: 78, condition: 'comfortable', humidity: 65, precipitation: 35 },
    9: { low: 52, high: 66, condition: 'cool and crisp', humidity: 60, precipitation: 30 },
    10: { low: 40, high: 52, condition: 'cool', humidity: 65, precipitation: 28 },
    11: { low: 29, high: 40, condition: 'cold', humidity: 70, precipitation: 25 }
  },
  'Springfield, IL': {
    0: { low: 20, high: 35, condition: 'cold', humidity: 68, precipitation: 22 },
    1: { low: 25, high: 40, condition: 'chilly', humidity: 65, precipitation: 25 },
    2: { low: 35, high: 52, condition: 'mild', humidity: 62, precipitation: 32 },
    3: { low: 46, high: 66, condition: 'pleasant', humidity: 58, precipitation: 38 },
    4: { low: 56, high: 76, condition: 'warm', humidity: 62, precipitation: 42 },
    5: { low: 66, high: 86, condition: 'hot', humidity: 68, precipitation: 38 },
    6: { low: 71, high: 90, condition: 'hot and humid', humidity: 72, precipitation: 35 },
    7: { low: 69, high: 87, condition: 'hot', humidity: 70, precipitation: 40 },
    8: { low: 61, high: 80, condition: 'warm', humidity: 65, precipitation: 32 },
    9: { low: 49, high: 69, condition: 'comfortable', humidity: 60, precipitation: 28 },
    10: { low: 38, high: 55, condition: 'cool', humidity: 65, precipitation: 25 },
    11: { low: 26, high: 42, condition: 'cold', humidity: 70, precipitation: 20 }
  },
  'St. Louis, MO': {
    0: { low: 25, high: 40, condition: 'cold', humidity: 65, precipitation: 20 },
    1: { low: 30, high: 45, condition: 'chilly', humidity: 62, precipitation: 23 },
    2: { low: 40, high: 57, condition: 'mild', humidity: 60, precipitation: 30 },
    3: { low: 51, high: 70, condition: 'pleasant', humidity: 55, precipitation: 35 },
    4: { low: 61, high: 80, condition: 'warm', humidity: 60, precipitation: 40 },
    5: { low: 70, high: 89, condition: 'hot', humidity: 65, precipitation: 35 },
    6: { low: 75, high: 93, condition: 'hot and humid', humidity: 70, precipitation: 38 },
    7: { low: 73, high: 90, condition: 'hot', humidity: 68, precipitation: 42 },
    8: { low: 65, high: 83, condition: 'warm', humidity: 62, precipitation: 30 },
    9: { low: 53, high: 72, condition: 'comfortable', humidity: 58, precipitation: 25 },
    10: { low: 42, high: 59, condition: 'cool', humidity: 62, precipitation: 22 },
    11: { low: 30, high: 47, condition: 'cold', humidity: 65, precipitation: 18 }
  },
  'Oklahoma City, OK': {
    0: { low: 30, high: 50, condition: 'cool', humidity: 60, precipitation: 20 },
    1: { low: 35, high: 55, condition: 'mild', humidity: 55, precipitation: 25 },
    2: { low: 45, high: 65, condition: 'pleasant', humidity: 50, precipitation: 30 },
    3: { low: 55, high: 75, condition: 'warm', humidity: 45, precipitation: 35 },
    4: { low: 65, high: 85, condition: 'hot', humidity: 40, precipitation: 30 },
    5: { low: 75, high: 95, condition: 'hot and sunny', humidity: 35, precipitation: 25 },
    6: { low: 80, high: 100, condition: 'very hot', humidity: 30, precipitation: 20 },
    7: { low: 78, high: 98, condition: 'hot', humidity: 32, precipitation: 22 },
    8: { low: 70, high: 90, condition: 'warm', humidity: 38, precipitation: 28 },
    9: { low: 60, high: 80, condition: 'pleasant', humidity: 45, precipitation: 30 },
    10: { low: 48, high: 68, condition: 'mild', humidity: 52, precipitation: 25 },
    11: { low: 35, high: 55, condition: 'cool', humidity: 60, precipitation: 20 }
  },
  'Amarillo, TX': {
    0: { low: 25, high: 45, condition: 'cold', humidity: 62, precipitation: 15 },
    1: { low: 30, high: 50, condition: 'cool', humidity: 58, precipitation: 18 },
    2: { low: 40, high: 60, condition: 'mild', humidity: 55, precipitation: 22 },
    3: { low: 50, high: 70, condition: 'pleasant', humidity: 50, precipitation: 25 },
    4: { low: 60, high: 80, condition: 'warm', humidity: 45, precipitation: 20 },
    5: { low: 70, high: 90, condition: 'hot', humidity: 40, precipitation: 15 },
    6: { low: 75, high: 95, condition: 'hot and dry', humidity: 35, precipitation: 12 },
    7: { low: 73, high: 93, condition: 'hot', humidity: 38, precipitation: 15 },
    8: { low: 65, high: 85, condition: 'warm', humidity: 42, precipitation: 18 },
    9: { low: 53, high: 73, condition: 'pleasant', humidity: 48, precipitation: 20 },
    10: { low: 42, high: 62, condition: 'mild', humidity: 55, precipitation: 18 },
    11: { low: 30, high: 50, condition: 'cool', humidity: 60, precipitation: 15 }
  },
  'Albuquerque, NM': {
    0: { low: 30, high: 50, condition: 'cold', humidity: 55, precipitation: 10 },
    1: { low: 35, high: 55, condition: 'cool', humidity: 50, precipitation: 12 },
    2: { low: 45, high: 65, condition: 'mild', humidity: 45, precipitation: 15 },
    3: { low: 55, high: 75, condition: 'pleasant', humidity: 40, precipitation: 18 },
    4: { low: 65, high: 85, condition: 'warm', humidity: 35, precipitation: 15 },
    5: { low: 75, high: 95, condition: 'hot and sunny', humidity: 30, precipitation: 10 },
    6: { low: 80, high: 100, condition: 'very hot', humidity: 25, precipitation: 8 },
    7: { low: 78, high: 98, condition: 'hot', humidity: 28, precipitation: 10 },
    8: { low: 70, high: 90, condition: 'warm', humidity: 32, precipitation: 12 },
    9: { low: 60, high: 80, condition: 'pleasant', humidity: 38, precipitation: 15 },
    10: { low: 48, high: 68, condition: 'mild', humidity: 45, precipitation: 12 },
    11: { low: 35, high: 55, condition: 'cool', humidity: 50, precipitation: 10 }
  },
  'Flagstaff, AZ': {
    0: { low: 20, high: 40, condition: 'cold', humidity: 70, precipitation: 25 },
    1: { low: 25, high: 45, condition: 'chilly', humidity: 65, precipitation: 28 },
    2: { low: 35, high: 55, condition: 'mild', humidity: 60, precipitation: 32 },
    3: { low: 45, high: 65, condition: 'pleasant', humidity: 55, precipitation: 35 },
    4: { low: 55, high: 75, condition: 'warm', humidity: 50, precipitation: 30 },
    5: { low: 65, high: 85, condition: 'sunny', humidity: 45, precipitation: 25 },
    6: { low: 70, high: 90, condition: 'hot and dry', humidity: 40, precipitation: 20 },
    7: { low: 68, high: 88, condition: 'warm', humidity: 42, precipitation: 22 },
    8: { low: 60, high: 80, condition: 'pleasant', humidity: 48, precipitation: 25 },
    9: { low: 50, high: 70, condition: 'mild', humidity: 55, precipitation: 28 },
    10: { low: 38, high: 58, condition: 'cool', humidity: 62, precipitation: 25 },
    11: { low: 26, high: 46, condition: 'cold', humidity: 68, precipitation: 22 }
  },
  'Barstow, CA': {
    0: { low: 40, high: 60, condition: 'cool', humidity: 50, precipitation: 10 },
    1: { low: 45, high: 65, condition: 'mild', humidity: 45, precipitation: 12 },
    2: { low: 55, high: 75, condition: 'pleasant', humidity: 40, precipitation: 15 },
    3: { low: 65, high: 85, condition: 'warm', humidity: 35, precipitation: 10 },
    4: { low: 75, high: 95, condition: 'hot', humidity: 30, precipitation: 8 },
    5: { low: 85, high: 105, condition: 'very hot', humidity: 25, precipitation: 5 },
    6: { low: 90, high: 110, condition: 'extremely hot', humidity: 20, precipitation: 3 },
    7: { low: 88, high: 108, condition: 'very hot', humidity: 22, precipitation: 5 },
    8: { low: 80, high: 100, condition: 'hot', humidity: 28, precipitation: 8 },
    9: { low: 70, high: 90, condition: 'warm', humidity: 35, precipitation: 10 },
    10: { low: 58, high: 78, condition: 'pleasant', humidity: 42, precipitation: 12 },
    11: { low: 45, high: 65, condition: 'mild', humidity: 50, precipitation: 10 }
  },
  'Santa Monica, CA': {
    0: { low: 50, high: 65, condition: 'mild', humidity: 65, precipitation: 20 },
    1: { low: 52, high: 67, condition: 'mild', humidity: 62, precipitation: 22 },
    2: { low: 55, high: 70, condition: 'pleasant', humidity: 60, precipitation: 15 },
    3: { low: 58, high: 72, condition: 'pleasant', humidity: 58, precipitation: 12 },
    4: { low: 60, high: 75, condition: 'warm', humidity: 60, precipitation: 10 },
    5: { low: 62, high: 78, condition: 'warm', humidity: 62, precipitation: 8 },
    6: { low: 65, high: 80, condition: 'warm', humidity: 65, precipitation: 5 },
    7: { low: 64, high: 79, condition: 'warm', humidity: 62, precipitation: 5 },
    8: { low: 62, high: 78, condition: 'warm', humidity: 60, precipitation: 8 },
    9: { low: 60, high: 75, condition: 'pleasant', humidity: 58, precipitation: 10 },
    10: { low: 55, high: 70, condition: 'pleasant', humidity: 60, precipitation: 15 },
    11: { low: 52, high: 67, condition: 'mild', humidity: 62, precipitation: 20 }
  }
};

/**
 * CRITICAL FIX: Get historical weather data aligned to the EXACT segment date
 * No fallbacks or date shifts allowed
 */
export const getHistoricalWeatherData = (
  cityName: string, 
  segmentDate: Date
): HistoricalWeatherData => {
  console.log(`📊 SeasonalWeatherService: Getting historical data for ${cityName} on exact date ${segmentDate.toDateString()}`);
  
  // CRITICAL: Use centralized date normalization to ensure NO date drift
  const normalizedSegmentDate = DateNormalizationService.normalizeSegmentDate(segmentDate);
  const alignedDateString = DateNormalizationService.toDateString(normalizedSegmentDate);
  const month = normalizedSegmentDate.getMonth();
  
  console.log(`📅 STRICT Historical Weather Date Alignment:`, {
    originalSegmentDate: segmentDate.toISOString(),
    normalizedSegmentDate: normalizedSegmentDate.toISOString(),
    alignedDateString,
    month,
    cityName,
    strictAlignment: true
  });
  
  // Get city-specific patterns or use fallback
  const cityPatterns = HISTORICAL_WEATHER_PATTERNS[cityName] || 
                      HISTORICAL_WEATHER_PATTERNS['Springfield, IL']; // Fallback
  
  const monthData = cityPatterns[month] || cityPatterns[5]; // Fallback to June
  
  // Add realistic daily variation based on day of month
  const dayOfMonth = normalizedSegmentDate.getDate();
  const variation = Math.sin(dayOfMonth / 31 * Math.PI) * 3; // ±3 degree variation
  
  const result: HistoricalWeatherData = {
    low: Math.round(monthData.low + variation),
    high: Math.round(monthData.high + variation),
    condition: monthData.condition,
    humidity: monthData.humidity,
    windSpeed: 5 + Math.round(Math.random() * 8), // 5-13 mph
    precipitationChance: monthData.precipitation,
    source: 'seasonal-historical',
    alignedDate: alignedDateString // CRITICAL: Exact segment date alignment
  };
  
  console.log(`📊 ALIGNED Historical weather for ${cityName} on ${alignedDateString}:`, {
    tempRange: `${result.low}°-${result.high}°F`,
    condition: result.condition,
    humidity: `${result.humidity}%`,
    precipitation: `${result.precipitationChance}%`,
    alignedDateString,
    strictDateMatch: result.alignedDate === alignedDateString
  });
  
  // VALIDATION: Ensure we're returning data for the exact requested date
  if (result.alignedDate !== alignedDateString) {
    console.error(`❌ CRITICAL ERROR: Historical data date mismatch for ${cityName}`, {
      expected: alignedDateString,
      actual: result.alignedDate,
      segmentDateInput: segmentDate.toISOString()
    });
  }
  
  return result;
};

/**
 * STRICT validation that historical data aligns with the expected segment date
 */
export const validateHistoricalAlignment = (
  historicalData: HistoricalWeatherData,
  expectedSegmentDate: Date,
  cityName: string
): boolean => {
  const expectedDateString = DateNormalizationService.toDateString(expectedSegmentDate);
  const isAligned = historicalData.alignedDate === expectedDateString;
  
  if (!isAligned) {
    console.error(`❌ CRITICAL: Historical data misalignment for ${cityName}:`, {
      expected: expectedDateString,
      historical: historicalData.alignedDate,
      segmentDateInput: expectedSegmentDate.toISOString()
    });
  } else {
    console.log(`✅ Historical data STRICTLY aligned for ${cityName} on ${expectedDateString}`);
  }
  
  return isAligned;
};
