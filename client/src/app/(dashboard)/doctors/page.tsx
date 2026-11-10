import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = { title: "Doctors" };

export default function DoctorsPage() {
  return <PageHeader title="Doctors" description="Browse doctors and manage their patients." />;
}
