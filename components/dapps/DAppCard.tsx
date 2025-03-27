// components/dapps/DAppCard.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Star as StarIcon, Globe as GlobeIcon, ExternalLink as ExternalLinkIcon } from 'lucide-react';

interface DAppCardProps {
  dapp: {
    id: string;
    name: string;
    description: string;
    url: string;
    logo?: string;
    categories: string[];
    featured?: boolean;
    bookmarked?: boolean;
  };
  onConnect: () => void;
}

const DAppCard: React.FC<DAppCardProps> = ({ dapp, onConnect }) => {
  return (
    <Card className="h-full flex flex-col hover:border-warm-primary dark:hover:border-warm-primary/80 transition-colors">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="p-4 flex-grow">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-md bg-warm-bg dark:bg-dark-100 flex items-center justify-center mr-3 overflow-hidden">
                {dapp.logo ? (
                  <img src={dapp.logo} alt={dapp.name} className="w-full h-full object-cover" />
                ) : (
                  <GlobeIcon className="h-6 w-6 text-warm-textSecondary dark:text-gray-400" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-warm-text dark:text-white">{dapp.name}</h3>
                <a 
                  href={dapp.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-warm-primary dark:text-warm-primary hover:underline flex items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  {dapp.url.replace(/^https?:\/\//, '')}
                  <ExternalLinkIcon className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
            {dapp.bookmarked && (
              <StarIcon className="h-5 w-5 text-yellow-500" />
            )}
          </div>
          
          <p className="text-sm text-warm-textSecondary dark:text-gray-400 mb-3">
            {dapp.description}
          </p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {dapp.categories.map((category) => (
              <Badge key={category} variant="default" size="sm">
                {category}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="mt-auto p-4 pt-2 border-t border-warm-divider dark:border-dark-100">
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={onConnect}
          >
            Connect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DAppCard;