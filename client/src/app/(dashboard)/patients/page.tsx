import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = { title: "Patients" };

export default function PatientsPage() {
  return <PageHeader title="Patients" description="All patients across every doctor." />;
}
