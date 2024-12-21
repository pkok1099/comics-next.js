declare module 'lib/komikindo' {
  export function fetchKomikData(
    page?: number,
  ): Promise<{ komikList: object[]; pagination: number[] }>;
}
