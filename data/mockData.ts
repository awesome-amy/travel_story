import { Place, Entry } from '../types';

export const mockPlaces: Place[] = [
  {
    id: '1',
    name: 'Paris',
    countryCode: 'FR',
    adminArea: 'Île-de-France',
    locality: 'Paris',
    lat: 48.8566,
    lon: 2.3522,
    thumbnailUrl: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=300&h=200&fit=crop',
    entryCount: 5,
    draftCount: 2
  },
  {
    id: '2',
    name: 'Tokyo',
    countryCode: 'JP',
    adminArea: 'Tokyo',
    locality: 'Shibuya',
    lat: 35.6762,
    lon: 139.6503,
    thumbnailUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=200&fit=crop',
    entryCount: 3,
    draftCount: 1
  },
  {
    id: '3',
    name: 'New York',
    countryCode: 'US',
    adminArea: 'New York',
    locality: 'Manhattan',
    lat: 40.7128,
    lon: -74.0060,
    thumbnailUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=300&h=200&fit=crop',
    entryCount: 7,
    draftCount: 0
  },
  {
    id: '4',
    name: 'Santorini',
    countryCode: 'GR',
    adminArea: 'South Aegean',
    locality: 'Oia',
    lat: 36.4618,
    lon: 25.3753,
    thumbnailUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300&h=200&fit=crop',
    entryCount: 2,
    draftCount: 1
  }
];

export const mockEntries: Entry[] = [
  {
    id: '1',
    placeId: '1',
    location: 'Eiffel Tower area',
    country: 'France',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
    type: 'blog',
    title: 'First Day in Paris',
    body: '# Amazing Start\n\nParis welcomed us with open arms! The Eiffel Tower looks even more magnificent in person.',
    status: 'published'
  },
  {
    id: '2',
    placeId: '1',
    location: 'Louvre Museum',
    country: 'France',
    createdAt: new Date('2024-12-02'),
    updatedAt: new Date('2024-12-02'),
    type: 'album',
    title: 'Louvre Museum Visit',
    mediaUrls: [
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1566139006694-05d32ea7a65b?w=400&h=300&fit=crop'
    ],
    status: 'published'
  },
  {
    id: '3',
    placeId: '1',
    location: 'Seine River',
    country: 'France',
    createdAt: new Date('2024-12-03'),
    updatedAt: new Date('2024-12-03'),
    type: 'blog',
    title: 'Draft: Seine River Walk',
    body: '# Beautiful Evening\n\nWalking along the Seine at sunset...',
    status: 'draft'
  },
  {
    id: '4',
    placeId: '2',
    location: 'Shibuya Crossing',
    country: 'Japan',
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-11-15'),
    type: 'video',
    title: 'Shibuya Crossing Rush',
    mediaUrls: ['https://player.vimeo.com/video/example'],
    status: 'published'
  },
  {
    id: '5',
    placeId: '3',
    location: 'Central Park',
    country: 'United States',
    createdAt: new Date('2024-10-20'),
    updatedAt: new Date('2024-10-20'),
    type: 'blog',
    title: 'Central Park Morning',
    body: '# Peaceful Start\n\nMorning jog through Central Park was exactly what I needed.',
    status: 'published'
  }
];