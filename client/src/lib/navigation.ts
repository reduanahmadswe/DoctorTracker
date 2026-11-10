import { LayoutDashboard, Stethoscope, UserRound, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/doctors", label: "Doctors", icon: Stethoscope },
  { href: "/patients", label: "Patients", icon: UserRound },
];

const DOCTOR_DETAILS_PATTERN = /^\/doctors\/[^/]+$/;

export const getPageTitle = (pathname: string): string => {
  if (DOCTOR_DETAILS_PATTERN.test(pathname)) return "Doctor details";
  const match = NAV_ITEMS.find(({ href }) => pathname === href || pathname.startsWith(`${href}/`));
  return match?.label ?? "Doctor Tracker";
};

export const isNavItemActive = (pathname: string, href: string): boolean =>
  pathname === href || pathname.startsWith(`${href}/`);
