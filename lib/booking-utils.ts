type BookListItem = {
  bookId: string;
};

export const isBookInList = (list: BookListItem[] | undefined, bookId: string | undefined): boolean => {
  if (!list || !bookId) return false;

  return list.some((item) => item.bookId === bookId);
};
