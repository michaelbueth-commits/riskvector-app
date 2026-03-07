// Travel Advisory API Integration
// Source: https://findapis.com/fr/api/travel-advisory
// Provides a daily, stable base risk score (1-5) for each country.
// NO API KEY REQUIRED.

import { countries } from './countries';

export interface TravelAdvisory {
  countryCode: string;
  countryName: string;
  continent: string;
  score: number;
  message: string;
  source: string;
}

const API_URL = 'https://www.travel-advisory.info/api';

let advisoryCache: Record<string, TravelAdvisory> | null = null;
let lastFetch: number = 0;

// Fetches and caches all advisories
async function fetchAllAdvisories(): Promise<Record<string, TravelAdvisory>> {
  const now = Date.now();
  // Cache for 6 hours as data updates daily
  if (advisoryCache && (now - lastFetch < 6 * 60 * 60 * 1000)) {
    return advisoryCache;
  }

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      console.error('Failed to fetch travel advisories');
      return advisoryCache || {};
    }
    const data = await response.json();
    
    advisoryCache = data.data;
    lastFetch = now;
    
    return advisoryCache || {};

  } catch (error) {
    console.error('Travel Advisory API fetch error:', error);
    return advisoryCache || {};
  }
}

// Gets a single advisory for a country code
export async function getTravelAdvisory(countryCode: string): Promise<TravelAdvisory | null> {
  const advisories = await fetchAllAdvisories();
  return advisories[countryCode] || null;
}

// Converts the 1-5 score to our 1-100 scale
export function convertAdvisoryScore(score: number): number {
  // Mapping: 1->10, 2->30, 3->50, 4->70, 5->90
  const scoreMap: Record<number, number> = {
    1: 10,
    2: 30,
    3: 50,
    4: 70,
    5: 90
  };
  return scoreMap[Math.round(score)] || 20; // Default to a low-ish score
}
