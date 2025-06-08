
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UploadedImageDisplayProps {
  photoUrl: string;
}

export const UploadedImageDisplay = ({ photoUrl }: UploadedImageDisplayProps) => {
  if (!photoUrl) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded Image</CardTitle>
      </CardHeader>
      <CardContent>
        <img 
          src={photoUrl} 
          alt="Uploaded challenge photo" 
          className="max-w-full h-auto rounded-lg shadow-md"
        />
        <p className="text-sm text-muted-foreground mt-2">
          Image URL: {photoUrl}
        </p>
      </CardContent>
    </Card>
  );
};
