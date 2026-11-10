import { Stethoscope } from "lucide-react";

export const Brand = () => (
  <div className="flex items-center gap-2.5">
    <div className="flex size-9 items-center justify-center rounded-control bg-primary text-white">
      <Stethoscope aria-hidden className="size-5" />
    </div>
    <span className="text-base font-semibold text-text">Doctor Tracker</span>
  </div>
);
