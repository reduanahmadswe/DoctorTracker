"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { PATIENT_CONDITIONS } from "@/lib/constants";
import { applyServerError } from "@/lib/form-errors";
import { type CreatePatientValues, createPatientSchema } from "./doctors.schemas";
import { useAddPatient } from "./useDoctorPatientMutations";

interface AddPatientDialogProps {
  doctorId: string;
  doctorName: string;
  open: boolean;
  onClose: () => void;
}

const FIELDS = ["name", "phone", "condition"] as const;
const CONDITION_OPTIONS = PATIENT_CONDITIONS.map((condition) => ({
  value: condition,
  label: condition,
}));

export const AddPatientDialog = ({ doctorId, doctorName, open, onClose }: AddPatientDialogProps) => (
  <Modal
    open={open}
    onClose={onClose}
    title="Add patient"
    description={`The patient will be added under ${doctorName}.`}
  >
    <AddPatientForm doctorId={doctorId} onDone={onClose} />
  </Modal>
);

// Mounted only while the dialog is open, so every opening starts with an empty form.
const AddPatientForm = ({ doctorId, onDone }: { doctorId: string; onDone: () => void }) => {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreatePatientValues>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: { name: "", phone: "", condition: undefined },
  });

  const mutation = useAddPatient(doctorId, onDone);

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
      <Input
        id="patient-name"
        label="Full name"
        placeholder="Patient name"
        error={errors.name?.message}
        {...register("name")}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="patient-phone"
          type="tel"
          label="Phone"
          placeholder="+8801700000000"
          autoComplete="off"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <Select
          id="patient-condition"
          label="Condition"
          placeholder="Select condition"
          options={CONDITION_OPTIONS}
          error={errors.condition?.message}
          {...register("condition")}
        />
      </div>
      <div className="mt-2 flex justify-end gap-2">
        <Button variant="secondary" onClick={onDone} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button type="submit" loading={mutation.isPending}>
          Add patient
        </Button>
      </div>
    </form>
  );
};
