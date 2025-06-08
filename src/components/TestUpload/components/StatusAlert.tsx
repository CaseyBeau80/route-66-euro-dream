
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, Camera, Heart } from 'lucide-react';

interface StatusAlertProps {
  status: string;
}

export const StatusAlert = ({ status }: StatusAlertProps) => {
  if (!status) return null;

  const isSuccess = status.includes('🎉') || status.includes('✅');
  const isError = status.includes('❌');
  const isProcessing = status.includes('📸');

  const getIcon = () => {
    if (isSuccess) return <Heart className="h-4 w-4" />;
    if (isError) return <AlertTriangle className="h-4 w-4" />;
    if (isProcessing) return <Camera className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const getVariant = () => {
    if (isError) return 'destructive';
    return 'default';
  };

  return (
    <Alert variant={getVariant()} className={isSuccess ? 'border-green-200 bg-green-50' : ''}>
      <div className="flex items-center gap-2">
        {getIcon()}
        <AlertDescription className={isSuccess ? 'text-green-800' : ''}>{status}</AlertDescription>
      </div>
    </Alert>
  );
};
