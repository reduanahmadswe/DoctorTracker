import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = { title: "Doctor details" };

export default function DoctorDetailsPage() {
  return <PageHeader title="Doctor details" description="Profile and patients of this doctor." />;
}
