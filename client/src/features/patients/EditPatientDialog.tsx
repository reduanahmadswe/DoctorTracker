"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { DoctorSelect } from "@/features/doctors/DoctorSelect";
import { PATIENT_CONDITIONS } from "@/lib/constants";
import { applyServerError } from "@/lib/form-errors";
import { type EditPatientValues, editPatientSchema } from "./patients.schemas";
import type { Patient } from "./patients.types";
import { useUpdatePatient } from "./usePatientMutations";

interface EditPatientDialogProps {
  // The patient being edited; null keeps the dialog closed.
  patient: Patient | null;
  onClose: () => void;
}

const FIELDS = ["name", "phone", "condition", "doctor"] as const;
const CONDITION_OPTIONS = PATIENT_CONDITIONS.map((condition) => ({
  value: condition,
  label: condition,
}));

export const EditPatientDialog = ({ patient, onClose }: EditPatientDialogProps) => (
  <Modal
    open={patient !== null}
    onClose={onClose}
    title="Edit patient"
    description="Update the patient's details or move them to another doctor."
  >
    {patient && <EditPatientForm key={patient.id} patient={patient} onDone={onClose} />}
  </Modal>
);

// Mounted only while the dialog is open, so it always starts from the row's current values.
const EditPatientForm = ({ patient, onDone }: { patient: Patient; onDone: () => void }) => {
  const toast = useToast();
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EditPatientValues>({
    resolver: zodResolver(editPatientSchema),
    defaultValues: {
      name: patient.name,
      phone: patient.phone,
      condition: patient.condition,
      doctor: patient.doctor?.id ?? "",
    },
  });

  const mutation = useUpdatePatient(patient.id, onDone);

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) =>
        mutation.mutate(values, {
          onError: (error) =>
            applyServerError(error, { setError, fields: FIELDS, toastError: toast.error }),
        }),
      )}
      className="flex flex-col gap-4"
    >
      <Input id="edit-patient-name" label="Full name" error={errors.name?.message} {...register("name")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="edit-patient-phone"
          type="tel"
          label="Phone"
          autoComplete="off"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <Select
          id="edit-patient-condition"
          label="Condition"
          options={CONDITION_OPTIONS}
          error={errors.condition?.message}
          {...register("condition")}
        />
      </div>
      <Controller
        control={control}
        name="doctor"
        render={({ field }) => (
          <DoctorSelect
            id="edit-patient-doctor"
            label="Doctor"
            value={field.value}
            onChange={field.onChange}
            selectedLabel={patient.doctor?.name}
            error={errors.doctor?.message}
          />
        )}
      />
      <div className="mt-2 flex justify-end gap-2">
        <Button variant="secondary" onClick={onDone} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button type="submit" loading={mutation.isPending}>
          Save changes
        </Button>
      </div>
    </form>
  );
};
