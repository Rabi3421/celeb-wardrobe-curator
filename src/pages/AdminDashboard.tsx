
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { fetchDashboardAnalytics, DashboardAnalytics } from "@/services/analyticsApi";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Loader2 } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDashboardAnalytics();
        setAnalytics(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load analytics:', err);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
    
    // Refresh data every 5 minutes
    const interval = setInterval(loadAnalytics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading dashboard analytics...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !analytics) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error || 'Failed to load analytics'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Retry
          </button>
        </div>a
      </AdminLayout>
    );
  }

  const chartConfig = {
    views: { label: "Views", color: "#8884d8" },
    clicks: { label: "Clicks", color: "#82ca9d" },
    revenue: { label: "Revenue", color: "#ffc658" }
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  return (
    <AdminLayout>
      <h1 className="font-serif text-2xl font-medium mb-6">Analytics Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-sm font-medium text-muted-foreground mb-1">Total Outfits</h2>
          <p className="text-3xl font-medium">{analytics.totalOutfits}</p>
          <div className="mt-2 text-xs text-green-600">
            Real-time data
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-sm font-medium text-muted-foreground mb-1">Total Products</h2>
          <p className="text-3xl font-medium">{analytics.totalProducts}</p>
          <div className="mt-2 text-xs text-green-600">
            Real-time data
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-sm font-medium text-muted-foreground mb-1">Total Revenue</h2>
          <p className="text-3xl font-medium">${analytics.totalRevenue.toFixed(2)}</p>
          <div className="mt-2 text-xs text-green-600">
            From affiliate clicks
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-sm font-medium text-muted-foreground mb-1">Total Clicks</h2>
          <p className="text-3xl font-medium">{analytics.totalClicks}</p>
          <div className="mt-2 text-xs text-green-600">
            User interactions
          </div>
        </div>
      </div>

      {/* User Engagement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-sm font-medium text-muted-foreground mb-1">Active Users</h2>
          <p className="text-3xl font-medium">{analytics.totalUsers}</p>
          <div className="mt-2 text-xs text-muted-foreground">
            Unique users with sessions
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-sm font-medium text-muted-foreground mb-1">Total Sessions</h2>
          <p className="text-3xl font-medium">{analytics.totalSessions}</p>
          <div className="mt-2 text-xs text-muted-foreground">
            User browsing sessions
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Products Performance */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="font-serif text-lg font-medium mb-4">Top Products Performance</h2>
          {analytics.productPerformance.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.productPerformance.slice(0, 5)}>
                  <XAxis 
                    dataKey="title" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="views" fill="#8884d8" name="Views" />
                  <Bar dataKey="clicks" fill="#82ca9d" name="Clicks" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No product performance data available yet
            </div>
          )}
        </div>

        {/* Retailer Performance */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="font-serif text-lg font-medium mb-4">Retailer Performance</h2>
          {analytics.retailerPerformance.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.retailerPerformance}
                    dataKey="clicks"
                    nameKey="retailer"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `${entry.retailer}: ${entry.clicks}`}
                  >
                    {analytics.retailerPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No retailer performance data available yet
            </div>
          )}
        </div>
      </div>

      {/* Recent Activities and Blog Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="font-serif text-lg font-medium mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {analytics.recentActivities.length > 0 ? (
              analytics.recentActivities.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className="w-10 h-10 bg-pastel-blue rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary-foreground"
                    >
                      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No recent activities yet
              </div>
            )}
          </div>
        </div>

        {/* Blog Performance */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="font-serif text-lg font-medium mb-4">Blog Performance</h2>
          <div className="overflow-x-auto">
            {analytics.blogPerformance.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase py-3 px-4">Post</th>
                    <th className="text-center text-xs font-medium text-muted-foreground uppercase py-3 px-4">Views</th>
                    <th className="text-center text-xs font-medium text-muted-foreground uppercase py-3 px-4">Avg Read Time</th>
                    <th className="text-right text-xs font-medium text-muted-foreground uppercase py-3 px-4">Shares</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.blogPerformance.slice(0, 5).map((post, index) => (
                    <tr key={index} className="border-b border-border">
                      <td className="py-3 px-4">
                        <p className="font-medium text-sm truncate max-w-[200px]">
                          {post.title}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-center text-sm">
                        {post.views}
                      </td>
                      <td className="py-3 px-4 text-center text-sm">
                        {Math.floor(post.readTime / 60)}m {post.readTime % 60}s
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-sm">
                        {post.shares}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No blog performance data available yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Retailer Performance Table */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="font-serif text-lg font-medium mb-4">Detailed Retailer Performance</h2>
        <div className="overflow-x-auto">
          {analytics.retailerPerformance.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase py-3 px-4">Retailer</th>
                  <th className="text-center text-xs font-medium text-muted-foreground uppercase py-3 px-4">Clicks</th>
                  <th className="text-right text-xs font-medium text-muted-foreground uppercase py-3 px-4">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {analytics.retailerPerformance.map((retailer, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="py-3 px-4">
                      <div className="font-medium text-sm">{retailer.retailer}</div>
                    </td>
                    <td className="py-3 px-4 text-center text-sm">
                      {retailer.clicks}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-sm">
                      ${retailer.revenue.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No retailer performance data available yet
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
