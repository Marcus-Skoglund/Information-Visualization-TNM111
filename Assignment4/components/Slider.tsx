import { SliderProps } from "@/types/starwars"; // import types

export default function Slider({ label, value, min, max, onChange }: SliderProps) {
  return (
    <div className="flex flex-col space-y-2 w-full max-w-xs">
      <div className="flex flex-row justify-evenly items-center">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3.5 py-0.5 rounded">
          {" "}
          {value}
        </span>
      </div>
      <div>
        <div className="flex justify-between w-full px-0.5">
          <span className="text-[10px] text-slate-400 font-medium mr-1">Min: {min}</span>
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <span className="text-[10px] text-slate-400 font-medium ml-1">Max: {max}</span>
        </div>
      </div>
    </div>
  );
}
