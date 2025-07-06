import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ChatBubbleProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ 
  title, 
  children, 
  icon = <MessageCircle className="h-5 w-5" />
}) => {
  return (
    <Card className="bg-gradient-to-r from-route66-primary/10 to-route66-secondary/10 border-route66-primary/20 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-10 h-10 bg-route66-primary rounded-full flex items-center justify-center text-white shadow-lg">
            {icon}
          </div>
          <div className="flex-1 space-y-3">
            <h3 className="font-semibold text-route66-text-primary text-lg">
              {title}
            </h3>
            <div className="text-route66-text-secondary leading-relaxed">
              {children}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatBubble;