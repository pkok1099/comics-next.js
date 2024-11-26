// pages/api/komik/[komik]/[chapter]/images.js
import { getChapterImages } from "@/app/function/index"; // sesuaikan dengan lokasi function

export default async function handler(req, res) {
  const {
    query: { judul, chapter },
    method,
  } = req;

  if (method === "GET") {
    try {
      // Menghapus angka 6 digit di depan judul jika ada
      const cleanedTitle = judul.replace(/^\d{6}-/, "");

      const imageUrls = await getChapterImages(cleanedTitle, chapter); // Gunakan judul yang sudah dibersihkan
      const protocol = req.headers["x-forwarded-proto"] || "http"; // HTTP atau HTTPS
      const host = req.headers["host"]; // Host, termasuk domain atau localhost dengan port
      const baseUrl = `${protocol}://${host}`; // URL lengkap

      const imageLinks = imageUrls.map((imgUrl, index) => {
        return `${baseUrl}/api/komik/images/${cleanedTitle}/${chapter}/${index + 1}`;
      });

      console.log(imageLinks);

      res.status(200).json(imageLinks);
    } catch (error) {
      console.error("Error fetching chapter images:", error);
      res.status(500).send("Failed to fetch chapter images.");
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
}