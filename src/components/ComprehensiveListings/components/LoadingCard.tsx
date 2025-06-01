
import { Card, CardContent } from '@/components/ui/card';

export const LoadingCard = () => {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <CardContent className="p-4">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>
      </CardContent>
    </Card>
  );
};
