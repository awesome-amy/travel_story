import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { PenTool, MapPin, Map, FileText, Trash2 } from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (screen: 'create' | 'places' | 'map' | 'drafts' | 'trash') => void;
  draftCount: number;
  trashedCount?: number;
}

export function HomeScreen({ onNavigate, draftCount, trashedCount = 0 }: HomeScreenProps) {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="mb-2">Travel Stories</h1>
          <p className="text-muted-foreground">Capture your journeys</p>
        </div>

        <div className="space-y-4">
          {/* Create New Entry */}
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onNavigate('create')}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                  <PenTool className="w-6 h-6" />
                </div>
                <div>
                  <h3>Create New Entry</h3>
                  <p className="text-muted-foreground">Start a new blog, album, or video</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* See All Places */}
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onNavigate('places')}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3>See All Places</h3>
                  <p className="text-muted-foreground">Browse your travel destinations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* See All Places on Map */}
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onNavigate('map')}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center">
                  <Map className="w-6 h-6" />
                </div>
                <div>
                  <h3>See All Places on Map</h3>
                  <p className="text-muted-foreground">Explore destinations visually</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Drafts Badge */}
          {draftCount > 0 && (
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow border-dashed"
              onClick={() => onNavigate('drafts')}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-muted text-muted-foreground rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3>Drafts</h3>
                      <p className="text-muted-foreground">Continue writing your stories</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{draftCount}</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trash Badge */}
          {trashedCount > 0 && (
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow border-dashed border-destructive/50"
              onClick={() => onNavigate('trash')}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center">
                      <Trash2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3>Trash</h3>
                      <p className="text-muted-foreground">Recently deleted entries</p>
                    </div>
                  </div>
                  <Badge variant="destructive">{trashedCount}</Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}