"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const intervals = [
  { label: "Off", value: 0 },
  { label: "30 seconds", value: 30 * 1000 },
  { label: "1 minute", value: 60 * 1000 },
  { label: "5 minutes", value: 5 * 60 * 1000 },
  { label: "10 minutes", value: 10 * 60 * 1000 },
];

interface RefetchIntervalSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export function RefetchIntervalSelector({
  value,
  onChange,
}: RefetchIntervalSelectorProps) {
  const [open, setOpen] = useState(false);

  const selectedInterval = intervals.find((i) => i.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[140px] justify-between text-xs"
        >
          {selectedInterval?.label || "Select interval"}
          <ChevronDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[140px] p-0">
        <Command>
          <CommandInput placeholder="Search intervals..." className="h-8" />
          <CommandList>
            <CommandEmpty>No interval found.</CommandEmpty>
            <CommandGroup>
              {intervals.map((interval) => (
                <CommandItem
                  key={interval.value}
                  value={interval.label}
                  onSelect={() => {
                    onChange(interval.value);
                    setOpen(false);
                  }}
                >
                  <span
                    className={cn(
                      "text-xs",
                      value === interval.value && "font-medium",
                    )}
                  >
                    {interval.label}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
