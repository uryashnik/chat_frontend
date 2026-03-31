interface DatePickerProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  min?: string;
  className?: string;
}

const defaultInputClass =
  'h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition';
  
export default function DatePicker({
  id,
  label,
  value,
  onChange,
  disabled = false,
  min,
}: DatePickerProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide"
      >
        {label}
      </label>
      <input
        id={id}
        type="datetime-local"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={defaultInputClass}
      />
    </div>
  );
}
