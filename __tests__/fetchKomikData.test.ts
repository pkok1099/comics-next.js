import fetchKomikData from '../lib/komikindo/fetchKomikData';

describe('fetchKomikData', () => {
  it('should return komik data and pagination', async () => {
    // Panggil fungsi dan tunggu hasilnya
    const { komikList, pagination } = await fetchKomikData(1);

    // Verifikasi hasilnya
    expect(komikList).toBeInstanceOf(Array);
    expect(komikList.length).toBeGreaterThan(0); // Pastikan ada data komik
    expect(pagination).toBeInstanceOf(Array);
    expect(pagination.length).toBeGreaterThan(0); // Pastikan ada data pagination
  });

  it('should throw error if page is invalid', async () => {
    // Cek jika halaman yang tidak valid memberikan error
    await expect(fetchKomikData(NaN)).rejects.toThrow('page harus number');
  });
});
