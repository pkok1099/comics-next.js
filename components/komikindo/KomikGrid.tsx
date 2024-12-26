import React from 'react';
import { KomikCard } from 'components/komikindo/KomikCard';
import { useRouter } from 'next/navigation';

// Import or define the Komik type

interface KomikGridProps {
  komikList: Komik[];
  router: ReturnType<typeof useRouter>;
  setIsLoading: (isLoading: boolean) => void;
}

const KomikGrid: React.FC<KomikGridProps> = ({
  komikList,
  router,
  setIsLoading,
}) => {
  return (
    <div className='grid w-full grid-cols-4 gap-2 lg:grid-cols-5'>
      {komikList.map((komik) => (
        <KomikCard
          key={komik.judul}
          komik={komik}
          onClick={() =>
            (async (komikLink: string): Promise<void> => {
              setIsLoading(true);
              try {
                await router.push(
                  `/komikindo/${komikLink.replace(/https:\/\/[^]+\/komik\/([^]+)\//, '$1')}`,
                );
              } catch (error) {
                console.error('Error navigating to komik page:', error);
              } finally {
                setIsLoading(false);
              }
            })(komik.link)
          }
        />
      ))}
    </div>
  );
};

export default KomikGrid;
