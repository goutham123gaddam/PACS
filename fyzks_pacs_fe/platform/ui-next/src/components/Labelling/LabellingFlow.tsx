import React, { useState, useEffect } from 'react';
import { CheckIcon } from '@radix-ui/react-icons';
import cloneDeep from 'lodash.clonedeep';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../Command/Command';
import { cn } from '../../lib/utils';
import { ScrollArea } from '../ScrollArea/ScrollArea';

interface PropType {
  labellingDoneCallback: (label: string) => void;
  measurementData: any;
  labelData: LabelInfo[];
  exclusive: boolean;
  hide: () => void;
  placeholder?: string;
  emptyMessage?: string;
  initialLabel?: string;
  allowCustomText?: boolean; // New prop to enable/disable custom text
}

export interface LabelInfo {
  label: string;
  value: string;
}

const LabellingFlow: React.FC<PropType> = ({
  labellingDoneCallback,
  measurementData,
  labelData,
  exclusive,
  hide,
  placeholder = 'Type label or search...',
  emptyMessage = 'No labels found.',
  initialLabel,
  allowCustomText = true, // Default to true for free text
}) => {
  const [value, setValue] = useState<string | undefined>(initialLabel);
  const [currentItems, setCurrentItems] = useState<LabelInfo[]>([]);
  const [inputValue, setInputValue] = useState<string>(initialLabel || '');

  // Update items when labelData changes
  useEffect(() => {
    if (labelData) {
      setCurrentItems(cloneDeep(labelData));
    }
  }, [labelData]);

  // Initialize from measurementData if no initialLabel
  useEffect(() => {
    if (!initialLabel && measurementData?.label) {
      setValue(measurementData.label);
      setInputValue(measurementData.label);
    }
  }, [initialLabel, measurementData]);

  const handleInputValueChange = (newValue: string) => {
    setInputValue(newValue);

    // If allowCustomText is true and user presses Enter, create custom label
    if (allowCustomText && newValue.trim()) {
      setValue(newValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && allowCustomText && inputValue.trim()) {
      e.preventDefault();
      const customLabel = inputValue.trim();
      setValue(customLabel);
      labellingDoneCallback(customLabel);
      hide();
    } else if (e.key === 'Escape') {
      hide();
    }
  };

  const handleSelectItem = (currentValue: string) => {
    const newValue = currentValue === value ? '' : currentValue;
    setValue(newValue);
    labellingDoneCallback(newValue);
    hide();
  };

  // Filter items based on input
  const filteredItems = currentItems.filter(item =>
    item.label.toLowerCase().includes(inputValue.toLowerCase()) ||
    item.value.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Show custom option if no matches and allowCustomText is true
  const showCustomOption = allowCustomText &&
                          inputValue.trim() &&
                          filteredItems.length === 0;

  return (
    <Command className="border-input border">
      <CommandInput
        placeholder={placeholder}
        value={inputValue}
        onValueChange={handleInputValueChange}
        onKeyDown={handleKeyDown}
      />
      <CommandList>
        {/* Show empty message only if no custom text option */}
        {!showCustomOption && <CommandEmpty>{emptyMessage}</CommandEmpty>}

        <ScrollArea className="h-[300px]">
          <CommandGroup>
            {/* Show filtered predefined items */}
            {filteredItems.map(item => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={handleSelectItem}
              >
                <CheckIcon
                  className={cn('mr-2 h-4 w-4', value === item.value ? 'opacity-100' : 'opacity-0')}
                />
                {item.label}
              </CommandItem>
            ))}

            {/* Show custom text option when no predefined matches */}
            {showCustomOption && (
              <CommandItem
                value={inputValue.trim()}
                onSelect={() => {
                  const customLabel = inputValue.trim();
                  setValue(customLabel);
                  labellingDoneCallback(customLabel);
                  hide();
                }}
                className="border-l-2 border-green-500 bg-green-50 dark:bg-green-900/20"
              >
                <CheckIcon
                  className={cn('mr-2 h-4 w-4', value === inputValue.trim() ? 'opacity-100' : 'opacity-0')}
                />
                <span className="font-medium">Create: "</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {inputValue.trim()}
                </span>
                <span className="font-medium">"</span>
              </CommandItem>
            )}
          </CommandGroup>
        </ScrollArea>
      </CommandList>

      {/* Instructions at bottom */}
      {allowCustomText && (
        <div className="border-t p-2 text-xs text-muted-foreground">
          {filteredItems.length > 0
            ? "Select from list or type custom text and press Enter"
            : "Type custom text and press Enter to create new label"
          }
        </div>
      )}
    </Command>
  );
};

export default LabellingFlow;
