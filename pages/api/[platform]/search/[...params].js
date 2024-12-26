import { komikindo } from "@/f/index"; // Sesuaikan dengan path yang sesuai

export default async function handler(req, res) {
  const { platform, params } = req.query; // Mengambil platform dan params dari URL

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Pastikan ada parameter pencarian
  if (params.length !== 2) {
    return res
      .status(400)
      .json({ message: "Invalid parameters. Expected [search, pages]" });
  }

  const [search, pages] = params; // Mendapatkan search dan pages dari params

  // Validasi platform
  const availablePlatforms = { komikindo };
  if (!availablePlatforms[platform]) {
    return res.status(400).json({ message: "Invalid platform" });
  }

  try {
    // Panggil fungsi search berdasarkan platform yang dipilih
    const chapters = await availablePlatforms[platform].SearchComicsPage(
      search,
      pages,
    );
    res.status(200).json(chapters); // Kirimkan hasil pencarian
  } catch (error) {
    console.error("Error scraping komik chapters:", error);
    res.status(500).json({
      message: "Error retrieving chapter list",
    });
  }
}
