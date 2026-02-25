import { useCallback, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ImagePlus, Loader2, Trash2, X } from "lucide-react";

interface WebsiteImageManagerProps {
  websiteId: string;
  images: string[];
  onImagesChange: (images: string[]) => void;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const WebsiteImageManager = ({ websiteId, images, onImagesChange }: WebsiteImageManagerProps) => {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({ title: "Please log in first", variant: "destructive" });
        return;
      }

      setUploading(true);
      const newUrls: string[] = [];

      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        if (file.size > 5 * 1024 * 1024) {
          toast({ title: `${file.name} is too large (max 5MB)`, variant: "destructive" });
          continue;
        }

        const ext = file.name.split(".").pop() || "jpg";
        const path = `${session.user.id}/${websiteId}/${crypto.randomUUID()}.${ext}`;

        const { error } = await supabase.storage.from("website-images").upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });

        if (error) {
          toast({ title: `Upload failed: ${file.name}`, description: error.message, variant: "destructive" });
        } else {
          const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/website-images/${path}`;
          newUrls.push(publicUrl);
        }
      }

      if (newUrls.length > 0) {
        const updated = [...images, ...newUrls];
        onImagesChange(updated);
        toast({ title: `${newUrls.length} image(s) uploaded!` });
      }

      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    },
    [images, onImagesChange, websiteId, toast]
  );

  const handleRemove = useCallback(
    (index: number) => {
      const updated = images.filter((_, i) => i !== index);
      onImagesChange(updated);
    },
    [images, onImagesChange]
  );

  return (
    <section className="mb-6 p-4 rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Website Photos</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4 mr-2" />
          )}
          {uploading ? "Uploading..." : "Add Photos"}
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {images.length === 0 && (
        <p className="text-xs text-muted-foreground">
          No photos yet. Add photos to make your website more appealing.
        </p>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((url, i) => (
            <div key={url + i} className="relative group rounded-lg overflow-hidden border border-border">
              <img
                src={url}
                alt={`Website photo ${i + 1}`}
                className="w-full h-28 object-cover"
                loading="lazy"
              />
              <button
                onClick={() => handleRemove(i)}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove photo"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default WebsiteImageManager;
