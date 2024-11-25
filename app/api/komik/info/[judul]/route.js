import { scrapeComicInfo } from "@/app/function/index"; // Gunakan alias jika sudah diatur

export async function GET(request, { params }) {
  const { judul } = params; // Ambil parameter 'judul' dari URL

  try {
    // Memanggil fungsi scrapeComicInfo untuk mendapatkan informasi komik
    const chapters = await scrapeComicInfo(judul);

    // Jika chapters tidak ditemukan
    if (!chapters || chapters.length === 0) {
      return new Response(
        JSON.stringify({ message: "Chapter list not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    // Mengirimkan data chapter
    return new Response(JSON.stringify(chapters), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Menangani error jika terjadi masalah dalam scraping
    console.error("Error scraping komik chapters:", error);

    return new Response(
      JSON.stringify({ message: "Error retrieving chapter list" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
