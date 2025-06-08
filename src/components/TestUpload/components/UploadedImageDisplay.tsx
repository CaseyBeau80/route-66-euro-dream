
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, ExternalLink } from 'lucide-react';

interface UploadedImageDisplayProps {
  photoUrl: string;
  onReplacePhoto?: () => void;
}

export const UploadedImageDisplay = ({ photoUrl, onReplacePhoto }: UploadedImageDisplayProps) => {
  if (!photoUrl) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Your Route 66 Photo</CardTitle>
          {onReplacePhoto && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onReplacePhoto}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Upload Different Photo
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative group">
          <img 
            src={photoUrl} 
            alt="Your Route 66 challenge photo" 
            className="w-full h-auto rounded-lg shadow-lg group-hover:shadow-xl transition-shadow"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg"></div>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div>
            <p className="font-medium">Photo successfully uploaded!</p>
            <p className="text-sm text-muted-foreground">
              Your image is now part of the Route 66 Photo Spot Challenge
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href={photoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              View Full Size
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
