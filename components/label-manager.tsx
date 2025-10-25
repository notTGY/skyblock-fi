"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

interface Label {
  id: number
  name: string
  color: string
}

interface LabelManagerProps {
  itemId: string
  currentLabels: Label[]
  availableLabels: Label[]
  onAddLabel: (labelId: number) => void
  onRemoveLabel: (labelId: number) => void
}

export function LabelManager({ itemId, currentLabels, availableLabels, onAddLabel, onRemoveLabel }: LabelManagerProps) {
  const [open, setOpen] = useState(false)

  const unassignedLabels = availableLabels.filter((label) => !currentLabels.some((current) => current.id === label.id))

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {currentLabels.map((label) => (
        <Badge
          key={label.id}
          variant="outline"
          className="text-[10px] h-5 pr-1 gap-1"
          style={{ borderColor: label.color, color: label.color }}
        >
          {label.name}
          <button
            onClick={() => onRemoveLabel(label.id)}
            className="hover:bg-secondary rounded-sm p-0.5 transition-colors"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        </Badge>
      ))}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-5 px-2 text-[10px] gap-1 bg-transparent">
            <Plus className="h-2.5 w-2.5" />
            Add Label
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search labels..." className="h-7 text-xs" />
            <CommandList>
              <CommandEmpty className="text-xs p-2">No labels found.</CommandEmpty>
              <CommandGroup>
                {unassignedLabels.map((label) => (
                  <CommandItem
                    key={label.id}
                    onSelect={() => {
                      onAddLabel(label.id)
                      setOpen(false)
                    }}
                    className="text-xs"
                  >
                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: label.color }} />
                    {label.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
