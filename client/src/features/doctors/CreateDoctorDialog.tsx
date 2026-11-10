"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { applyServerError } from "@/lib/form-errors";
import { createDoctor, doctorKeys } from "./doctors.api";
import { type CreateDoctorValues, createDoctorSchema } from "./doctors.schemas";

interface CreateDoctorDialogProps {
  open: boolean;
  onClose: () => void;
}

const FIELDS = ["name", "specialization", "hospital", "phone", "email"] as const;

export const CreateDoctorDialog = ({ open, onClose }: CreateDoctorDialogProps) => (
  <Modal
    open={open}
    onClose={onClose}
    title="Add doctor"
    description="Create a new doctor profile. You can add patients afterwards."
  >
    <CreateDoctorForm onDone={onClose} />
  </Modal>
);

// Mounted only while the dialog is open, so every opening starts with an empty form.
const CreateDoctorForm = ({ onDone }: { onDone: () => void }) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateDoctorValues>({
    resolver: zodResolver(createDoctorSchema),
    defaultValues: { name: "", specialization: "", hospital: "", phone: "", email: "" },
  });

  const mutation = useMutation({
    mutationFn: createDoctor,
    onSuccess: async (doctor) => {
      toast.success(`${doctor.name} was added.`);
      onDone();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: doctorKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
      ]);
    },
    onError: (error) =>
      applyServerError(error, {
        setError,
        fields: FIELDS,
        toastError: toast.error,
        conflict: { field: "email", message: "A doctor with this email already exists." },
      }),
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      className="flex flex-col gap-4"
    >
      <Input id="doctor-name" label="Full name" placeholder="Dr. Jane Doe" error={errors.name?.message} {...register("name")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="doctor-specialization"
          label="Specialization"
          placeholder="Cardiology"
          error={errors.specialization?.message}
          {...register("specialization")}
        />
        <Input
          id="doctor-hospital"
          label="Hospital"
          placeholder="City General Hospital"
          error={errors.hospital?.message}
          {...register("hospital")}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="doctor-phone"
          type="tel"
          label="Phone"
          placeholder="+8801700000000"
          autoComplete="off"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <Input
          id="doctor-email"
          type="email"
          label="Email"
          placeholder="doctor@hospital.com"
          autoComplete="off"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>
      <div className="mt-2 flex justify-end gap-2">
        <Button variant="secondary" onClick={onDone} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button type="submit" loading={mutation.isPending}>
          Add doctor
        </Button>
      </div>
    </form>
  );
};
