
-- Allow anyone (even unauthenticated) to view published websites for the public site page
CREATE POLICY "Anyone can view published websites"
ON public.websites FOR SELECT TO anon
USING (status = 'published');
