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
  const [debouncedSearch] = useDebounce(search, 1000); // Increased debounce time
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    // Only search if the query is long enough
    if (debouncedSearch && debouncedSearch.length > 2) {
      setIsLoading(true);
      getCitySuggestions(debouncedSearch).then(result => {
        setSuggestions(result.suggestions);
        setIsLoading(false);
      }).catch(() => {
        // In case of API error, stop loading and clear suggestions
        setIsLoading(false);
        setSuggestions([]);
      });
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearch]);
  
  React.useEffect(() => {
    if (value) {
        setSearch(value);
    }
  }, [value]);

  const handleSelect = (currentValue: string) => {
    onValueChange(currentValue === value ? "" : currentValue);
    setSearch(currentValue === value ? "" : currentValue)
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || placeholder || "Selecione uma cidade..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder={placeholder || "Buscar cidade..."} 
            value={search} 
            onValueChange={setSearch}
          />
          <CommandList>
            {isLoading && <div className="p-4 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>}
            {!isLoading && <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>}
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
