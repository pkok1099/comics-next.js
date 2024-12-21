import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { url, head } = req.query; // Ambil URL dan parameter `head`

  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }

  let selectedHeaders: Record<string, string> = {};

  try {
    switch (head) {
      case 'komikindo': // Pilih header untuk another
        selectedHeaders = (await import('@/f/commonHeaders')).default || {};
        break;

      default: // Gunakan header default jika `head` tidak valid
        if (!head) {
          selectedHeaders = (await import('@/f/doujinHeaders')).default || {};
        } else {
          return res.status(400).json({
            message: `Invalid head parameter: ${head}`,
          });
        }
        break;
    }
  } catch (error) {
    console.error(
      `Failed to load headers for head=${head}:`,
      (error as any).message,
    );
    return res.status(500).json({
      message: `Failed to load headers for head=${head}`,
    });
  }

  try {
    const response = await fetch(decodeURIComponent(url as string), {
      method: 'GET',
      headers: {
        ...selectedHeaders, // Gabungkan header yang dipilih
        Accept: 'image/*', // Tambahkan header untuk menerima gambar
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image, status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type'); // Dapatkan tipe konten
    const imageBuffer = await response.arrayBuffer(); // Baca buffer gambar

    if (contentType) {
      res.setHeader('Content-Type', contentType); // Set tipe konten pada respon
    } else {
      res.setHeader('Content-Type', 'application/octet-stream'); // Fallback content type
    }
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache selama 1 hari
    res.send(Buffer.from(imageBuffer)); // Kirim gambar ke klien
  } catch (error) {
    console.error('Error in proxy:', (error as any).message);
    res.status(500).json({ message: 'Failed to proxy image' });
  }
}
