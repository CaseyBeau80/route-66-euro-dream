
interface LoadingSpinnerProps {
  loading: boolean;
}

export const LoadingSpinner = ({ loading }: LoadingSpinnerProps) => {
  if (!loading) return null;

  return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span className="ml-2">Processing via Edge Function...</span>
    </div>
  );
};
