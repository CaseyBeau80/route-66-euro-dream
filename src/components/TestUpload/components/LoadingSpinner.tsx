
import { Route } from 'lucide-react';

interface LoadingSpinnerProps {
  loading: boolean;
}

export const LoadingSpinner = ({ loading }: LoadingSpinnerProps) => {
  if (!loading) return null;

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <Route className="h-6 w-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary" />
      </div>
      <div className="text-center space-y-2">
        <p className="font-medium">Processing your Route 66 photo...</p>
        <p className="text-sm text-muted-foreground">
          We're checking image quality and preparing it for the challenge
        </p>
      </div>
    </div>
  );
};
