import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, BookOpen, Camera, Video } from 'lucide-react';
import { Entry, Place } from '../types';

interface DraftsListProps {
  drafts: Entry[];
  places: Place[];
  onBack: () => void;
  onEditDraft: (draft: Entry) => void;
}

export function DraftsList({ drafts, places, onBack, onEditDraft }: DraftsListProps) {
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b p-4 z-10">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1>Drafts</h1>
            <p className="text-muted-foreground">{drafts.length} draft{drafts.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Drafts List */}
      <div className="p-4 space-y-4">
        {drafts.map((draft) => (
          <Card 
            key={draft.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onEditDraft(draft)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  {getEntryIcon(draft.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge key="type" variant="outline">{getTypeLabel(draft.type)}</Badge>
                    <Badge key="status" variant="secondary">Draft</Badge>
                  </div>
                  
                  <h3 className="truncate">{draft.title}</h3>
                  
                  <p className="text-muted-foreground text-sm">
                    {getEntryLocation(draft)}
                  </p>

                  {/* Preview content */}
                  {draft.body && (
                    <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                      {draft.body.replace(/#+\s/g, '').substring(0, 100)}...
                    </p>
                  )}

                  {draft.mediaUrls && draft.mediaUrls.length > 0 && (
                    <p className="text-muted-foreground text-sm mt-2">
                      {draft.mediaUrls.length} {draft.type === 'album' ? 'photo' : 'video'}{draft.mediaUrls.length !== 1 ? 's' : ''}
                    </p>
                  )}

                  <p className="text-muted-foreground text-xs mt-2">
                    Last edited: {draft.updatedAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {drafts.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3>No drafts</h3>
            <p>Your draft entries will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}