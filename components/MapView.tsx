import React from 'react';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { Place } from '../types';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet@4.2.1';
import 'leaflet@1.9.4/dist/leaflet.css';
import L from 'leaflet@1.9.4';

delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapViewProps {
  places: Place[];
  onBack: () => void;
  onPlaceSelect: (place: Place) => void;
}

export function MapView({ places, onBack, onPlaceSelect }: MapViewProps) {

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-0 left-0 right-0 bg-background border-b p-4 z-10 flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1>Map</h1>
      </div>
      <div className="h-screen pt-16">
        <MapContainer center={[20, 0]} zoom={2} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {places.map((place) => (
            <Marker
              key={place.id}
              position={[place.lat, place.lon]}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-medium mb-2">{place.name}</p>
                  <Button size="sm" onClick={() => onPlaceSelect(place)}>
                    View Place
                  </Button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}