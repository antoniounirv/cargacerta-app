'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useDebounce } from 'use-debounce';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface CityAutocompleteProps {
  value: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
}

export function CityAutocomplete({
  value,
  onSelect,
  placeholder = 'Selecione uma cidade...',
  emptyText = 'Nenhuma cidade encontrada.',
}: CityAutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (debouncedSearch) {
      setIsLoading(true);
      fetch(`/api/cities?q=${debouncedSearch}`)
        .then(res => res.json())
        .then((data: string[]) => {
          setSuggestions(data);
        })
        .finally(() => setIsLoading(false));
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearch]);

  const handleSelect = (currentValue: string) => {
    onSelect(currentValue);
    setSearch('');
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {value ? value : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Digite o nome da cidade..."
            onValueChange={setSearch}
          />
          <CommandList>
            {isLoading && <CommandEmpty>Carregando...</CommandEmpty>}
            {!isLoading && debouncedSearch && suggestions.length === 0 && (
              <CommandEmpty>{emptyText}</CommandEmpty>
            )}
            <CommandGroup>
              {suggestions.map(suggestion => (
                <CommandItem
                  key={suggestion}
                  value={suggestion}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === suggestion ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {suggestion}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
