"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const intervals = [
  { label: "Off", value: 0 },
  { label: "30s", value: 30 * 1000 },
  { label: "1m", value: 60 * 1000 },
  { label: "5m", value: 5 * 60 * 1000 },
  { label: "10m", value: 10 * 60 * 1000 },
];

interface RefetchIntervalSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export function RefetchIntervalSelector({
  value,
  onChange,
}: RefetchIntervalSelectorProps) {
  const selectedInterval = intervals.find((i) => i.value === value);

  return (
    <Select
      value={value.toString()}
      onValueChange={(val: string) => onChange(parseInt(val, 10))}
    >
      <SelectTrigger className="w-[80px] h-6 text-xs border-none bg-transparent hover:bg-secondary">
        <SelectValue>{selectedInterval?.label || "Off"}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {intervals.map((interval) => (
          <SelectItem
            key={interval.value}
            value={interval.value.toString()}
            className="text-xs"
          >
            {interval.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
