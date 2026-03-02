import { DropdownProps } from "@/types/starwars"; // import types

// Dropdown meny
export default function Dropdown({ label, value, options, onChange }: DropdownProps) {
  return (
    <div className="flex flex-col">
      <label className="mb-2 font-medium text-slate-700">{label}</label>
      <select
        className="p-2 border rounded bg-white shadow-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
