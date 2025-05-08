
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { analyticsData } from "@/data/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F"];

const AdminAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState("30days");
  const [chartView, setChartView] = useState("revenue");
  
  // Calculate summary metrics
  const totalRevenue = analyticsData.monthlyStats.reduce((sum, month) => sum + month.revenue, 0);
  const totalViews = analyticsData.monthlyStats.reduce((sum, month) => sum + month.views, 0);
  const totalClicks = analyticsData.monthlyStats.reduce((sum, month) => sum + month.clicks, 0);
  const conversionRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : 0;

  // Prepare retailer data for pie chart
  const retailerData = analyticsData.retailerPerformance.map((retailer) => ({
    name: retailer.retailer,
    value: retailer.revenue,
  }));

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-2xl font-medium">Analytics Dashboard</h1>
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            Export Data
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-3xl">${totalRevenue.toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">↑ 12.5%</span> from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Page Views</CardDescription>
            <CardTitle className="text-3xl">{totalViews.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">↑ 8.2%</span> from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Affiliate Clicks</CardDescription>
            <CardTitle className="text-3xl">{totalClicks.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">↑ 19.4%</span> from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Conversion Rate</CardDescription>
            <CardTitle className="text-3xl">{conversionRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">↑ 3.1%</span> from previous period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
            <CardDescription>
              Track your views, clicks, and revenue over time
            </CardDescription>
            <Tabs value={chartView} onValueChange={setChartView} className="mt-2">
              <TabsList className="grid grid-cols-3 w-[300px]">
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="views">Views</TabsTrigger>
                <TabsTrigger value="clicks">Clicks</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analyticsData.monthlyStats}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {chartView === "revenue" && (
                    <Bar dataKey="revenue" fill="#8884d8" name="Revenue ($)" />
                  )}
                  {chartView === "views" && (
                    <Bar dataKey="views" fill="#82ca9d" name="Page Views" />
                  )}
                  {chartView === "clicks" && (
                    <Bar dataKey="clicks" fill="#ffc658" name="Clicks" />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Retailer</CardTitle>
            <CardDescription>
              See which retailers are generating the most revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={retailerData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {retailerData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Content */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Top Performing Content</CardTitle>
          <CardDescription>
            Posts and outfits with the highest engagement and revenue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Post Title</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">CTR</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analyticsData.topPosts.map((post, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell className="text-right">{post.views.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{post.clicks.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    {((post.clicks / post.views) * 100).toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right font-medium">${post.revenue.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Retailer Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Retailer Performance</CardTitle>
          <CardDescription>
            Track the performance of different affiliate retailers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Retailer</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Avg. Revenue Per Click</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analyticsData.retailerPerformance.map((retailer, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{retailer.retailer}</TableCell>
                  <TableCell className="text-right">{retailer.clicks.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${retailer.revenue.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    ${(retailer.revenue / retailer.clicks).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminAnalytics;
