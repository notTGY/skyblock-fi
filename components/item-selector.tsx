"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  VirtualizedCommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Item {
  id: string;
  name: string;
}

interface ItemSelectorProps {
  items: Item[];
  selectedItem: string | null;
  onSelectItem: (itemId: string) => void;
  loading?: boolean;
}

export function ItemSelector({
  items,
  selectedItem,
  onSelectItem,
  loading = false,
}: ItemSelectorProps) {
  const [open, setOpen] = useState(false);

  const selected = items.find((item) => item.id === selectedItem);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-xs h-8 font-mono bg-transparent"
          disabled={loading}
        >
          {loading
            ? "Loading items..."
            : selected
              ? selected.name
              : "Select item..."}
          <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search items..." className="h-8 text-xs" />
          {items.length > 50 ? (
            <VirtualizedCommandList height={300} itemSize={32}>
              <CommandEmpty className="text-xs p-2">
                {loading ? "Loading items..." : "No item found."}
              </CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.name}
                    onSelect={() => {
                      onSelectItem(item.id);
                      setOpen(false);
                    }}
                    className="text-xs"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-3 w-3",
                        selectedItem === item.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </VirtualizedCommandList>
          ) : (
            <CommandList>
              <CommandEmpty className="text-xs p-2">
                {loading ? "Loading items..." : "No item found."}
              </CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.name}
                    onSelect={() => {
                      onSelectItem(item.id);
                      setOpen(false);
                    }}
                    className="text-xs"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-3 w-3",
                        selectedItem === item.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
