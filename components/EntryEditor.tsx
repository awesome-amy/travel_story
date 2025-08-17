import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Plus, X, Upload, Image, Video } from 'lucide-react';
import { Entry, Place } from '../types';

// Define countries list locally to avoid import issues
const COUNTRIES = [
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

interface EntryEditorProps {
  entry?: Entry;
  places: Place[];
  onBack: () => void;
  onSave: (entry: Partial<Entry>) => void;
}

export function EntryEditor({ entry, places, onBack, onSave }: EntryEditorProps) {
  const [title, setTitle] = useState(entry?.title || '');
  const [type, setType] = useState<'blog' | 'album' | 'video'>(entry?.type || 'blog');
  const [body, setBody] = useState(entry?.body || '');
  const [location, setLocation] = useState(entry?.location || '');
  const [country, setCountry] = useState(entry?.country || '');
  const [isPublished, setIsPublished] = useState(entry?.status === 'published');
  const [mediaUrls, setMediaUrls] = useState<string[]>(entry?.mediaUrls || []);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleSave = () => {
    const entryData: Partial<Entry> = {
      id: entry?.id,
      title,
      type,
      body: type === 'blog' ? body : undefined,
      mediaUrls: type !== 'blog' ? mediaUrls : undefined,
      location,
      country,
      status: isPublished ? 'published' : 'draft',
      updatedAt: new Date()
    };

    if (!entry) {
      entryData.createdAt = new Date();
    }

    onSave(entryData);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setUploadedFiles(prev => [...prev, ...fileArray]);
      
      // Convert files to object URLs for preview
      const fileUrls = fileArray.map(file => URL.createObjectURL(file));
      setMediaUrls(prev => [...prev, ...fileUrls]);
    }
  };

  const removeMediaItem = (index: number) => {
    // Clean up object URL if it exists
    const url = mediaUrls[index];
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
    
    setMediaUrls(mediaUrls.filter((_, i) => i !== index));
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  // Clean up object URLs on component unmount
  useEffect(() => {
    return () => {
      mediaUrls.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  const canSave = title.trim() && (location.trim() || country.trim()) && (
    (type === 'blog' && body.trim()) ||
    (type !== 'blog' && mediaUrls.length > 0)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b p-4 z-10">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              onClick={onBack}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!canSave}
            >
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-w-2xl mx-auto space-y-6">
        {/* Title */}
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title..."
            className="mt-2"
          />
        </div>

        {/* Type Selector */}
        <div>
          <Label>Entry Type</Label>
          <Select value={type} onValueChange={(value: any) => setType(value)}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blog">Blog 📖</SelectItem>
              <SelectItem value="album">Photo Album 📷</SelectItem>
              <SelectItem value="video">Video 🎬</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location and Country - Side by Side */}
        <div>
          <Label>Location & Country</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location (e.g., Central Park)"
              />
            </div>
            <div>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country..." />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {COUNTRIES.map((countryName) => (
                    <SelectItem key={countryName} value={countryName}>
                      {countryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div>
          <Label>
            {type === 'blog' ? 'Content (Markdown supported)' : 
             type === 'album' ? 'Photos' : 'Videos'}
          </Label>
          
          {type === 'blog' ? (
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your story... (Markdown supported: # for headings, ** for bold)"
              className="mt-2 min-h-[200px]"
            />
          ) : (
            <div className="mt-2 space-y-3">
              {/* Uploaded Media List */}
              {mediaUrls.map((url, index) => (
                <Card key={index}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          {type === 'album' ? (
                            <Image className="w-6 h-6 text-muted-foreground" />
                          ) : (
                            <Video className="w-6 h-6 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm">
                            {uploadedFiles[index]?.name || `${type === 'album' ? 'Photo' : 'Video'} ${index + 1}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {uploadedFiles[index]?.size ? 
                              `${(uploadedFiles[index].size / 1024 / 1024).toFixed(1)} MB` : 
                              'Uploaded'
                            }
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMediaItem(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* File Upload */}
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">
                    Select {type === 'album' ? 'photos' : 'videos'} from your device
                  </p>
                  <Label htmlFor="media-upload">
                    <Button variant="outline" className="cursor-pointer">
                      <Plus className="w-4 h-4 mr-2" />
                      Add {type === 'album' ? 'Photos' : 'Videos'}
                    </Button>
                  </Label>
                  <Input
                    id="media-upload"
                    type="file"
                    multiple
                    accept={type === 'album' ? 'image/*' : 'video/*'}
                    onChange={handleFileUpload}
                    className="hidden"
                    capture={type === 'album' ? 'environment' : undefined}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Draft/Publish Toggle */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <Label>Status</Label>
            <p className="text-sm text-muted-foreground">
              {isPublished ? 'This entry will be published and visible to others' : 'This entry will be saved as a draft'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="publish-toggle">
              {isPublished ? 'Published' : 'Draft'}
            </Label>
            <Switch
              id="publish-toggle"
              checked={isPublished}
              onCheckedChange={setIsPublished}
            />
          </div>
        </div>

        {/* Location Preview */}
        {(location || country) && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  📍
                </div>
                <div>
                  <h4>{location || 'Location'}</h4>
                  <p className="text-sm text-muted-foreground">{country || 'Country not specified'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}