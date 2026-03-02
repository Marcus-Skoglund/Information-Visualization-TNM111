// Define props
interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export default function Slider({ label, value, min, max, onChange }: SliderProps) {
  return (
    <div className="flex flex col space-y-2 w-full max-w-xs">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
          {" "}
          Unique interactions {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between w-full px-0.5">
        <span className="text-[10px] text-slate-400 font-medium">Min: {min}</span>
        <span className="text-[10px] text-slate-400 font-medium">Max: {max}</span>
      </div>
    </div>
  );
}
