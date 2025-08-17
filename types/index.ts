export interface Place {
  id: string;
  name: string;
  countryCode: string;
  adminArea: string;
  locality: string;
  lat: number;
  lon: number;
  thumbnailUrl?: string;
  entryCount: number;
  draftCount: number;
}

export interface Entry {
  id: string;
  placeId?: string; // Make optional since we'll use location/country instead
  location?: string; // Free text location
  country?: string; // Country from dropdown
  createdAt: Date;
  updatedAt: Date;
  type: 'blog' | 'album' | 'video';
  title: string;
  body?: string; // Markdown for blogs
  mediaUrls?: string[]; // For albums and videos
  status: 'draft' | 'published' | 'trashed';
  deletedAt?: Date;
}

export interface MediaAsset {
  id: string;
  type: 'photo' | 'video';
  url: string;
  caption?: string;
}

export type NavigationState = 'collapsed' | 'expanded';
export type SortMode = 'recent' | 'alphabet' | 'mostEntries';

// Common countries list
export const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Armenia', 'Australia',
  'Austria', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Belarus', 'Belgium',
  'Bolivia', 'Bosnia and Herzegovina', 'Brazil', 'Bulgaria', 'Cambodia',
  'Canada', 'Chile', 'China', 'Colombia', 'Croatia', 'Czech Republic',
  'Denmark', 'Egypt', 'Estonia', 'Finland', 'France', 'Georgia', 'Germany',
  'Ghana', 'Greece', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran',
  'Iraq', 'Ireland', 'Israel', 'Italy', 'Japan', 'Jordan', 'Kazakhstan',
  'Kenya', 'Kuwait', 'Latvia', 'Lebanon', 'Lithuania', 'Luxembourg',
  'Malaysia', 'Mexico', 'Morocco', 'Netherlands', 'New Zealand', 'Norway',
  'Pakistan', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania',
  'Russia', 'Saudi Arabia', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa',
  'South Korea', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland', 'Thailand',
  'Turkey', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
  'Uruguay', 'Venezuela', 'Vietnam'
];