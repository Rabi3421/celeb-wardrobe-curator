import React, { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, X, Play, Image as ImageIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { storage } from "@/components/ui/firebase";
import { getAuth, signInAnonymously } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface MediaFile {
  id?: string;
  file?: File;
  url: string;
  type: 'image' | 'video';
  displayOrder: number;
  isPrimary: boolean;
}

interface MediaUploaderProps {
  outfitId?: string;
  existingMedia?: MediaFile[];
  onMediaChange: (media: MediaFile[]) => void;
}

const MediaUploader = forwardRef<{
  uploadAllMedia: () => Promise<MediaFile[]>;
}, MediaUploaderProps>(function MediaUploader(
  { outfitId, existingMedia = [], onMediaChange },
  ref
) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(existingMedia);
  const [isUploading, setIsUploading] = useState(false);

  useImperativeHandle(ref, () => ({
    uploadAllMedia
  }));

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const newMediaFiles: MediaFile[] = [];

    for (const file of files) {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      if (!isVideo && !isImage) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a valid image or video file`,
          variant: "destructive",
        });
        continue;
      }

      const url = URL.createObjectURL(file);
      newMediaFiles.push({
        file,
        url,
        type: isVideo ? 'video' : 'image',
        displayOrder: mediaFiles.length + newMediaFiles.length,
        isPrimary: mediaFiles.length === 0 && newMediaFiles.length === 0
      });
    }

    const updatedMedia = [...mediaFiles, ...newMediaFiles];
    setMediaFiles(updatedMedia);
    onMediaChange(updatedMedia);
  }, [mediaFiles, onMediaChange]);

  const removeMedia = useCallback((index: number) => {
    const updatedMedia = mediaFiles.filter((_, i) => i !== index);
    // Update display order and ensure we have a primary image
    const reorderedMedia = updatedMedia.map((media, i) => ({
      ...media,
      displayOrder: i,
      isPrimary: i === 0 && media.type === 'image'
    }));

    setMediaFiles(reorderedMedia);
    onMediaChange(reorderedMedia);
  }, [mediaFiles, onMediaChange]);

  const setPrimary = useCallback((index: number) => {
    const updatedMedia = mediaFiles.map((media, i) => ({
      ...media,
      isPrimary: i === index && media.type === 'image'
    }));

    setMediaFiles(updatedMedia);
    onMediaChange(updatedMedia);
  }, [mediaFiles, onMediaChange]);

  const moveMedia = useCallback((fromIndex: number, toIndex: number) => {
    const updatedMedia = [...mediaFiles];
    const [movedItem] = updatedMedia.splice(fromIndex, 1);
    updatedMedia.splice(toIndex, 0, movedItem);

    // Update display order
    const reorderedMedia = updatedMedia.map((media, i) => ({
      ...media,
      displayOrder: i
    }));

    setMediaFiles(reorderedMedia);
    onMediaChange(reorderedMedia);
  }, [mediaFiles, onMediaChange]);

  const uploadMediaToStorage = async (mediaFile: MediaFile): Promise<string | null> => {
    if (!mediaFile.file) return mediaFile.url;

    try {
      const auth = getAuth();
      if (!auth.currentUser) {
        await signInAnonymously(auth);
      }
      const ext = mediaFile.file.name.split('.').pop();
      const seoName = mediaFile.file.name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '');
      const fileName = `${seoName}-${Date.now()}.${ext}`;
      const fileRef = ref(storage, `outfits/${fileName}`);
      await uploadBytes(fileRef, mediaFile.file);
      const uploadedUrl = await getDownloadURL(fileRef);

      toast({
        title: "Upload successful",
        description: `File ${mediaFile.file.name} uploaded.`,
      });

      return uploadedUrl;
    } catch (error) {
      console.error('Error uploading media:', error);
      toast({
        title: "Upload failed",
        description: `Failed to upload ${mediaFile.file?.name}`,
        variant: "destructive",
      });
      return null;
    }
  };

  const uploadAllMedia = async (): Promise<MediaFile[]> => {
    setIsUploading(true);
    const uploadedMedia: MediaFile[] = [];

    for (const media of mediaFiles) {
      const uploadedUrl = await uploadMediaToStorage(media);
      if (uploadedUrl) {
        uploadedMedia.push({
          ...media,
          url: uploadedUrl,
          file: undefined // Remove file reference after upload
        });
      }
    }

    setIsUploading(false);
    return uploadedMedia;
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="media-upload" className="text-base font-medium">
          Upload Images & Videos
        </Label>
        <p className="text-sm text-muted-foreground mb-2">
          Select multiple images and videos. The first image will be set as primary.
        </p>
        <Input
          id="media-upload"
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="cursor-pointer"
        />
      </div>

      {mediaFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Selected Media ({mediaFiles.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mediaFiles.map((media, index) => (
              <div key={index} className="relative group border rounded-lg overflow-hidden">
                <div className="aspect-square bg-gray-100 relative">
                  {media.type === 'image' ? (
                    <img
                      src={media.url}
                      alt={`Media ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <video
                        src={media.url}
                        className="w-full h-full object-cover"
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  )}

                  {media.isPrimary && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      Primary
                    </div>
                  )}

                  <div className="absolute top-2 right-2 flex gap-1">
                    {media.type === 'image' && !media.isPrimary && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setPrimary(index)}
                        title="Set as primary"
                      >
                        <ImageIcon className="w-3 h-3" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeMedia(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="p-2 text-center">
                  <p className="text-xs text-muted-foreground">
                    {media.type === 'video' ? 'Video' : 'Image'} #{index + 1}
                  </p>
                  <div className="flex gap-1 mt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 text-xs flex-1"
                      onClick={() => moveMedia(index, Math.max(0, index - 1))}
                      disabled={index === 0}
                    >
                      ←
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 text-xs flex-1"
                      onClick={() => moveMedia(index, Math.min(mediaFiles.length - 1, index + 1))}
                      disabled={index === mediaFiles.length - 1}
                    >
                      →
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          Processing media files...
        </div>
      )}
    </div>
  );
});

export default MediaUploader;