import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { businessName, businessType, description, colorTheme, logoStyle, contactInfo, socialLinks } = await req.json();

    if (!businessName || !businessType || !description) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `You are a professional website content generator. Generate website content for a ${businessType} business called "${businessName}".

Business description: ${description}
Color theme: ${colorTheme}
Logo style: ${logoStyle}
Contact: Phone: ${contactInfo?.phone || "N/A"}, Email: ${contactInfo?.email || "N/A"}, Address: ${contactInfo?.address || "N/A"}

Generate a complete, multi-page website structure with real, professional content. Return a JSON object with this exact structure:
{
  "hero": {
    "heading": "A compelling main headline featuring the business name",
    "subheading": "A professional tagline/subheading",
    "cta": "Call to action button text"
  },
  "about": {
    "heading": "About section title",
    "text": "2-3 paragraphs about the business, its history, mission, and values"
  },
  "stats": [
    { "value": "500+", "label": "Happy Clients" },
    { "value": "10+", "label": "Years Experience" },
    { "value": "50+", "label": "Projects Completed" },
    { "value": "24/7", "label": "Support Available" }
  ],
  "whyChooseUs": {
    "heading": "Why Choose [Business Name]?",
    "items": [
      { "title": "Advantage title", "description": "Why this matters", "icon": "award" },
      { "title": "Advantage title", "description": "Why this matters", "icon": "shield" },
      { "title": "Advantage title", "description": "Why this matters", "icon": "zap" },
      { "title": "Advantage title", "description": "Why this matters", "icon": "heart" }
    ]
  },
  "services": {
    "heading": "Services section title",
    "items": [
      { "title": "Service 1", "description": "Detailed description" },
      { "title": "Service 2", "description": "Detailed description" },
      { "title": "Service 3", "description": "Detailed description" },
      { "title": "Service 4", "description": "Detailed description" }
    ]
  },
  "contact": {
    "heading": "Contact section title",
    "phone": "${contactInfo?.phone || ""}",
    "email": "${contactInfo?.email || ""}",
    "address": "${contactInfo?.address || ""}"
  },
  "testimonials": [
    { "name": "Customer Name", "text": "Realistic testimonial text", "role": "Customer role" },
    { "name": "Customer Name", "text": "Realistic testimonial text", "role": "Customer role" },
    { "name": "Customer Name", "text": "Realistic testimonial text", "role": "Customer role" }
  ],
  "faq": {
    "heading": "Frequently Asked Questions",
    "items": [
      { "question": "A common question", "answer": "A helpful detailed answer" },
      { "question": "A common question", "answer": "A helpful detailed answer" },
      { "question": "A common question", "answer": "A helpful detailed answer" },
      { "question": "A common question", "answer": "A helpful detailed answer" }
    ]
  },
  "blog": {
    "heading": "Latest News & Updates",
    "posts": [
      { "title": "Blog post title", "excerpt": "Short preview of the blog post content", "date": "2025-03-15" },
      { "title": "Blog post title", "excerpt": "Short preview of the blog post content", "date": "2025-02-20" },
      { "title": "Blog post title", "excerpt": "Short preview of the blog post content", "date": "2025-01-10" }
    ]
  },
  "seo": {
    "title": "Page title for SEO including business name",
    "description": "Meta description for SEO"
  }
}

For "stats", generate 4 realistic statistics relevant to a ${businessType} business. Use numbers that sound believable.
For "whyChooseUs", generate 4 compelling advantages. Use icon values from: award, shield, zap, heart, clock, users, star, trending.

Make ALL content professional, engaging, and specific to a ${businessType} business called "${businessName}". Use real-sounding content, not placeholder text. The hero heading MUST include the business name "${businessName}".`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a website content generator. Always respond with valid JSON only, no markdown formatting." },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_website_content",
              description: "Generate structured website content with all sections",
              parameters: {
                type: "object",
                properties: {
                  hero: {
                    type: "object",
                    properties: {
                      heading: { type: "string" },
                      subheading: { type: "string" },
                      cta: { type: "string" },
                    },
                    required: ["heading", "subheading"],
                  },
                  stats: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: { value: { type: "string" }, label: { type: "string" } },
                      required: ["value", "label"],
                    },
                  },
                  whyChooseUs: {
                    type: "object",
                    properties: {
                      heading: { type: "string" },
                      items: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: { title: { type: "string" }, description: { type: "string" }, icon: { type: "string" } },
                          required: ["title", "description"],
                        },
                      },
                    },
                    required: ["heading", "items"],
                  },
                  about: {
                    type: "object",
                    properties: { heading: { type: "string" }, text: { type: "string" } },
                    required: ["heading", "text"],
                  },
                  services: {
                    type: "object",
                    properties: {
                      heading: { type: "string" },
                      items: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: { title: { type: "string" }, description: { type: "string" } },
                          required: ["title", "description"],
                        },
                      },
                    },
                    required: ["heading", "items"],
                  },
                  contact: {
                    type: "object",
                    properties: { heading: { type: "string" }, phone: { type: "string" }, email: { type: "string" }, address: { type: "string" } },
                    required: ["heading"],
                  },
                  testimonials: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: { name: { type: "string" }, text: { type: "string" }, role: { type: "string" } },
                      required: ["name", "text", "role"],
                    },
                  },
                  faq: {
                    type: "object",
                    properties: {
                      heading: { type: "string" },
                      items: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: { question: { type: "string" }, answer: { type: "string" } },
                          required: ["question", "answer"],
                        },
                      },
                    },
                    required: ["heading", "items"],
                  },
                  blog: {
                    type: "object",
                    properties: {
                      heading: { type: "string" },
                      posts: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: { title: { type: "string" }, excerpt: { type: "string" }, date: { type: "string" } },
                          required: ["title", "excerpt", "date"],
                        },
                      },
                    },
                    required: ["heading", "posts"],
                  },
                  seo: {
                    type: "object",
                    properties: { title: { type: "string" }, description: { type: "string" } },
                    required: ["title", "description"],
                  },
                },
                required: ["hero", "about", "services", "contact", "seo", "faq", "blog", "stats", "whyChooseUs"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_website_content" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI error:", response.status, text);
      throw new Error("AI generation failed");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    let content;
    if (toolCall?.function?.arguments) {
      content = typeof toolCall.function.arguments === "string"
        ? JSON.parse(toolCall.function.arguments)
        : toolCall.function.arguments;
    } else {
      const raw = data.choices?.[0]?.message?.content || "";
      const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      content = JSON.parse(cleaned);
    }

    return new Response(JSON.stringify(content), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-website error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
