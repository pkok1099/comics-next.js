'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { KomikCard } from 'components/komikindo/KomikCard';
import { SkeletonLoader } from 'components/komikindo/SkeletonLoader';

async function fetchHomePageData() {
  const response = await fetch('/api/homepage');
  if (!response.ok) {
    throw new Error('Failed to fetch homepage data');
  }
  return response.json();
}

interface Komik {
  title: string;
  cover: string;
  url: string;
  link: string;
}

interface KomikCardData {
  judul: string;
  thumbnail: string;
  link: string;
}

interface KomikHomeState {
  popular: Komik[];
  latest: Komik[];
  isLoading: boolean;
}

function KomikHomePage() {
  const [state, setState] = useState<KomikHomeState>({
    popular: [],
    latest: [],
    isLoading: true,
  });
  const router = useRouter();

  const loadHomePage = async (): Promise<void> => {
    try {
      const data = await fetchHomePageData();
      setState((prev) => ({
        ...prev,
        popular: data.popular,
        latest: data.latest,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error loading homepage:', error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    loadHomePage();
  }, []);

  if (state.isLoading) {
    return (
      <div className='grid w-full grid-cols-4 gap-2 lg:grid-cols-5'>
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonLoader key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className='flex min-h-screen flex-col items-center p-5'>
      {/* Popular Comics Section */}
      <section className='mb-8 w-full'>
        <h2 className='mb-4 text-2xl font-bold'>Popular Comics</h2>
        <div className='grid grid-cols-4 gap-2 lg:grid-cols-5'>
          {state.popular.map((komik) => (
            <KomikCard
              key={komik.title}
              komik={{
                judul: komik.title,
                thumbnail: komik.cover,
                link: komik.url,
              }}
              onClick={() =>
                router.push(
                  `/komikindo/${komik.url.replace(/https:\/\/[^]+\/komik\/([^]+)\//, '$1')}`,
                )
              }
            />
          ))}
        </div>
      </section>

      {/* Latest Updates Section */}
      <section className='w-full'>
        <h2 className='mb-4 text-2xl font-bold'>Latest Updates</h2>
        <div className='grid grid-cols-4 gap-2 lg:grid-cols-5'>
          {state.latest.map((komik) => (
            <KomikCard
              key={komik.title}
              komik={{
                judul: komik.title,
                thumbnail: komik.cover,
                link: komik.url,
              }}
              onClick={() =>
                router.push(`/komikindo/${komik.url.split('/').pop()}`)
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default KomikHomePage;
