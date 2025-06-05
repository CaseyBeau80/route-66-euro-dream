
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ApiKeyFormProps {
  apiKey: string;
  isSubmitting: boolean;
  cityName: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  children?: React.ReactNode;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({
  apiKey,
  isSubmitting,
  cityName,
  onInputChange,
  onSubmit,
  children
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <Input
        type="text"
        placeholder="Enter OpenWeatherMap API key (32 characters)"
        value={apiKey}
        onChange={onInputChange}
        className="text-sm font-mono"
        disabled={isSubmitting}
        maxLength={50}
      />
      
      <div className="text-xs text-gray-600">
        {apiKey.length > 0 && (
          <span>Length: {apiKey.length} characters | Trimmed: {apiKey.trim().length}</span>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button 
          type="submit" 
          size="sm" 
          disabled={!apiKey.trim() || isSubmitting}
          className="flex-1 text-xs"
        >
          {isSubmitting ? 'Setting up...' : `Enable Weather for ${cityName}`}
        </Button>
        
        {children}
      </div>
    </form>
  );
};

export default ApiKeyForm;
