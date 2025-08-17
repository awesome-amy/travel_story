import React, { useState, useMemo } from 'react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Search, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Place } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PlacesListProps {
  places: Place[];
  onBack: () => void;
  onPlaceSelect: (place: Place) => void;
}

export function PlacesList({ places, onBack, onPlaceSelect }: PlacesListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<'recent' | 'alphabet' | 'mostEntries'>('recent');

  const filteredAndSortedPlaces = useMemo(() => {
    let filtered = places.filter(place => 
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.adminArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.countryCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    switch (sortMode) {
      case 'alphabet':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case 'mostEntries':
        return filtered.sort((a, b) => b.entryCount - a.entryCount);
      case 'recent':
      default:
        return filtered; // Assuming places are already in recent order
    }
  }, [places, searchQuery, sortMode]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b p-4 z-10">
        <div className="flex items-center space-x-4 mb-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1>Places</h1>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search places..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Sort Options */}
        <Select value={sortMode} onValueChange={(value: any) => setSortMode(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recent</SelectItem>
            <SelectItem value="alphabet">Alphabetical</SelectItem>
            <SelectItem value="mostEntries">Most Entries</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Places List */}
      <div className="p-4 space-y-4">
        {filteredAndSortedPlaces.map((place) => (
          <Card 
            key={place.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onPlaceSelect(place)}
          >
            <CardContent className="p-0">
              <div className="flex">
                {/* Thumbnail */}
                <div className="w-24 h-24 flex-shrink-0">
                  <ImageWithFallback
                    src={place.thumbnailUrl || ''}
                    alt={place.name}
                    className="w-full h-full object-cover rounded-l-lg"
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3>{place.name}</h3>
                      <p className="text-muted-foreground">{place.adminArea}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant="outline">{place.entryCount} entries</Badge>
                      {place.draftCount > 0 && (
                        <Badge variant="secondary">{place.draftCount} drafts</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAndSortedPlaces.length === 0 && (
        <div className="text-center text-muted-foreground mt-8">
          <p>No places found matching your search.</p>
        </div>
      )}
    </div>
  );
}