import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Database, HardDrive, Shield, Zap, Server, Users, Globe, Lock, Loader2,
} from "lucide-react";

interface Props {
  profileCount: number;
  websiteCount: number;
}

interface TableInfo {
  name: string;
  rows: number;
  hasRls: boolean;
}

const AdminCloudTab = ({ profileCount, websiteCount }: Props) => {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setTables([
        { name: "profiles", rows: profileCount, hasRls: true },
        { name: "websites", rows: websiteCount, hasRls: true },
        { name: "user_roles", rows: 0, hasRls: true },
      ]);
      setLoading(false);
    };
    load();
  }, [profileCount, websiteCount]);

  const edgeFunctions = [
    { name: "ai-assistant", description: "AI chatbot for business guidance" },
    { name: "ai-name-generator", description: "AI-powered business name generation" },
    { name: "generate-website", description: "AI website content generation" },
    { name: "delete-user", description: "Account deletion handler" },
  ];

  const securityFeatures = [
    { label: "Row Level Security", status: "Enabled", icon: Lock },
    { label: "Authentication", status: "Email + Password", icon: Shield },
    { label: "Role-based Access", status: "Admin / User", icon: Users },
    { label: "API Security", status: "Anon Key + RLS", icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Database, label: "Database Tables", value: "3", color: "text-primary" },
          { icon: Zap, label: "Edge Functions", value: String(edgeFunctions.length), color: "text-amber-500" },
          { icon: HardDrive, label: "Storage Buckets", value: "1", color: "text-blue-500" },
          { icon: Server, label: "Status", value: "Active", color: "text-green-500" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-card rounded-2xl p-5 border border-border">
            <Icon className={`h-6 w-6 ${color} mb-2`} />
            <div className="text-2xl font-display font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Database Tables */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-display font-bold flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" /> Database Tables
          </h2>
        </div>
        {loading ? (
          <div className="p-8 text-center"><Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" /></div>
        ) : (
          <div className="divide-y divide-border">
            {tables.map((t) => (
              <div key={t.name} className="p-4 flex items-center justify-between">
                <div>
                  <span className="font-mono text-sm font-medium">{t.name}</span>
                  <span className="ml-3 text-xs text-muted-foreground">{t.rows} rows</span>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${t.hasRls ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {t.hasRls ? "RLS Enabled" : "No RLS"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edge Functions */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-display font-bold flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" /> Edge Functions
          </h2>
        </div>
        <div className="divide-y divide-border">
          {edgeFunctions.map((fn) => (
            <div key={fn.name} className="p-4 flex items-center justify-between">
              <div>
                <span className="font-mono text-sm font-medium">{fn.name}</span>
                <p className="text-xs text-muted-foreground mt-0.5">{fn.description}</p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700">Deployed</span>
            </div>
          ))}
        </div>
      </div>

      {/* Storage */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-display font-bold flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-blue-500" /> Storage Buckets
          </h2>
        </div>
        <div className="p-4 flex items-center justify-between">
          <div>
            <span className="font-mono text-sm font-medium">website-images</span>
            <p className="text-xs text-muted-foreground mt-0.5">User-uploaded website images and logos</p>
          </div>
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">Public</span>
        </div>
      </div>

      {/* Security */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-display font-bold flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" /> Security Overview
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {securityFeatures.map(({ label, status, icon: Icon }) => (
            <div key={label} className="p-4 flex items-center gap-3">
              <Icon className="h-5 w-5 text-green-500 shrink-0" />
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Info */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="text-lg font-display font-bold mb-4">System Architecture</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {[
            ["Frontend", "React + TypeScript + Tailwind CSS"],
            ["Backend", "Lovable Cloud (PostgreSQL)"],
            ["Database", "PostgreSQL with Row Level Security"],
            ["AI Engine", "Google Gemini via Lovable AI"],
            ["Authentication", "Email + Password"],
            ["Edge Functions", "Deno runtime (serverless)"],
            ["Storage", "Cloud object storage"],
            ["Deployment", "Lovable Cloud"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between p-3 rounded-lg bg-muted/30">
              <span className="font-medium">{label}</span>
              <span className="text-muted-foreground text-xs">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCloudTab;
