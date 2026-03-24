export const isBookInList = (list: any[] | undefined, bookId: string | undefined): boolean => {
    if (!list) return false;
    return list.some((item) => item.bookId === bookId);
};