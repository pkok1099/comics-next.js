import { getChapters } from "@/app/function/index.js"; // Gunakan alias '@' untuk impor lebih rapi

// Handler untuk HTTP GET
export async function GET(request, { params }) {
  const { judul } = params; // Ambil parameter dinamis dari URL

  try {
    // Decode judul yang diterima sebagai parameter
    const decodedJudul = decodeURIComponent(judul).trim();

    // Validasi input judul
    if (!decodedJudul) {
      return new Response(
        JSON.stringify({ message: "Judul komik tidak valid atau kosong." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    console.log(`Mendapatkan chapter untuk judul: ${decodedJudul}`);

    // Ambil data chapters dari fungsi getChapters
    const chapters = await getChapters(decodedJudul);

    // Jika tidak ditemukan chapter
    if (!chapters || chapters.length === 0) {
      return new Response(
        JSON.stringify({
          message: `Tidak ditemukan chapter untuk komik "${decodedJudul}".`,
        }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    // Kirim data chapter yang ditemukan
    return new Response(JSON.stringify(chapters), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error scraping komik chapters:", error.message || error);

    // Tangani error seperti URL encoding yang tidak valid atau error lainnya
    if (error instanceof URIError) {
      return new Response(
        JSON.stringify({ message: "URL encoding tidak valid." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ message: "Gagal mendapatkan daftar chapter." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
