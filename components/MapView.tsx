import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Place } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MapViewProps {
  places: Place[];
  onBack: () => void;
  onPlaceSelect: (place: Place) => void;
}

export function MapView({ places, onBack, onPlaceSelect }: MapViewProps) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const handlePinClick = (place: Place) => {
    setSelectedPlace(place);
  };

  const handleViewPlace = () => {
    if (selectedPlace) {
      onPlaceSelect(selectedPlace);
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-background border-b p-4 z-20">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1>Map</h1>
        </div>
      </div>

      {/* Simplified Map Background */}
      <div className="h-screen bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden pt-20">
        {/* World Map Outline (Simplified) */}
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 800 400" className="w-full h-full">
            <path
              d="M100,100 Q200,50 300,100 Q400,150 500,100 Q600,50 700,100 L700,300 Q600,350 500,300 Q400,250 300,300 Q200,350 100,300 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Place Pins */}
        {places.map((place, index) => (
          <div
            key={place.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{
              left: `${20 + (index * 15) % 60}%`,
              top: `${30 + (index * 12) % 40}%`
            }}
            onClick={() => handlePinClick(place)}
          >
            <div className="relative">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                <p className="bg-background px-2 py-1 rounded shadow-sm whitespace-nowrap">{place.name}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Place Preview Popover */}
        {selectedPlace && (
          <div className="absolute bottom-6 left-6 right-6 z-30">
            <Card className="shadow-xl">
              <CardContent className="p-4">
                <div className="flex space-x-4">
                  <div className="w-16 h-16 flex-shrink-0">
                    <ImageWithFallback
                      src={selectedPlace.thumbnailUrl || ''}
                      alt={selectedPlace.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3>{selectedPlace.name}</h3>
                    <p className="text-muted-foreground">{selectedPlace.adminArea}</p>
                    <div className="flex space-x-2 mt-2">
                      <Badge variant="outline">{selectedPlace.entryCount} entries</Badge>
                      {selectedPlace.draftCount > 0 && (
                        <Badge variant="secondary">{selectedPlace.draftCount} drafts</Badge>
                      )}
                    </div>
                  </div>
                  <Button onClick={handleViewPlace}>
                    View Place
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}