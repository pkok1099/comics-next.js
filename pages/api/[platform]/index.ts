import { NextApiRequest, NextApiResponse } from 'next';
import { doujindesu, komikindo } from '@/f/index'; // Sesuaikan dengan penamaan platform kecil

type AvailablePlatforms = 'doujindesu' | 'komikindo';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { platform, page } = req.query as {
    platform: AvailablePlatforms;
    page: string | string[];
  }; // Mengambil params dari URL

  try {
    const availablePlatforms = { doujindesu, komikindo };

    // Validasi platform
    if (!platform || !availablePlatforms[platform]) {
      return res.status(400).json({ message: 'Invalid or missing platform' });
    }

    // Panggil fungsi `fetchKomikData` sesuai platform
    const pageNumber = Array.isArray(page)
      ? parseInt(page[0])
      : parseInt(page as string);

    if (isNaN(pageNumber)) {
      return res.status(400).json({ message: 'Invalid page number' });
    }

    const { komikList, pagination } =
      await komikindo.fetchKomikData(pageNumber);

    // Kirimkan hasil data komik
    return res.status(200).json({ komikList, pagination });
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({
      message: `Error fetching data for platform: ${(error as Error).message}`,
    });
  }
}
