interface SelectOption {
  id: string | number;
  label: string;
}

interface SelectProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const defaultSelectClass =
  'h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition appearance-none pr-8 cursor-pointer';

export default function Select({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  className = defaultSelectClass,
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={className}
      >
        {placeholder !== undefined && (
          <option value="">{placeholder}</option>
        )}
        {options.map((option) => (
          <option key={option.id} value={String(option.id)}>
            #{option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
