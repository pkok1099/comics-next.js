'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { SkeletonLoader } from '@/ChapterList/SkeletonLoader';
import { KomikData } from '@/types/komik';
import { MainContent } from './MainContent';
import { fetchKomikDataFromComponent } from './fetchKomikDataFromComponent';

export function ClientContent() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? '';
  const [komikData, setKomikData] = useState<KomikData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('judul');

  useEffect(() => {
    if (id) {
      fetchKomikDataFromComponent(id, setKomikData, setLoading);
    }
  }, [id]);

  if (loading || !komikData) return <SkeletonLoader />;

  return (
    <MainContent
      komikData={komikData}
      id={id}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
  );
}