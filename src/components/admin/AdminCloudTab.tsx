import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Database, HardDrive, Shield, Zap, Server, Users, Globe, Lock, Loader2,
  ChevronDown, ChevronRight, Table as TableIcon, Eye, RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Props {
  profileCount: number;
  websiteCount: number;
}

type TableName = "profiles" | "user_roles" | "websites";

interface TableMeta {
  name: TableName;
  label: string;
  hasRls: boolean;
}

const TABLES: TableMeta[] = [
  { name: "profiles", label: "profiles", hasRls: true },
  { name: "websites", label: "websites", hasRls: true },
  { name: "user_roles", label: "user_roles", hasRls: true },
];

const AdminCloudTab = ({ profileCount, websiteCount }: Props) => {
  const [expandedTable, setExpandedTable] = useState<TableName | null>(null);
  const [tableData, setTableData] = useState<Record<string, any[]>>({});
  const [tableCounts, setTableCounts] = useState<Record<string, number>>({});
  const [loadingTable, setLoadingTable] = useState<string | null>(null);

  useEffect(() => {
    const loadCounts = async () => {
      const [p, w, r] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("websites").select("id", { count: "exact", head: true }),
        supabase.from("user_roles").select("id", { count: "exact", head: true }),
      ]);
      setTableCounts({
        profiles: p.count ?? profileCount,
        websites: w.count ?? websiteCount,
        user_roles: r.count ?? 0,
      });
    };
    loadCounts();
  }, [profileCount, websiteCount]);

  const loadTableData = async (table: TableName) => {
    if (expandedTable === table) {
      setExpandedTable(null);
      return;
    }
    setLoadingTable(table);
    setExpandedTable(table);
    const { data } = await supabase.from(table).select("*").limit(50);
    setTableData((prev) => ({ ...prev, [table]: data || [] }));
    setLoadingTable(null);
  };

  const refreshTable = async (table: TableName) => {
    setLoadingTable(table);
    const { data } = await supabase.from(table).select("*").limit(50);
    setTableData((prev) => ({ ...prev, [table]: data || [] }));
    setLoadingTable(null);
  };

  const getColumns = (table: TableName): string[] => {
    const data = tableData[table];
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  };

  const formatCellValue = (value: any): string => {
    if (value === null || value === undefined) return "NULL";
    if (typeof value === "boolean") return value ? "true" : "false";
    if (typeof value === "object") return JSON.stringify(value).slice(0, 80);
    const str = String(value);
    return str.length > 60 ? str.slice(0, 57) + "…" : str;
  };

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { icon: Database, label: "Database Tables", value: "3", color: "text-primary" },
          { icon: Zap, label: "Edge Functions", value: String(edgeFunctions.length), color: "text-amber-500" },
          { icon: HardDrive, label: "Storage Buckets", value: "1", color: "text-blue-500" },
          { icon: Server, label: "Status", value: "Active", color: "text-green-500" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-card rounded-2xl p-4 md:p-5 border border-border">
            <Icon className={`h-5 w-5 md:h-6 md:w-6 ${color} mb-2`} />
            <div className="text-xl md:text-2xl font-display font-bold">{value}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Database Tables — Real Data Browser */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-4 md:p-5 border-b border-border">
          <h2 className="text-base md:text-lg font-display font-bold flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" /> Database Tables
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Click a table to browse its data</p>
        </div>
        <div className="divide-y divide-border">
          {TABLES.map((t) => (
            <div key={t.name}>
              {/* Table row header */}
              <button
                onClick={() => loadTableData(t.name)}
                className="w-full p-3 md:p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-2 md:gap-3 min-w-0">
                  {expandedTable === t.name ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  <TableIcon className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-mono text-xs md:text-sm font-medium truncate">{t.name}</span>
                  <span className="text-[10px] md:text-xs text-muted-foreground shrink-0">
                    {tableCounts[t.name] ?? "–"} rows
                  </span>
                </div>
                <span className={`text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                  t.hasRls ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700"
                }`}>
                  {t.hasRls ? "RLS" : "No RLS"}
                </span>
              </button>

              {/* Expanded table data */}
              {expandedTable === t.name && (
                <div className="border-t border-border bg-muted/10">
                  {loadingTable === t.name ? (
                    <div className="p-8 text-center">
                      <Loader2 className="h-5 w-5 animate-spin text-primary mx-auto" />
                    </div>
                  ) : (tableData[t.name]?.length ?? 0) === 0 ? (
                    <div className="p-6 text-center text-sm text-muted-foreground">No rows found</div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between px-3 md:px-4 py-2 border-b border-border">
                        <span className="text-[10px] md:text-xs text-muted-foreground">
                          Showing {tableData[t.name]?.length} of {tableCounts[t.name] ?? "?"} rows
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => { e.stopPropagation(); refreshTable(t.name); }}
                          className="h-7 text-xs gap-1"
                        >
                          <RefreshCw className="h-3 w-3" /> Refresh
                        </Button>
                      </div>

                      {/* Desktop: scrollable table */}
                      <div className="hidden md:block">
                        <ScrollArea className="w-full">
                          <div className="min-w-[600px]">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-muted/50">
                                  {getColumns(t.name).map((col) => (
                                    <TableHead key={col} className="text-xs font-mono whitespace-nowrap">
                                      {col}
                                    </TableHead>
                                  ))}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {tableData[t.name]?.map((row, i) => (
                                  <TableRow key={i} className="hover:bg-muted/20">
                                    {getColumns(t.name).map((col) => (
                                      <TableCell key={col} className="text-xs font-mono whitespace-nowrap max-w-[200px] truncate">
                                        <span className={row[col] === null ? "text-muted-foreground/50 italic" : ""}>
                                          {formatCellValue(row[col])}
                                        </span>
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                      </div>

                      {/* Mobile: card-based rows */}
                      <div className="md:hidden divide-y divide-border max-h-[400px] overflow-y-auto">
                        {tableData[t.name]?.map((row, i) => (
                          <div key={i} className="p-3 space-y-1.5">
                            {getColumns(t.name).slice(0, 6).map((col) => (
                              <div key={col} className="flex justify-between gap-2 text-[11px]">
                                <span className="font-mono text-muted-foreground shrink-0">{col}</span>
                                <span className={`text-right truncate max-w-[55%] ${row[col] === null ? "text-muted-foreground/50 italic" : "font-medium"}`}>
                                  {formatCellValue(row[col])}
                                </span>
                              </div>
                            ))}
                            {getColumns(t.name).length > 6 && (
                              <p className="text-[10px] text-muted-foreground text-center pt-1">
                                +{getColumns(t.name).length - 6} more columns
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Edge Functions */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-4 md:p-5 border-b border-border">
          <h2 className="text-base md:text-lg font-display font-bold flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" /> Edge Functions
          </h2>
        </div>
        <div className="divide-y divide-border">
          {edgeFunctions.map((fn) => (
            <div key={fn.name} className="p-3 md:p-4 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="font-mono text-xs md:text-sm font-medium truncate block">{fn.name}</span>
                <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 truncate">{fn.description}</p>
              </div>
              <span className="text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 shrink-0">
                Deployed
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Storage */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-4 md:p-5 border-b border-border">
          <h2 className="text-base md:text-lg font-display font-bold flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-blue-500" /> Storage Buckets
          </h2>
        </div>
        <div className="p-3 md:p-4 flex items-center justify-between">
          <div className="min-w-0">
            <span className="font-mono text-xs md:text-sm font-medium">website-images</span>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">User-uploaded website images and logos</p>
          </div>
          <span className="text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">Public</span>
        </div>
      </div>

      {/* Security */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-4 md:p-5 border-b border-border">
          <h2 className="text-base md:text-lg font-display font-bold flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" /> Security Overview
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {securityFeatures.map(({ label, status, icon: Icon }) => (
            <div key={label} className="p-3 md:p-4 flex items-center gap-3">
              <Icon className="h-4 w-4 md:h-5 md:w-5 text-green-500 shrink-0" />
              <div>
                <p className="text-xs md:text-sm font-medium">{label}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground">{status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Info */}
      <div className="bg-card rounded-2xl border border-border p-4 md:p-6">
        <h2 className="text-base md:text-lg font-display font-bold mb-4">System Architecture</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm">
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
            <div key={label} className="flex justify-between items-center p-2.5 md:p-3 rounded-lg bg-muted/30 gap-2">
              <span className="font-medium shrink-0">{label}</span>
              <span className="text-muted-foreground text-[10px] md:text-xs text-right truncate">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCloudTab;
