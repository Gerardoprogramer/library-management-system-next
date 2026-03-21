import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { number, string } from "zod";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;

  totalElements: number;
  totalPages: number;

  last: boolean;
  first: boolean;
  empty: boolean;
}

export type loginData = {
  email: string;
  password: string;
};

export type registerData = {
  fullName: string;
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  isAdmin: boolean;
  lastLogin: string;
};

export type Genre = {
  id: string;
  code: string;
  name: string;
  description: string;
  displayOrder: number;
  active: boolean;
  parentGenreId: string | null;
};

export type navLinkstype = {
  label: string;
  path: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
};

export type BookSummary = {
  id: string;
  title: string;
  author: string;
  genreName: string;
  pages: number;
  availableCopies: number;
  coverImageUrl: string;
  isWishList: boolean;
  averageRating: number;
  totalReviews: number;
};

export interface BookDetail {
  id: string;
  isbn: string;
  title: string;
  author: string;

  genreId: string;
  genreName: string;

  publisher: string;
  publishedDate: string;
  language: string;
  pages: number;
  description: string;

  totalCopies: number;
  availableCopies: number;
  isWishList: boolean;

  price: number;
  coverImageUrl: string;
  active: boolean;
  averageRating: number;
  totalReviews: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  reviewText: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface meLoans {
  id: string;
  bookId: string;
  bookTitle: string;
  author: string;
  bookCoverImageUrl: string;
  userId: string;
  userName: string;
  type: typeLoans;
  status: statusLoan;
  checkoutDate: string;
  dueDate: string;
  remainingDays: number;
  returnDate: string;
  renewalCount: number;
  maxRenewals: number;
  notes: string;
  overdue: boolean;
  overdueDays: number;
  fineAmount: number;
}

export type statusLoan = "CHECKED_OUT" | "OVERDUE" | "RETURNED" | "LOST" | "DAMAGED";
export type typeLoans = "CHECKOUT" | "RENEWAL" | "RETURN";

export interface selectOptions {
  id: string;
  name: string
}

export interface reservationBook {
  id: string,
  bookId: string,
  bookTitle: string,
  author: string,
  bookCoverImageUrl: string,
  userId: string,
  status: reservationStatus,
  queuePosition: number,
  notificationSent: boolean,
  notes: string,
  reservedAt: string,
  availableAt: string,
  availableUntil: string,
  cancelledAt: string,
  fulfilledAt: string,
  createdAt: string,
  updatedAt: string
}

export type reservationStatus = "PENDING" | "AVAILABLE" | "FULFILLED" | "CANCELLED" | "EXPIRED";


export interface myWishlist {
  id: string,
  bookId: string,
  bookTitle: string,
  bookAuthor: string,
  bookCoverImageUrl: string,
  availableCopies: number,
  notes: string,
  addedAt: string
}