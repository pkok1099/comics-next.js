// app/api/komik/route.js
import { fetchKomikData } from "@/app/function/index.js";

export async function GET(request) {
  try {
    // Ambil parameter `page` dari query string
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page"), 10) || 1;

    // Cek apakah page valid
    if (isNaN(page) || page <= 0) {
      return new Response(JSON.stringify({ message: "Halaman tidak valid" }), {
        status: 400,
      });
    }

    // Ambil data komik berdasarkan halaman
    const { komikList, pagination } = await fetchKomikData(page);

    // Kirimkan data komik dan pagination
    return new Response(JSON.stringify({ komikList, pagination }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        message: "Error scraping data komik: " + error.message,
      }),
      { status: 500 },
    );
  }
}

// Jika Anda ingin menambahkan metode lain, Anda bisa mengekspor fungsi POST atau lainnya seperti ini:
// export async function POST(request) { ... }
