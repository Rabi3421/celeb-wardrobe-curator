
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { fetchDashboardAnalytics, DashboardAnalytics } from "@/services/analyticsApi";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { Loader2, TrendingUp, TrendingDown, Eye, MousePointer, DollarSign, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminAnalytics: React.FC = () => {
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
        setError('Failed to load analytics data');
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
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-lg">Loading analytics data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !analytics) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4 text-lg">{error || 'Failed to load analytics'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  const chartConfig = {
    views: { label: "Views", color: "#8884d8" },
    clicks: { label: "Clicks", color: "#82ca9d" },
    revenue: { label: "Revenue", color: "#ffc658" }
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#ffb347'];

  // Calculate growth percentages (mock data for now)
  const growthData = {
    outfits: 12,
    products: 8,
    revenue: 15,
    clicks: 23
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-3xl font-medium">Analytics Dashboard</h1>
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">
                {(analytics.productPerformance.reduce((sum, item) => sum + item.views, 0)).toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-blue-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{growthData.outfits}% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Total Clicks</CardTitle>
              <MousePointer className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">
                {analytics.totalClicks.toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{growthData.clicks}% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-800">
                ${analytics.totalRevenue.toFixed(2)}
              </div>
              <div className="flex items-center text-xs text-yellow-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{growthData.revenue}% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Active Users</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800">
                {analytics.totalUsers.toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-purple-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{growthData.products}% from last month
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">Top Performing Content</CardTitle>
              <CardDescription>Views and clicks by content type</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.productPerformance.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.productPerformance.slice(0, 8)}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="title" 
                        tick={{ fontSize: 11 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        interval={0}
                      />
                      <YAxis tick={{ fontSize: 11 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="views" fill="#8884d8" name="Views" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="clicks" fill="#82ca9d" name="Clicks" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <p>No performance data available yet</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Retailer Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">Retailer Performance</CardTitle>
              <CardDescription>Revenue distribution by retailer</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.retailerPerformance.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.retailerPerformance}
                        dataKey="revenue"
                        nameKey="retailer"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label={(entry) => `${entry.retailer}: $${entry.revenue.toFixed(2)}`}
                        labelLine={false}
                      >
                        {analytics.retailerPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 border rounded-lg shadow-lg">
                                <p className="font-medium">{data.retailer}</p>
                                <p className="text-sm text-green-600">Revenue: ${data.revenue.toFixed(2)}</p>
                                <p className="text-sm text-blue-600">Clicks: {data.clicks}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🏪</div>
                    <p>No retailer data available yet</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities and Blog Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">Recent Activities</CardTitle>
              <CardDescription>Latest user interactions and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {analytics.recentActivities.length > 0 ? (
                  analytics.recentActivities.slice(0, 10).map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary/30 transition-colors">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mt-1">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="text-4xl mb-2">📈</div>
                    <p>No recent activities yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Blog Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">Blog Performance</CardTitle>
              <CardDescription>Top performing blog posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {analytics.blogPerformance.length > 0 ? (
                  analytics.blogPerformance.slice(0, 8).map((post, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/30 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate mb-1">
                          {post.title}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>👁 {post.views}</span>
                          <span>⏱ {Math.floor(post.readTime / 60)}m</span>
                          <span>📤 {post.shares}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-primary">
                          #{index + 1}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="text-4xl mb-2">📝</div>
                    <p>No blog performance data available yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tables */}
        <div className="space-y-8">
          {/* Retailer Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">Detailed Retailer Analytics</CardTitle>
              <CardDescription>Complete retailer performance breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                {analytics.retailerPerformance.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left text-xs font-medium text-muted-foreground uppercase py-3 px-4">Retailer</th>
                        <th className="text-center text-xs font-medium text-muted-foreground uppercase py-3 px-4">Clicks</th>
                        <th className="text-right text-xs font-medium text-muted-foreground uppercase py-3 px-4">Revenue</th>
                        <th className="text-right text-xs font-medium text-muted-foreground uppercase py-3 px-4">Conversion Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.retailerPerformance.map((retailer, index) => (
                        <tr key={index} className="border-b border-border hover:bg-secondary/30">
                          <td className="py-3 px-4">
                            <div className="font-medium text-sm">{retailer.retailer}</div>
                          </td>
                          <td className="py-3 px-4 text-center text-sm">
                            {retailer.clicks}
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-sm text-green-600">
                            ${retailer.revenue.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-right text-sm">
                            {retailer.clicks > 0 ? ((retailer.revenue / retailer.clicks * 100)).toFixed(1) : '0'}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="text-4xl mb-2">📊</div>
                    <p>No retailer performance data available yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
