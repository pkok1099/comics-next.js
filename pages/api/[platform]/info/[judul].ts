import { NextApiRequest, NextApiResponse } from 'next';
import { komikindo } from '@/f/index';

interface PlatformScrapers {
  [key: string]: {
    scrapeComicInfo: (judul: string) => Promise<any>;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { platform, judul } = req.query as { platform: string; judul: string };

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const availablePlatforms: PlatformScrapers = { komikindo };
  if (!availablePlatforms[platform]) {
    return res.status(400).json({ message: 'Invalid platform' });
  }

  try {
    const comicInfo = await availablePlatforms[platform].scrapeComicInfo(judul);

    if (!comicInfo) {
      return res.status(404).json({
        message: 'Comic info not found',
      });
    }

    return res.status(200).json(comicInfo);
  } catch (error) {
    console.error('Error scraping comic info:', error);
    return res.status(500).json({
      message: 'Error retrieving comic info',
    });
  }
}
