'use client';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface KomikData {
  alternativeTitles?: string[];
  synopsis?: string;
  spoilerImages?: string[];
}

interface TabsComponentProps {
  komikData: KomikData;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const TabsComponent: React.FC<TabsComponentProps> = ({
  komikData,
  activeTab,
  setActiveTab,
}) => {
  return (
    <Tabs
      defaultValue={activeTab}
      className='mb-4 text-center'
      onValueChange={(value) => setActiveTab(value)}
    >
      <TabsList className='h-18 rounded-full border-blue-500 bg-gray-700'>
        <TabsTrigger
          className='h-18 ml-2 mr-2 rounded-full px-6 py-2'
          value='judul'
        >
          alternative
        </TabsTrigger>
        <TabsTrigger
          className='h-18 ml-2 mr-2 rounded-full px-6 py-2'
          value='sinopsis'
        >
          Sinopsis
        </TabsTrigger>
        <TabsTrigger
          className='h-18 ml-2 mr-2 rounded-full px-6 py-2'
          value='spoiler'
        >
          Spoiler
        </TabsTrigger>
      </TabsList>
      <TabsContent value='judul'>
        <div className='text-xl font-bold'>
          {(komikData.alternativeTitles ?? []).length > 0
            ? (komikData.alternativeTitles ?? []).map((title, index) => (
                <span key={index}>{title}</span>
              ))
            : 'Alternative Titles tidak ditemukan.'}
        </div>
      </TabsContent>
      <TabsContent value='sinopsis'>
        <div className='max-w-4xl text-justify'>
          {komikData?.synopsis || 'kosong'}
        </div>
      </TabsContent>
      <TabsContent value='spoiler'>
        {komikData?.spoilerImages && (
          <div className='flex flex-wrap justify-center'>
            {komikData.spoilerImages.map((img, index) => (
              <Image
                key={index}
                src={img}
                width={300}
                height={400}
                alt={`spoiler ${index}`}
                className='m-2 h-64 w-64 rounded-lg'
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
