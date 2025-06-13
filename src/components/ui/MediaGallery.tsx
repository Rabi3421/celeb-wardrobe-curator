
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  isPrimary: boolean;
  displayOrder: number;
}

interface MediaGalleryProps {
  media: MediaItem[];
  title: string;
  celebrity: string;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ media, title, celebrity }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  if (!media || media.length === 0) {
    return null;
  }

  const currentMedia = media[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
    setIsVideoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
    setIsVideoPlaying(false);
  };

  const toggleVideoPlay = () => {
    const video = document.getElementById(`video-${currentIndex}`) as HTMLVideoElement;
    if (video) {
      if (isVideoPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const toggleVideoMute = () => {
    const video = document.getElementById(`video-${currentIndex}`) as HTMLVideoElement;
    if (video) {
      video.muted = !isVideoMuted;
      setIsVideoMuted(!isVideoMuted);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Media Display */}
      <div className="relative aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
        {currentMedia.type === 'image' ? (
          <img
            src={currentMedia.url}
            alt={`${celebrity} - ${title} - Image ${currentIndex + 1}`}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="relative w-full h-full">
            <video
              id={`video-${currentIndex}`}
              src={currentMedia.url}
              className="w-full h-full object-cover"
              muted={isVideoMuted}
              loop
              playsInline
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
            />
            
            {/* Video Controls */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="secondary"
                size="lg"
                className="bg-black/50 hover:bg-black/70 text-white border-none"
                onClick={toggleVideoPlay}
              >
                {isVideoPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8" />
                )}
              </Button>
            </div>

            {/* Mute Button */}
            <div className="absolute bottom-4 right-4">
              <Button
                variant="secondary"
                size="sm"
                className="bg-black/50 hover:bg-black/70 text-white border-none"
                onClick={toggleVideoMute}
              >
                {isVideoMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Navigation Arrows */}
        {media.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="sm"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border-none shadow-md"
              onClick={goToPrevious}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border-none shadow-md"
              onClick={goToNext}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {/* Media Counter */}
        {media.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/50 text-white text-sm px-2 py-1 rounded-full">
            {currentIndex + 1} / {media.length}
          </div>
        )}

        {/* Media Type Indicator */}
        <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {currentMedia.type === 'video' ? 'VIDEO' : 'PHOTO'}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {media.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {media.map((item, index) => (
            <button
              key={item.id}
              className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-primary shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => {
                setCurrentIndex(index);
                setIsVideoPlaying(false);
              }}
            >
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    muted
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
              
              {item.isPrimary && (
                <div className="absolute top-0 left-0 bg-green-500 text-white text-xs px-1 rounded-br">
                  1
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaGallery;
