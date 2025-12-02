'use client';
import {NextRequest, NextResponse} from 'next/server';

interface IBGECity {
  id: number;
  nome: string;
  municipio: {
    id: number;
    nome: string;
    microrregiao: {
      id: number;
      nome: string;
      mesorregiao: {
        id: number;
        nome: string;
        UF: {
          id: number;
          sigla: string;
          nome: string;
          regiao: {
            id: number;
            sigla: string;
            nome: string;
          };
        };
      };
    };
  };
}

let citiesCache: {nome: string; uf: string}[] = [];
let lastFetch = 0;

async function getCities() {
  const now = Date.now();
  // Cache for 24 hours
  if (citiesCache.length > 0 && now - lastFetch < 24 * 60 * 60 * 1000) {
    return citiesCache;
  }

  try {
    const response = await fetch(
      'https://servicodados.ibge.gov.br/api/v1/localidades/municipios'
    );
    if (!response.ok) {
      throw new Error('Failed to fetch IBGE data');
    }
    const data: IBGECity[] = await response.json();
    citiesCache = data.map(city => ({
      nome: city.nome,
      uf: city.municipio.microrregiao.mesorregiao.UF.sigla,
    }));
    lastFetch = now;
    return citiesCache;
  } catch (error) {
    console.error('Error fetching cities from IBGE:', error);
    // Return stale cache if available
    return citiesCache.length > 0 ? citiesCache : [];
  }
}

export async function GET(request: NextRequest) {
  const {searchParams} = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() ?? '';

  if (!query) {
    return NextResponse.json([]);
  }

  const allCities = await getCities();

  const filteredCities = allCities
    .filter(city => city.nome.toLowerCase().includes(query))
    .slice(0, 10); // Limit to 10 results

  return NextResponse.json(
    filteredCities.map(city => `${city.nome}, ${city.uf}`)
  );
}
