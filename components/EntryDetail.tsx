import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Edit, Trash2, BookOpen, Camera, Video, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Entry, Place } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface EntryDetailProps {
  entry: Entry;
  place?: Place;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function EntryDetail({ entry, place, onBack, onEdit, onDelete }: EntryDetailProps) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handlePhotoClick = (index: number) => {
    setViewerIndex(index);
  };

  const handleCloseViewer = () => setViewerIndex(null);

  const handleNext = () => {
    if (entry.mediaUrls) {
      setViewerIndex((prev) =>
        prev === null ? null : (prev + 1) % entry.mediaUrls.length
      );
    }
  };

  const handlePrev = () => {
    if (entry.mediaUrls) {
      setViewerIndex((prev) =>
        prev === null
          ? null
          : (prev - 1 + entry.mediaUrls.length) % entry.mediaUrls.length
      );
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const endX = e.changedTouches[0].clientX;
    if (touchStartX - endX > 50) handleNext();
    if (endX - touchStartX > 50) handlePrev();
    setTouchStartX(null);
  };
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

  const renderMarkdown = (content: string) => {
    // Simple markdown rendering
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index}>{line.substring(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index}>{line.substring(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index}>{line.substring(4)}</h3>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index}>{line}</p>;
      });
  };

  // Get location display text
  const getLocationDisplay = () => {
    if (entry.location && entry.country) {
      return `${entry.location}, ${entry.country}`;
    } else if (entry.location) {
      return entry.location;
    } else if (entry.country) {
      return entry.country;
    } else if (place) {
      return `${place.name}, ${place.adminArea}`;
    }
    return 'Location not specified';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b p-4 z-10">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" onClick={onDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-w-2xl mx-auto">
        {/* Entry Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            {getEntryIcon(entry.type)}
            <Badge key="type" variant="outline">{getTypeLabel(entry.type)}</Badge>
            {entry.status === 'draft' && <Badge key="status" variant="secondary">Draft</Badge>}
          </div>
          
          <h1>{entry.title}</h1>
          
          <p className="text-muted-foreground">
            📍 {getLocationDisplay()}
          </p>
          
          <p className="text-muted-foreground text-sm mt-2">
            {entry.createdAt.toLocaleDateString()} 
            {entry.updatedAt.getTime() !== entry.createdAt.getTime() && 
              ` • Updated ${entry.updatedAt.toLocaleDateString()}`
            }
          </p>
        </div>

        {/* Entry Content */}
        <div className="space-y-6">
          {entry.type === 'blog' && entry.body && (
            <div className="prose prose-sm max-w-none">
              {renderMarkdown(entry.body)}
            </div>
          )}

          {(entry.type === 'album' || entry.type === 'video') && entry.mediaUrls && (
            <div className="space-y-4">
              {entry.type === 'album' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {entry.mediaUrls.map((url, index) => (
                    <div
                      key={index}
                      className="aspect-video rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => handlePhotoClick(index)}
                    >
                      <ImageWithFallback
                        src={url}
                        alt={`${entry.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                // Video
                <div className="space-y-4">
                  {entry.mediaUrls.map((url, index) => (
                    <div key={index} className="aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                      <div className="text-center">
                        <Video className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-muted-foreground">Video: {url}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          (Video player would be embedded here)
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
      {viewerIndex !== null && entry.mediaUrls && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white"
            onClick={handleCloseViewer}
          >
            <X className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 text-white"
            onClick={handlePrev}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <img
            src={entry.mediaUrls[viewerIndex]}
            alt={`Photo ${viewerIndex + 1}`}
            className="max-h-full max-w-full object-contain"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 text-white"
            onClick={handleNext}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      )}
    </div>
  );
}