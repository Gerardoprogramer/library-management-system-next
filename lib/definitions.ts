import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

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