'use client';

import { bookService } from "@/services/bookService";
import { useQuery } from "@tanstack/react-query";

export const BookDetail = ({ id }: { id: string }) => {

const {data: book} = useQuery({
    queryKey: ["book", id],
    queryFn: () => bookService.book(id),
    enabled: !!id,
  });

  return (
    <div>{book?.author}</div>
  )
}
