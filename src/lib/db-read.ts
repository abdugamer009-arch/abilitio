type ReadResult<T> = { data: T[] | null; error: { message: string } | null };

/** Each caller supplies a stable order before range; never silently accept a failed page. */
export async function readAll<T>(
  page: (from: number, to: number) => PromiseLike<ReadResult<T>>,
): Promise<T[]> {
  const rows: T[] = [];
  const pageSize = 500;
  for (let from = 0; ; from += pageSize) {
    const result = await page(from, from + pageSize - 1);
    if (result.error) throw new Error(result.error.message);
    if (!result.data) throw new Error("Database returned no page");
    rows.push(...result.data);
    if (result.data.length < pageSize) return rows;
  }
}

export function requireData<T>(result: { data: T; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message);
  return result.data;
}

export async function readAllResult<T>(
  page: (from: number, to: number) => PromiseLike<ReadResult<T>>,
) {
  return { data: await readAll(page), error: null };
}
