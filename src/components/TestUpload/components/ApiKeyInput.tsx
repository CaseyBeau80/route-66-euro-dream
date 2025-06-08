
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ApiKeyInputProps {
  apiKey: string;
  onChange: (value: string) => void;
}

export const ApiKeyInput = ({ apiKey, onChange }: ApiKeyInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="apiKey">Google Cloud Vision API Key</Label>
      <Input
        id="apiKey"
        type="password"
        placeholder="Enter your API key"
        value={apiKey}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
