import { getCollection } from 'astro:content';

export type Book = Awaited<ReturnType<typeof getBooks>>[number];

/** Every book, in the order written in `src/content/books.yaml`. */
export const getBooks = () => getCollection('books');

/** Books grouped by the year they were finished, newest year first. */
export async function getBooksByYear() {
  const books = await getBooks();
  const years = Map.groupBy(books, (book) => book.data.year);
  return [...years]
    .sort(([a], [b]) => b - a)
    .map(([year, items]) => ({ year, books: items }));
}
