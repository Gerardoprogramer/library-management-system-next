import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

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