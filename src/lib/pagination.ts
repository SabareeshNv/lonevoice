/**
 * Splits a list into pages with the site's own address scheme:
 *
 *   base            page 1   (/ or /posts/)
 *   base + page/2/  page 2   (/page/2/ or /posts/page/2/)
 *
 * Astro's built-in paginate() would put page 2 at base + 2/, which a post named "2"
 * could clash with. With a /page/ folder in between, a post can have any file name.
 */
export interface Pager<T> {
  /** The items on this page. */
  data: T[];
  currentPage: number;
  lastPage: number;
  url: {
    /** The newer page, if any. */
    prev?: string;
    /** The older page, if any. */
    next?: string;
  };
}

export function paginate<T>(items: T[], pageSize: number, base: '/' | '/posts/'): Pager<T>[] {
  const lastPage = Math.max(1, Math.ceil(items.length / pageSize));
  const urlOf = (n: number) => (n === 1 ? base : `${base}page/${n}/`);
  return Array.from({ length: lastPage }, (_, i) => {
    const currentPage = i + 1;
    return {
      data: items.slice(i * pageSize, (i + 1) * pageSize),
      currentPage,
      lastPage,
      url: {
        prev: currentPage > 1 ? urlOf(currentPage - 1) : undefined,
        next: currentPage < lastPage ? urlOf(currentPage + 1) : undefined,
      },
    };
  });
}
