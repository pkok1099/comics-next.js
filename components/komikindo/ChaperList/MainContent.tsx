'use client';
import { ChapterListComponent } from '@/components/komikindo/ChaperList/ChapterListComponent';
import { InfoBox } from '@/components/komikindo/ChaperList/InfoBox';
import { TabsComponent } from '@/components/komikindo/ChaperList/TabsComponent';
import { KomikData } from '@/types/komik';
import { ThumbnailImage } from './ThumbnailImage';
import { TitleSection } from './TitleSection';

export const MainContent: React.FC<{
  komikData: KomikData;
  id: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}> = ({ komikData, id, activeTab, setActiveTab }) => (
  <>
    <ThumbnailImage thumbnail={komikData.thumbnail} />
    <TitleSection title={komikData.title} />
    <InfoBox komikData={komikData} />
    <TabsComponent
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      komikData={komikData}
    />
    <ChapterListComponent chapters={komikData.chapterList || []} id={id} />
  </>
);
