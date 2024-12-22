export const fetchKomik = async (
  page: number,
  tab?: string,
): Promise<{ komikList: Komik[]; pagination: PaginationData }> => {
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

// api.ts
export const searchComics = async (query: string, page: number) => {
  try {
    const response = await fetch(
      `/api/komikindo/search/${encodeURIComponent(query)}/${page}`,
    );
    if (!response.ok) {
      throw new Error('Search failed');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching comics:', error);
  }
};
