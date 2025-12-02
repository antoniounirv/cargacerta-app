"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { useDebounce } from 'use-debounce';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getCitySuggestions } from "@/ai/flows/city-suggestions-flow"

interface CityAutocompleteProps {
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
}

export function CityAutocomplete({ value, onValueChange, placeholder }: CityAutocompleteProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [debouncedSearch] = useDebounce(search, 1000);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (debouncedSearch) {
      setIsLoading(true);
      getCitySuggestions(debouncedSearch).then(result => {
        setSuggestions(result.suggestions);
        setIsLoading(false);
      }).catch(() => {
        setIsLoading(false);
        setSuggestions([]);
      });
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearch]);
  
  // When the external value changes, update the internal search state.
  React.useEffect(() => {
    setSearch(value);
  }, [value]);

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? "" : currentValue;
    onValueChange(newValue);
    setSearch(newValue); 
    setOpen(false);
  }

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    if (!newSearch) {
      onValueChange(""); // Clear external state if input is cleared
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <span className="truncate">{value || placeholder || "Selecione uma cidade..."}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder={placeholder || "Buscar cidade..."} 
            value={search} 
            onValueChange={handleSearchChange}
          />
          <CommandList>
            {isLoading && <div className="p-4 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>}
            {!isLoading && !suggestions.length && search && <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>}
            {!isLoading && (
                 <CommandGroup>
                    {suggestions.map((suggestion) => (
                        <CommandItem
                            key={suggestion}
                            value={suggestion}
                            onSelect={handleSelect}
                        >
                            <Check
                                className={cn(
                                "mr-2 h-4 w-4",
                                value === suggestion ? "opacity-100" : "opacity-0"
                                )}
                            />
                            {suggestion}
                        </CommandItem>
                    ))}
                 </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
