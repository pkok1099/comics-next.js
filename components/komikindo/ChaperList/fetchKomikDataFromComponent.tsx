'use client';
import { fetchKomikData } from '@/app/api';
import { KomikData } from '@/types/komik';

export const fetchKomikDataFromComponent = async (
  id: string,
  setKomikData: React.Dispatch<React.SetStateAction<KomikData | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  try {
    const komik = await fetchKomikData(id);
    setKomikData(komik);
  } catch (error) {
    console.error('Error fetching komik data:', error);
  } finally {
    setLoading(false);
  }
};
