import { getChapterImages } from "@/app/function/index"; // Gunakan alias jika sudah diatur

export async function GET(request, { params }) {
  const { judul, chapter } = params; // Ambil parameter dinamis dari URL

  try {
    // Ambil daftar URL gambar dari fungsi `getChapterImages`
    const imageUrls = await getChapterImages(judul, chapter);

    // Ambil protokol (HTTP/HTTPS) dan host dari request header
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const host = request.headers.get("host");
    const baseUrl = `${protocol}://${host}`; // Gabungkan menjadi URL dasar

    // Bangun URL penuh untuk setiap gambar
    const imageLinks = imageUrls.map((imgUrl, index) => {
      return `${baseUrl}/api/komik/images/${judul}/${chapter}/${index + 1}`;
    });

    return new Response(JSON.stringify(imageLinks), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching chapter images:", error);

    return new Response("Failed to fetch chapter images.", {
      status: 500,
    });
  }
}
