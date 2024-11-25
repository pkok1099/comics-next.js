// app/api/komik/images/[...judul]/route.js
import { getImageByIndex } from "@/app/function/index"; // Gunakan alias jika sudah diatur

export async function GET(request, context) {
  try {
    // Pastikan params diakses secara async
    const { params } = context;
    const [judul, chapter, index] = await params.judul; // Ambil parameter judul, chapter, dan index

    // Ambil URL gambar berdasarkan judul, chapter, dan index
    const imgUrl = await getImageByIndex(judul, chapter, index);

    // Ambil gambar dari URL
    const imgResponse = await fetch(imgUrl, { method: "GET" });

    // Cek apakah respons gambar valid
    if (!imgResponse.ok) {
      return new Response("Image not found", { status: 404 });
    }

    // Ambil buffer gambar dari response
    const imgBuffer = await imgResponse.arrayBuffer();

    // Set header content-type sesuai dengan jenis gambar
    const contentType = imgResponse.headers.get("content-type");
    const headers = new Headers();
    headers.set("Content-Type", contentType);

    // Kirim gambar ke client
    return new Response(Buffer.from(imgBuffer), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return new Response("Failed to fetch image.", { status: 500 });
  }
}
