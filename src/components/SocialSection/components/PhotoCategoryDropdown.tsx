import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera } from 'lucide-react';

interface PhotoCategoryDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  language: string;
}

const categoryOptions = {
  en: {
    placeholder: "Select photo category (optional)",
    categories: {
      'roadside-attraction': 'Roadside Attraction',
      'historic-landmark': 'Historic Landmark',
      'neon-sign': 'Neon Sign',
      'gas-station': 'Gas Station',
      'diner-restaurant': 'Diner/Restaurant',
      'motel-lodging': 'Motel/Lodging',
      'natural-landmark': 'Natural Landmark',
      'vintage-car': 'Vintage Car',
      'route66-shield': 'Route 66 Shield',
      'scenic-view': 'Scenic View',
      'other': 'Other'
    }
  },
  de: {
    placeholder: "Fotokategorie auswählen (optional)",
    categories: {
      'roadside-attraction': 'Straßenrand-Attraktion',
      'historic-landmark': 'Historisches Wahrzeichen',
      'neon-sign': 'Neonschild',
      'gas-station': 'Tankstelle',
      'diner-restaurant': 'Diner/Restaurant',
      'motel-lodging': 'Motel/Unterkunft',
      'natural-landmark': 'Natürliches Wahrzeichen',
      'vintage-car': 'Oldtimer',
      'route66-shield': 'Route 66 Schild',
      'scenic-view': 'Landschaftsblick',
      'other': 'Andere'
    }
  },
  fr: {
    placeholder: "Sélectionner la catégorie (optionnel)",
    categories: {
      'roadside-attraction': 'Attraction routière',
      'historic-landmark': 'Monument historique',
      'neon-sign': 'Enseigne néon',
      'gas-station': 'Station-service',
      'diner-restaurant': 'Diner/Restaurant',
      'motel-lodging': 'Motel/Hébergement',
      'natural-landmark': 'Monument naturel',
      'vintage-car': 'Voiture vintage',
      'route66-shield': 'Panneau Route 66',
      'scenic-view': 'Vue panoramique',
      'other': 'Autre'
    }
  },
  'pt-BR': {
    placeholder: "Selecionar categoria (opcional)",
    categories: {
      'roadside-attraction': 'Atração da Estrada',
      'historic-landmark': 'Marco Histórico',
      'neon-sign': 'Placa de Neon',
      'gas-station': 'Posto de Gasolina',
      'diner-restaurant': 'Lanchonete/Restaurante',
      'motel-lodging': 'Motel/Hospedagem',
      'natural-landmark': 'Marco Natural',
      'vintage-car': 'Carro Vintage',
      'route66-shield': 'Placa da Rota 66',
      'scenic-view': 'Vista Panorâmica',
      'other': 'Outro'
    }
  }
};

export const PhotoCategoryDropdown: React.FC<PhotoCategoryDropdownProps> = ({
  value,
  onValueChange,
  language
}) => {
  const content = categoryOptions[language as keyof typeof categoryOptions] || categoryOptions.en;

  return (
    <div className="w-full">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full bg-white border-route66-border text-route66-text-primary">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-route66-primary" />
            <SelectValue placeholder={content.placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white border-route66-border z-50">
          {Object.entries(content.categories).map(([key, label]) => (
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