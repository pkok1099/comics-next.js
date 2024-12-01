const cheerio = require('cheerio'); // Pastikan cheerio terinstall
const headers2 = require('@/f/doujinHeaders');

async function fetchAndParseManhwa(page = '') {
  try {
    const response = await fetch(
      `https://doujindesu.tv/manhwa/page/${page}`,
      {
        method: 'GET',
        headers: {
          cookie:
            'PHPSESSID=dp87i03iq0j31ptif8ifio0p1h; __cf_bm=dUAp9yAtmSZ64Hq31iMebqwkM0Sq7Tm.RJqyK6unsps-1733030194-1.0.1.1-yTWgL8Yk0y9iv3fI9rJ4cU41eDRJj6EHhKJ7y.nkAc.WAGmZn18OKAvUm_TlEYlAjUl4Mw6zDe7f0soM.llsxg; cf_clearance=Pe_sa34VUEaRgC3EFSbK7ot.XZRKJKaQWFjHzwTCSbE-1733030196-1.2.1.1-104tJUIha9UMi5vVJBIJWSr3UD4mASaDq7tBfGpohq9RRkK6mZNAKjmWw0speRxi_eWD9snP0Vj6_cieZlYXsDG5u80Ys_YWxW57ortS1U9OctpDUYPFWvuA6dWn_VI92difZ26qMk7pzE19F7vZb6btJWpgCpFbHDYh4uDDoygWL66bkmW2PtcMjckmmhqBYJqremtSylaNjMdgpDf0ntMqkVrnA12BR_NUfFRQgN1LPJaZizcRTDyvsYvi0OPQ4plIBpF2DUJUfFDkK1nJqU.yfBYtAQRgX0IgAnMMmsSX_QzR8dDcufOVpoEk6H9GX.LxPgeO5SLUxOtGGWJrax4eSZpZEkGtSATlgjycpKk_3S0D5vMgw8zJ3nc5aZoh; __PPU_tuid=7443308014819663065; UGVyc2lzdFN0b3JhZ2U=%7B%22CAIFRQ%22%3A%22ACZLEAAAAAAAAAAC%22%2C%22CAIFRT%22%3A%22ACZLEAAAAABnTJYQ%22%7D; __PPU_ppucnt=10',
          Referer: 'https://doujindesu.tv/',
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        'Network response was not ok.',
      );
    }

    const html = await response.text(); // Mengambil respons sebagai teks (HTML)
    const $ = cheerio.load(html);

    const komikList = [];
    const pagination = [];

    // Parsing data manhwa
    $('.feed .entry').each((index, element) => {
      const judul = $(element)
        .find('.title span')
        .text()
        .trim();
      const thumbnail = $(element)
        .find('.thumbnail img')
        .attr('src');
      const link = $(element)
        .find("a[href^='/manga/']")
        .first()
        .attr('href');
      const genre = $(element).data('tags') || '';
      const latestChapterLink =
        $(element)
          .find('.artists a')
          .attr('href') || '';

      // Konversi thumbnail ke URL internal (proxy)
      const thumbnailInternal = `/api/proxy?url=${encodeURIComponent(thumbnail)}`;

      komikList.push({
        judul,
        thumbnail: thumbnailInternal, // Gunakan URL internal untuk thumbnail
        link,
        genre,
        latestChapterLink,
      });
    });

    // Parsing pagination
    $('.pagination a').each((index, element) => {
      const href = $(element).attr('href');
      const match = href.match(/\/page\/(\d+)\//);
      if (match) {
        pagination.push(Number(match[1]));
      }
    });

    return { komikList, pagination };
  } catch (error) {
    console.error(
      'There was a problem with the fetch operation:',
      error,
    );
  }
}

module.exports = fetchAndParseManhwa;
