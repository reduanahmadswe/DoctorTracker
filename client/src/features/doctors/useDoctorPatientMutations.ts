"use client";

import { type QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/Toast";
import type { Paginated } from "@/types/api";
import { addDoctorPatient, doctorKeys, removeDoctorPatient } from "./doctors.api";
import type { CreatePatientValues } from "./doctors.schemas";
import type { DoctorPatient } from "./doctors.types";

type PatientsPage = Paginated<DoctorPatient>;

// A patient change also affects the patient counts, the Patients page and the dashboard.
const invalidatePatientData = (queryClient: QueryClient, doctorId: string): Promise<unknown> =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: doctorKeys.patientsOf(doctorId) }),
    queryClient.invalidateQueries({ queryKey: doctorKeys.lists }),
    queryClient.invalidateQueries({ queryKey: ["patients"] }),
    queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
  ]);

export const useAddPatient = (doctorId: string, onAdded: () => void) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (values: CreatePatientValues) => addDoctorPatient(doctorId, values),
    onSuccess: async (patient) => {
      toast.success(`${patient.name} was added.`);
      onAdded();
      await invalidatePatientData(queryClient, doctorId);
    },
  });
};

// Removes the row immediately and puts it back if the server rejects the deletion.
export const useRemovePatient = (doctorId: string) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const patientsKey = doctorKeys.patientsOf(doctorId);

  return useMutation({
    mutationFn: (patientId: string) => removeDoctorPatient(doctorId, patientId),
    onMutate: async (patientId) => {
      await queryClient.cancelQueries({ queryKey: patientsKey });
      const snapshots = queryClient.getQueriesData<PatientsPage>({ queryKey: patientsKey });
      queryClient.setQueriesData<PatientsPage>({ queryKey: patientsKey }, (page) =>
        page && {
          items: page.items.filter((patient) => patient.id !== patientId),
          meta: { ...page.meta, total: Math.max(page.meta.total - 1, 0) },
        },
      );
      return { snapshots };
    },
    onError: (_error, _patientId, context) => {
      for (const [key, data] of context?.snapshots ?? []) queryClient.setQueryData(key, data);
      toast.error("Could not remove the patient. Please try again.");
    },
    onSuccess: () => toast.success("Patient removed."),
    onSettled: () => invalidatePatientData(queryClient, doctorId),
  });
};
