import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import { TrendingUp, Eye, Users, Globe } from "lucide-react";

interface Props {
  profiles: { created_at: string; payment_confirmed: boolean }[];
  websites: { created_at: string; status: string; user_id: string }[];
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--muted-foreground))", "#22c55e", "#3b82f6"];

const AdminAnalyticsTab = ({ profiles, websites }: Props) => {
  const signupsByMonth = useMemo(() => {
    const map: Record<string, number> = {};
    profiles.forEach((p) => {
      const d = new Date(p.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count }));
  }, [profiles]);

  const websitesByMonth = useMemo(() => {
    const map: Record<string, number> = {};
    websites.forEach((w) => {
      const d = new Date(w.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count }));
  }, [websites]);

  const statusDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    websites.forEach((w) => {
      map[w.status] = (map[w.status] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [websites]);

  const paymentDistribution = useMemo(() => [
    { name: "Confirmed", value: profiles.filter((p) => p.payment_confirmed).length },
    { name: "Pending", value: profiles.filter((p) => !p.payment_confirmed).length },
  ], [profiles]);

  const avgSitesPerUser = useMemo(() => {
    if (profiles.length === 0) return 0;
    return (websites.length / profiles.length).toFixed(1);
  }, [profiles, websites]);

  const platformStats = [
    { icon: Users, label: "Total Users", value: profiles.length, color: "text-primary" },
    { icon: Globe, label: "Total Websites", value: websites.length, color: "text-blue-500" },
    { icon: TrendingUp, label: "Avg Sites/User", value: avgSitesPerUser, color: "text-green-500" },
    { icon: Eye, label: "Published Rate", value: `${websites.length ? Math.round((websites.filter(w => w.status === "published").length / websites.length) * 100) : 0}%`, color: "text-amber-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {platformStats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-card rounded-2xl p-5 border border-border">
            <Icon className={`h-6 w-6 ${color} mb-2`} />
            <div className="text-2xl font-display font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Signups Chart */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="text-sm font-semibold mb-4">User Signups Over Time</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={signupsByMonth}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Website Creation Chart */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="text-sm font-semibold mb-4">Websites Created Over Time</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={websitesByMonth}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Website Status Pie */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="text-sm font-semibold mb-4">Website Status Distribution</h3>
          <div className="h-52 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                  {statusDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Status Pie */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="text-sm font-semibold mb-4">Payment Status</h3>
          <div className="h-52 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={paymentDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                  <Cell fill="#22c55e" />
                  <Cell fill="hsl(var(--muted-foreground))" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Traffic Info */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-sm font-semibold mb-4">Platform Traffic (Last 30 Days)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {[
            ["Visitors", "2"],
            ["Page Views", "3"],
            ["Pages/Visit", "1.5"],
            ["Bounce Rate", "50%"],
          ].map(([label, value]) => (
            <div key={label} className="p-3 rounded-lg bg-muted/30 text-center">
              <div className="text-lg font-bold">{value}</div>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
          {[
            ["Top Pages", "/ (2), /register (1)"],
            ["Top Source", "Direct (2)"],
            ["Top Device", "Desktop (2)"],
            ["Top Country", "Kenya (2)"],
          ].map(([label, value]) => (
            <div key={label} className="p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p className="font-medium text-xs">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsTab;
