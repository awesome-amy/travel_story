import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, RotateCcw, Trash2, BookOpen, Camera, Video } from 'lucide-react';
import { Entry, Place } from '../types';

interface TrashScreenProps {
  trashedEntries: Entry[];
  places: Place[];
  onBack: () => void;
  onRestore: (entry: Entry) => void;
  onPermanentDelete: (entry: Entry) => void;
}

export function TrashScreen({ trashedEntries, places, onBack, onRestore, onPermanentDelete }: TrashScreenProps) {
  const getEntryIcon = (type: string) => {
    switch (type) {
      case 'blog': return <BookOpen className="w-5 h-5" />;
      case 'album': return <Camera className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'blog': return 'Blog 📖';
      case 'album': return 'Photos 📷';
      case 'video': return 'Video 🎬';
      default: return 'Entry';
    }
  };

  const getPlaceName = (placeId: string) => {
    const place = places.find(p => p.id === placeId);
    return place ? `${place.name}, ${place.adminArea}` : 'Unknown location';
  };

  const getEntryLocation = (entry: Entry) => {
    if (entry.location && entry.country) {
      return `${entry.location}, ${entry.country}`;
    } else if (entry.location) {
      return entry.location;
    } else if (entry.country) {
      return entry.country;
    } else if (entry.placeId) {
      return getPlaceName(entry.placeId);
    }
    return 'Location not specified';
  };

  const getDaysUntilPermanentDelete = (deletedAt: Date) => {
    const now = new Date();
    const diffTime = 30 * 24 * 60 * 60 * 1000 - (now.getTime() - deletedAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b p-4 z-10">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1>Trash</h1>
            <p className="text-muted-foreground">
              {trashedEntries.length} deleted entr{trashedEntries.length !== 1 ? 'ies' : 'y'}
            </p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-4">
        <div className="bg-muted p-4 rounded-lg">
          <h4>30-day retention</h4>
          <p className="text-muted-foreground text-sm">
            Deleted entries are kept for 30 days before being permanently removed. 
            You can restore them anytime during this period.
          </p>
        </div>
      </div>

      {/* Trashed Entries */}
      <div className="px-4 pb-4 space-y-4">
        {trashedEntries.map((entry) => {
          const daysRemaining = entry.deletedAt ? getDaysUntilPermanentDelete(entry.deletedAt) : 30;
          
          return (
            <Card key={entry.id}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    {getEntryIcon(entry.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge key="type" variant="outline">{getTypeLabel(entry.type)}</Badge>
                      <Badge key="status" variant="destructive">Deleted</Badge>
                    </div>
                    
                    <h4 className="truncate">{entry.title}</h4>
                    
                    <p className="text-muted-foreground text-sm">
                      {getEntryLocation(entry)}
                    </p>

                    <p className="text-muted-foreground text-xs mt-2">
                      Deleted: {entry.deletedAt?.toLocaleDateString()}
                    </p>
                    
                    <p className="text-muted-foreground text-xs">
                      {daysRemaining > 0 
                        ? `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} until permanent deletion`
                        : 'Will be permanently deleted soon'
                      }
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRestore(entry)}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restore
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onPermanentDelete(entry)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {trashedEntries.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            <Trash2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3>Trash is empty</h3>
            <p>Deleted entries will appear here for 30 days before being permanently removed</p>
          </div>
        )}
      </div>
    </div>
  );
}