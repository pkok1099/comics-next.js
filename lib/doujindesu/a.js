const cheerio = require('cheerio');

// Fungsi untuk mengambil Data ID, Referer, dan URL gambar
async function getImages(url) {
  try {
    // Ambil HTML halaman pertama
    const kuki =
      'PHPSESSID=dp87i03iq0j31ptif8ifio0p1h; __PPU_tuid=7442939330546749471; cf_clearance=yYK4CaqmAoCs4fQ7nyfPOsuuFWIuDp2fjYK6BzU38Qk-1732947658-1.2.1.1-4qwupk0ZlIgjvTwB2Q9aU.lIUGlErYle1khinyKp.DnNgUN41bMO1E0T1TnTRdJY8UXxN1HIlf_Nx.8DOpMvcPGV_fC4LH8_5y.VySbMnJ5B9VdBRghvtKK_9E4U4KpoIiRo6oBmaDfx4y.Qcxx1UzDwV360MFEvxzj4yr2EuhFHtUAz5e8O07.6c.eukZs_fUPUqIvBwyJHFX78CwH9D8PiwC9c7CKv4lXvRUMtXQegd8RYXkvkLMeqiCy1QBg46hbdGaw8QNUuJw1QtyiLoE.EQmit5yrR4b53iSPnF4beGSrX9fdmCEhO.EKNON1Ob.UrpO8I.904L75RFAZ63awkfXt4Pmvd7adpWAeJyR1pfYA6puu.CHiCHx5983Ij';
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'max-age=0',
        'sec-ch-ua':
          '"Chromium";v="125", "Not.A/Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Linux"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        cookie: kuki,
        Referer:
          'https://doujindesu.tv/manga/the-owner-of-a-building/',
        'Referrer-Policy':
          'strict-origin-when-cross-origin',
      },
    });

    // Mengecek jika halaman berhasil dimuat
    if (!response.ok) {
      throw new Error(
        `Failed to fetch page: ${response.statusText}`,
      );
    }

    // Ambil HTML dari halaman
    const body = await response.text();

    // Menggunakan cheerio untuk memparsing HTML
    const $ = cheerio.load(body);
    const dataId = $('#reader').attr('data-id'); // Mengambil nilai data-id

    // Membuat body untuk request POST
    const postBody = `id=${dataId}`;

    // Ambil gambar berdasarkan data-id
    const postResponse = await fetch(
      'https://doujindesu.tv/themes/ajax/ch.php',
      {
        method: 'POST',
        headers: {
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'content-type':
            'application/x-www-form-urlencoded; charset=UTF-8',
          priority: 'u=1, i',
          'sec-ch-ua':
            '"Chromium";v="125", "Not.A/Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Linux"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'x-requested-with': 'XMLHttpRequest',
          cookie: kuki,
          Referer: `https://doujindesu.tv/the-owner-of-a-building-chapter-143/`,
          'Referrer-Policy':
            'strict-origin-when-cross-origin',
        },
        body: postBody,
      },
    );

    // Mengecek jika request POST berhasil
    if (!postResponse.ok) {
      throw new Error(
        `Failed to fetch image URLs: ${postResponse.statusText}`,
      );
    }

    // Ambil HTML dari response POST
    const result = await postResponse.text();

    // Gunakan cheerio untuk memparsing HTML dan mengambil URL gambar
    const $$ = cheerio.load(result);
    const imageUrls = [];
    $$('img').each((i, el) => {
      const src = $$(el).attr('src');
      if (src && src.includes('uploads')) {
        imageUrls.push(src);
      }
    });

    // Menampilkan hasil gambar
    console.log(imageUrls);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Eksekusi fungsi untuk mengambil gambar
getImages(
  'https://doujindesu.tv/the-owner-of-a-building-chapter-143/',
);
