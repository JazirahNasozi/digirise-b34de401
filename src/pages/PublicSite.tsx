import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import WebsiteRenderer from "@/components/website/WebsiteRenderer";

const PublicSite = () => {
  const { id } = useParams<{ id: string }>();
  const [website, setWebsite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("websites")
      .select("name, generated_content, color_theme")
      .eq("id", id)
      .eq("status", "published")
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
        } else {
          setWebsite(data);
          // Set browser tab title to business name
          document.title = data.name || "DigiRise Website";
        }
        setLoading(false);
      });
  }, [id]);

  // Cleanup title on unmount
  useEffect(() => {
    return () => { document.title = "DigiRise"; };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold mb-2">404</h1>
          <p className="text-muted-foreground">This website is not published or doesn't exist.</p>
        </div>
      </div>
    );
  }

  const content = website?.generated_content || {};
  const userImages: string[] = Array.isArray(content.user_images) ? content.user_images : [];
  const socialLinks = content.socialLinks || {};

  return (
    <WebsiteRenderer
      content={content}
      name={website?.name || ""}
      colorTheme={website?.color_theme || "gold"}
      images={userImages}
      editable={false}
      socialLinks={socialLinks}
    />
  );
};

export default PublicSite;
