"use client";

import { type QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/Toast";
import { doctorKeys } from "@/features/doctors/doctors.api";
import type { Paginated } from "@/types/api";
import { deletePatient, patientKeys, updatePatient } from "./patients.api";
import type { EditPatientValues } from "./patients.schemas";
import type { Patient } from "./patients.types";

type PatientsPage = Paginated<Patient>;

// Patients feed the patient list, the doctors' counts and patient lists, and the dashboard stats.
const invalidatePatientData = (queryClient: QueryClient): Promise<unknown> =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: patientKeys.all }),
    queryClient.invalidateQueries({ queryKey: doctorKeys.all }),
    queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
  ]);

export const useUpdatePatient = (patientId: string, onUpdated: () => void) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (values: EditPatientValues) => updatePatient(patientId, values),
    onSuccess: async (patient) => {
      toast.success(`${patient.name} was updated.`);
      onUpdated();
      await invalidatePatientData(queryClient);
    },
  });
};

// Removes the row immediately and puts it back if the server rejects the deletion.
export const useDeletePatient = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: deletePatient,
    onMutate: async (patientId: string) => {
      await queryClient.cancelQueries({ queryKey: patientKeys.lists });
      const snapshots = queryClient.getQueriesData<PatientsPage>({ queryKey: patientKeys.lists });
      queryClient.setQueriesData<PatientsPage>({ queryKey: patientKeys.lists }, (page) =>
        page && {
          items: page.items.filter((patient) => patient.id !== patientId),
          meta: { ...page.meta, total: Math.max(page.meta.total - 1, 0) },
        },
      );
      return { snapshots };
    },
    onError: (_error, _patientId, context) => {
      for (const [key, data] of context?.snapshots ?? []) queryClient.setQueryData(key, data);
      toast.error("Could not delete the patient. Please try again.");
    },
    onSuccess: () => toast.success("Patient deleted."),
    onSettled: () => invalidatePatientData(queryClient),
  });
};
