import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { ArrowLeft, Plus, MoreVertical, BookOpen, Camera, Video, Edit, Trash2 } from 'lucide-react';
import { Place, Entry } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PlaceDetailProps {
  place: Place;
  entries: Entry[];
  onBack: () => void;
  onCreateEntry: (placeId: string) => void;
  onEditEntry: (entry: Entry) => void;
  onDeleteEntry: (entry: Entry) => void;
  onViewEntry: (entry: Entry) => void;
}

export function PlaceDetail({ 
  place, 
  entries, 
  onBack, 
  onCreateEntry, 
  onEditEntry, 
  onDeleteEntry,
  onViewEntry 
}: PlaceDetailProps) {
  const [activeTab, setActiveTab] = useState('entries');

  const publishedEntries = entries.filter(e => e.status === 'published');
  const mediaEntries = publishedEntries.filter(e => e.type === 'album' || e.type === 'video');

  const getEntryIcon = (type: string) => {
    switch (type) {
      case 'blog': return <BookOpen className="w-4 h-4" />;
      case 'album': return <Camera className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b z-10">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onCreateEntry(place.id)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Entry
            </Button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="px-4 pb-4">
          <div className="h-48 rounded-lg overflow-hidden mb-4">
            <ImageWithFallback
              src={place.thumbnailUrl || ''}
              alt={place.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h1>{place.name}</h1>
          <p className="text-muted-foreground">{place.adminArea}</p>
          <div className="flex space-x-2 mt-2">
            <Badge variant="outline">{place.entryCount} entries</Badge>
            {place.draftCount > 0 && (
              <Badge variant="secondary">{place.draftCount} drafts</Badge>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mx-4">
            <TabsTrigger value="entries">Entries</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="entries" className="space-y-4">
            {publishedEntries.map((entry) => (
              <Card key={entry.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => onViewEntry(entry)}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        {getEntryIcon(entry.type)}
                        <Badge key="type" variant="outline">{getTypeLabel(entry.type)}</Badge>
                      </div>
                      <h3>{entry.title}</h3>
                      <p className="text-muted-foreground">
                        {entry.createdAt.toLocaleDateString()}
                      </p>
                      {entry.body && (
                        <p className="text-muted-foreground mt-2 line-clamp-2">
                          {entry.body.replace(/#+\s/g, '').substring(0, 100)}...
                        </p>
                      )}
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditEntry(entry)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDeleteEntry(entry)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {publishedEntries.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <p>No entries yet for this place.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => onCreateEntry(place.id)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Entry
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="gallery">
            <div className="grid grid-cols-2 gap-4">
              {mediaEntries.map((entry) => (
                <Card key={entry.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="aspect-square">
                      {entry.mediaUrls && entry.mediaUrls[0] && (
                        <ImageWithFallback
                          src={entry.mediaUrls[0]}
                          alt={entry.title}
                          className="w-full h-full object-cover rounded-lg"
                          onClick={() => onViewEntry(entry)}
                        />
                      )}
                    </div>
                    <div className="p-3">
                      <div className="flex items-center space-x-1 mb-1">
                        {getEntryIcon(entry.type)}
                        <span className="text-xs text-muted-foreground">
                          {entry.type === 'album' ? 'Photos' : 'Video'}
                        </span>
                      </div>
                      <p className="text-sm">{entry.title}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {mediaEntries.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <p>No photos or videos yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}