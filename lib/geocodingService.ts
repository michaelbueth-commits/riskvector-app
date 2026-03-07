// Geocoding Service using OpenStreetMap Nominatim
// Free, no API key required

export interface GeocodeResult {
  lat: number;
  lon: number;
  displayName: string;
  countryCode: string;
}

export async function geocodeCity(city: string, country?: string): Promise<GeocodeResult | null> {
  let query = `q=${encodeURIComponent(city)}`;
  if (country) {
    query += `&countrycodes=${encodeURIComponent(country)}`;
  }
  
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${query}&format=json&limit=1`
    );

    if (!response.ok) {
      console.error('Geocoding API request failed');
      return null;
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      return {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        displayName: result.display_name,
        countryCode: result.address?.country_code?.toUpperCase(),
      };
    }

    return null;

  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}
