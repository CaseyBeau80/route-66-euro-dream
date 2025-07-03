import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';

interface PhotoStateDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  language: string;
}

const stateOptions = {
  en: {
    placeholder: "Select state (optional)",
    states: {
      'illinois': 'Illinois',
      'missouri': 'Missouri', 
      'kansas': 'Kansas',
      'oklahoma': 'Oklahoma',
      'texas': 'Texas',
      'new-mexico': 'New Mexico',
      'arizona': 'Arizona',
      'california': 'California'
    }
  },
  de: {
    placeholder: "Bundesstaat auswählen (optional)",
    states: {
      'illinois': 'Illinois',
      'missouri': 'Missouri',
      'kansas': 'Kansas', 
      'oklahoma': 'Oklahoma',
      'texas': 'Texas',
      'new-mexico': 'New Mexico',
      'arizona': 'Arizona',
      'california': 'Kalifornien'
    }
  },
  fr: {
    placeholder: "Sélectionner l'état (optionnel)",
    states: {
      'illinois': 'Illinois',
      'missouri': 'Missouri',
      'kansas': 'Kansas',
      'oklahoma': 'Oklahoma', 
      'texas': 'Texas',
      'new-mexico': 'Nouveau-Mexique',
      'arizona': 'Arizona',
      'california': 'Californie'
    }
  },
  'pt-BR': {
    placeholder: "Selecionar estado (opcional)",
    states: {
      'illinois': 'Illinois',
      'missouri': 'Missouri',
      'kansas': 'Kansas',
      'oklahoma': 'Oklahoma',
      'texas': 'Texas', 
      'new-mexico': 'Novo México',
      'arizona': 'Arizona',
      'california': 'Califórnia'
    }
  }
};

export const PhotoStateDropdown: React.FC<PhotoStateDropdownProps> = ({
  value,
  onValueChange,
  language
}) => {
  const content = stateOptions[language as keyof typeof stateOptions] || stateOptions.en;

  return (
    <div className="w-full">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full bg-white border-route66-border text-route66-text-primary">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-route66-primary" />
            <SelectValue placeholder={content.placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white border-route66-border z-50">
          {Object.entries(content.states).map(([key, label]) => (
            <SelectItem 
              key={key} 
              value={key}
              className="text-route66-text-primary hover:bg-route66-background focus:bg-route66-background"
            >
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};