export const fetchKomik = async (
  page: number,
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

export const fetchKomikData = async (id: string) => {
  try {
    const response = await fetch(
      `/api/komikindo/info/${decodeURIComponent(id)}`,
    );
    const komik = await response.json();
    return komik;
  } catch (error) {
    console.error('Error fetching komik data:', error);
  }
};

export const fetchChapterImages = async (id: string, chapterId: string) => {
  try {
    const response = await fetch(
      `/api/komikindo/${decodeURIComponent(id)}/${chapterId}/`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch images');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching chapter images:', error);
  }
};

export const saveHistory = async (chapterId: string, title: string) => {
  try {
    await fetch('/api/history/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chapterId, title }),
    });
  } catch (error) {
    console.error('Error saving history:', error);
  }
};

export const fetchChapterList = async (id: string) => {
  try {
    const response = await fetch(
      `/api/komikindo/info/${decodeURIComponent(id)}`,
    );
    if (!response.ok) throw new Error('Failed to fetch chapters');

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching chapter list:', error);
  }
};
