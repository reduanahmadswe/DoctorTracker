interface TooltipRow {
  color: string;
  label: string;
  value: number;
}

interface ChartTooltipProps {
  title: string;
  subtitle?: string;
  rows: TooltipRow[];
}

export const ChartTooltip = ({ title, subtitle, rows }: ChartTooltipProps) => (
  <div className="rounded-control border border-border bg-surface px-3 py-2 text-sm shadow-overlay">
    <p className="font-medium text-text">{title}</p>
    {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
    <ul className="mt-1.5 flex flex-col gap-1">
      {rows.map((row) => (
        <li key={row.label} className="flex items-center gap-2">
          <span aria-hidden className="size-2.5 rounded-full" style={{ backgroundColor: row.color }} />
          <span className="text-text-muted">{row.label}</span>
          <span className="ml-auto pl-4 font-medium text-text tabular-nums">{row.value}</span>
        </li>
      ))}
    </ul>
  </div>
);
