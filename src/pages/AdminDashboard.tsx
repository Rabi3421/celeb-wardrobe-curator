
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { outfits, affiliateProducts, blogPosts, analyticsData } from "@/data/mockData";

const AdminDashboard: React.FC = () => {
  const totalOutfits = outfits.length;
  const totalProducts = affiliateProducts.length;
  const totalRevenue = analyticsData.topPosts.reduce((sum, post) => sum + post.revenue, 0);
  const totalClicks = analyticsData.topPosts.reduce((sum, post) => sum + post.clicks, 0);

  return (
    <AdminLayout>
      <h1 className="font-serif text-2xl font-medium mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-sm font-medium text-muted-foreground mb-1">Total Outfits</h2>
          <p className="text-3xl font-medium">{totalOutfits}</p>
          <div className="mt-2 text-xs text-green-600">
            +3 this week
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-sm font-medium text-muted-foreground mb-1">Total Products</h2>
          <p className="text-3xl font-medium">{totalProducts}</p>
          <div className="mt-2 text-xs text-green-600">
            +12 this week
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-sm font-medium text-muted-foreground mb-1">Affiliate Revenue</h2>
          <p className="text-3xl font-medium">${totalRevenue.toFixed(2)}</p>
          <div className="mt-2 text-xs text-green-600">
            +$125.40 this week
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-sm font-medium text-muted-foreground mb-1">Affiliate Clicks</h2>
          <p className="text-3xl font-medium">{totalClicks}</p>
          <div className="mt-2 text-xs text-green-600">
            +45 this week
          </div>
        </div>
      </div>

      {/* Recent Activities and Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="font-serif text-lg font-medium mb-4">Recent Activities</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
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
                <p className="font-medium text-sm">New affiliate revenue: $45.20</p>
                <p className="text-xs text-muted-foreground">Today at 10:30 AM</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
              <div className="w-10 h-10 bg-pastel-pink rounded-full flex items-center justify-center">
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
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm">New outfit published: "Met Gala 2023 Red Carpet Look"</p>
                <p className="text-xs text-muted-foreground">Yesterday at 5:45 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
              <div className="w-10 h-10 bg-pastel-lavender rounded-full flex items-center justify-center">
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
                  <path d="M14 19a6 6 0 0 0-12 0" />
                  <circle cx="8" cy="9" r="4" />
                  <path d="M22 19a6 6 0 0 0-6-6 4 4 0 1 0 0-8" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm">New celebrity added: "Timothée Chalamet"</p>
                <p className="text-xs text-muted-foreground">May 5, 2023</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
              <div className="w-10 h-10 bg-pastel-peach rounded-full flex items-center justify-center">
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
                  <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                  <line x1="16" x2="2" y1="8" y2="22" />
                  <line x1="17.5" x2="9" y1="15" y2="15" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm">New blog post published: "Spring Fashion Trends From Celebrity Closets"</p>
                <p className="text-xs text-muted-foreground">May 4, 2023</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="font-serif text-lg font-medium mb-4">Top Performing Posts</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase py-3 px-4">Post</th>
                  <th className="text-center text-xs font-medium text-muted-foreground uppercase py-3 px-4">Views</th>
                  <th className="text-center text-xs font-medium text-muted-foreground uppercase py-3 px-4">Clicks</th>
                  <th className="text-right text-xs font-medium text-muted-foreground uppercase py-3 px-4">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.topPosts.map((post, index) => (
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
                      {post.clicks}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-sm">
                      ${post.revenue.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
        <h2 className="font-serif text-lg font-medium mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <button className="p-4 rounded-xl border border-border hover:border-primary-foreground transition-colors flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 bg-pastel-pink rounded-full flex items-center justify-center">
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
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" x2="12" y1="18" y2="12" />
                <line x1="9" x2="15" y1="15" y2="15" />
              </svg>
            </div>
            <span className="text-sm font-medium">New Outfit</span>
          </button>
          <button className="p-4 rounded-xl border border-border hover:border-primary-foreground transition-colors flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 bg-pastel-lavender rounded-full flex items-center justify-center">
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
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span className="text-sm font-medium">New Celebrity</span>
          </button>
          <button className="p-4 rounded-xl border border-border hover:border-primary-foreground transition-colors flex flex-col items-center justify-center gap-2">
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
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
            <span className="text-sm font-medium">New Blog Post</span>
          </button>
          <button className="p-4 rounded-xl border border-border hover:border-primary-foreground transition-colors flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 bg-pastel-peach rounded-full flex items-center justify-center">
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
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <span className="text-sm font-medium">View Analytics</span>
          </button>
          <button className="p-4 rounded-xl border border-border hover:border-primary-foreground transition-colors flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
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
                className="text-muted-foreground"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <span className="text-sm font-medium">Settings</span>
          </button>
        </div>
      </div>

      {/* Retailer Performance */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="font-serif text-lg font-medium mb-4">Retailer Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase py-3 px-4">Retailer</th>
                <th className="text-center text-xs font-medium text-muted-foreground uppercase py-3 px-4">Clicks</th>
                <th className="text-right text-xs font-medium text-muted-foreground uppercase py-3 px-4">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.retailerPerformance.map((retailer, index) => (
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
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
