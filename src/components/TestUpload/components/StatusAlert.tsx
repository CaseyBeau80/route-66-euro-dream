
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface StatusAlertProps {
  status: string;
}

export const StatusAlert = ({ status }: StatusAlertProps) => {
  if (!status) return null;

  return (
    <Alert variant={status.includes('❌') ? 'destructive' : 'default'}>
      <div className="flex items-center gap-2">
        {status.includes('✅') && <CheckCircle className="h-4 w-4" />}
        {status.includes('❌') && <AlertTriangle className="h-4 w-4" />}
        <AlertDescription>{status}</AlertDescription>
      </div>
    </Alert>
  );
};
