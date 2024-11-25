const cheerio = require("cheerio");
const { BaseUrlK } = require("./index");

// Fungsi untuk menunggu selama ms milidetik
async function fetchComicsFromPage(query = "", page = 1) {
  const url = `${BaseUrlK}/page/${page}/?s=${query}`; // URL pencarian dengan query dan nomor halaman
  try {
    const response = await fetch(url, { timeout: 5000 }); // Timeout 5 detik
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);

    const body = await response.text();
    const $ = cheerio.load(body);

    const comics = [];

    // Mengambil jumlah halaman berdasarkan elemen pagination
    const pagination = $(".pagination");
    let totalPages = 1; // Default jika tidak ditemukan elemen pagination

    // Mengambil halaman terakhir dari elemen terakhir .page-numbers
    const lastPageLink = pagination
      .find(".page-numbers.dots")
      .next("a")
      .attr("href");
    if (lastPageLink) {
      const match = lastPageLink.match(/page\/(\d+)/);
      if (match) {
        totalPages = parseInt(match[1], 10);
      }
    }

    // Mengambil komik dari setiap elemen .animepost
    $(".animepost").each((index, element) => {
      const title = $(element).find("h4").text().trim();
      const link = $(element).find('a[itemprop="url"]').attr("href");
      const image = $(element).find('img[itemprop="image"]').attr("src");
      const rating = $(element).find(".rating i").text().trim();

      comics.push({
        title,
        link,
        image,
        rating,
      });
    });

    return { comics, totalPages }; // Mengembalikan komik dan jumlah halaman
  } catch (error) {
    console.error(error);
    return { comics: [], totalPages: 1 }; // Jika terjadi error, kembalikan array kosong dan total halaman 1
  }
}

module.exports = fetchComicsFromPage;
