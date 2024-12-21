export const fetchKomik = async (page: number): Promise<{ komikList: Komik[]; pagination: PaginationData }> => {
  try {
    const response = await fetch(`/api/komikindo?page=${page}`);
    const data = await response.json();
    return {
      komikList: data.komikList || [],
      pagination: data.pagination || { currentPage: 1, totalPages: 1 },
    };
  } catch (error) {
    console.error('Error fetching komik data:', error);
    return { komikList: [], pagination: { currentPage: 1, totalPages: 1 } };
  }
};
