
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AdminSettings: React.FC = () => {
  const { user } = useAdminAuth();
  
  const [siteSettings, setSiteSettings] = useState({
    siteName: "CelebrityPersona",
    siteTagline: "Explore celebrity fashion and style",
    logo: "/path/to/logo.png",
    contactEmail: "contact@celebritypersona.com",
    featuredCelebsCount: 6,
    postsPerPage: 10,
  });
  
  const [socialMedia, setSocialMedia] = useState({
    facebook: "https://facebook.com/celebritypersona",
    twitter: "https://twitter.com/celebritypersona",
    instagram: "https://instagram.com/celebritypersona",
    pinterest: "https://pinterest.com/celebritypersona",
  });
  
  const [userProfile, setUserProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
    avatar: user?.avatar || "",
  });

  const [affiliateSettings, setAffiliateSettings] = useState({
    disclosureText: "This website contains affiliate links. When you purchase through links on our site, we may earn an affiliate commission.",
    defaultTracking: "utm_source=celebritypersona&utm_medium=affiliate&utm_campaign=outfit",
    createNewWindow: true,
    addNoFollowTag: true,
  });

  const [analytics, setAnalytics] = useState({
    googleAnalyticsId: "",
    enableTracking: true,
    anonymizeIp: true,
    trackOutboundLinks: true,
  });

  const handleSiteSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSiteSettings(prev => ({
      ...prev,
      [name]: name === "featuredCelebsCount" || name === "postsPerPage" ? parseInt(value) : value
    }));
  };

  const handleSocialMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialMedia(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAffiliateSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAffiliateSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggle = (setting: string, section: string) => {
    if (section === "affiliate") {
      setAffiliateSettings(prev => ({
        ...prev,
        [setting]: !prev[setting as keyof typeof affiliateSettings]
      }));
    } else if (section === "analytics") {
      setAnalytics(prev => ({
        ...prev,
        [setting]: !prev[setting as keyof typeof analytics]
      }));
    }
  };

  const handleSaveSettings = (section: string) => {
    // In a real app, this would send data to an API
    toast({
      title: "Settings Saved",
      description: `Your ${section} settings have been updated successfully.`,
    });
  };

  const handleProfileUpdate = () => {
    // Validate password match if changing password
    if (userProfile.password && userProfile.password !== userProfile.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password Error",
        description: "Passwords do not match.",
      });
      return;
    }

    // In a real app, this would update the user profile
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-2xl font-medium">Settings</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="affiliate">Affiliate</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage general site settings and appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={siteSettings.siteName}
                    onChange={handleSiteSettingsChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteTagline">Tagline</Label>
                  <Input
                    id="siteTagline"
                    name="siteTagline"
                    value={siteSettings.siteTagline}
                    onChange={handleSiteSettingsChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  name="logo"
                  value={siteSettings.logo}
                  onChange={handleSiteSettingsChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={siteSettings.contactEmail}
                  onChange={handleSiteSettingsChange}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="featuredCelebsCount">Featured Celebrities Count</Label>
                  <Input
                    id="featuredCelebsCount"
                    name="featuredCelebsCount"
                    type="number"
                    min="1"
                    max="20"
                    value={siteSettings.featuredCelebsCount}
                    onChange={handleSiteSettingsChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postsPerPage">Posts Per Page</Label>
                  <Input
                    id="postsPerPage"
                    name="postsPerPage"
                    type="number"
                    min="5"
                    max="50"
                    value={siteSettings.postsPerPage}
                    onChange={handleSiteSettingsChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings("general")}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Account Settings */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account details and password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center my-6">
                <div className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt={userProfile.name} />
                    <AvatarFallback>{userProfile.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <Label htmlFor="avatar" className="block mb-2">Profile Picture</Label>
                  <Input
                    id="avatar"
                    name="avatar"
                    value={userProfile.avatar}
                    placeholder="Avatar URL"
                    onChange={handleUserProfileChange}
                    className="max-w-xs mx-auto"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={userProfile.name}
                    onChange={handleUserProfileChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={userProfile.email}
                    onChange={handleUserProfileChange}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Change Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={userProfile.password}
                      onChange={handleUserProfileChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={userProfile.confirmPassword}
                      onChange={handleUserProfileChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleProfileUpdate}>Update Profile</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Affiliate Settings */}
        <TabsContent value="affiliate">
          <Card>
            <CardHeader>
              <CardTitle>Affiliate Settings</CardTitle>
              <CardDescription>
                Configure how affiliate links and content are displayed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="disclosureText">Affiliate Disclosure Text</Label>
                <textarea
                  id="disclosureText"
                  name="disclosureText"
                  className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={affiliateSettings.disclosureText}
                  onChange={handleAffiliateSettingsChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultTracking">Default Tracking Parameters</Label>
                <Input
                  id="defaultTracking"
                  name="defaultTracking"
                  value={affiliateSettings.defaultTracking}
                  onChange={handleAffiliateSettingsChange}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="createNewWindow">Open Links in New Window</Label>
                    <p className="text-sm text-muted-foreground">
                      Affiliate links will open in a new browser tab or window
                    </p>
                  </div>
                  <Switch
                    id="createNewWindow"
                    checked={affiliateSettings.createNewWindow}
                    onCheckedChange={() => handleToggle("createNewWindow", "affiliate")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="addNoFollowTag">Add "nofollow" Attribute</Label>
                    <p className="text-sm text-muted-foreground">
                      Add rel="nofollow" to all affiliate links
                    </p>
                  </div>
                  <Switch
                    id="addNoFollowTag"
                    checked={affiliateSettings.addNoFollowTag}
                    onCheckedChange={() => handleToggle("addNoFollowTag", "affiliate")}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings("affiliate")}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Social Media Settings */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>
                Connect your social media accounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  name="facebook"
                  value={socialMedia.facebook}
                  onChange={handleSocialMediaChange}
                  placeholder="https://facebook.com/yourusername"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  name="twitter"
                  value={socialMedia.twitter}
                  onChange={handleSocialMediaChange}
                  placeholder="https://twitter.com/yourusername"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  name="instagram"
                  value={socialMedia.instagram}
                  onChange={handleSocialMediaChange}
                  placeholder="https://instagram.com/yourusername"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pinterest">Pinterest</Label>
                <Input
                  id="pinterest"
                  name="pinterest"
                  value={socialMedia.pinterest}
                  onChange={handleSocialMediaChange}
                  placeholder="https://pinterest.com/yourusername"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings("social")}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Analytics Settings */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Settings</CardTitle>
              <CardDescription>
                Configure tracking and analytics preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                <Input
                  id="googleAnalyticsId"
                  name="googleAnalyticsId"
                  value={analytics.googleAnalyticsId}
                  onChange={(e) => setAnalytics({ ...analytics, googleAnalyticsId: e.target.value })}
                  placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableTracking">Enable Analytics Tracking</Label>
                    <p className="text-sm text-muted-foreground">
                      Track visitor activity on your website
                    </p>
                  </div>
                  <Switch
                    id="enableTracking"
                    checked={analytics.enableTracking}
                    onCheckedChange={() => handleToggle("enableTracking", "analytics")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="anonymizeIp">Anonymize IP Addresses</Label>
                    <p className="text-sm text-muted-foreground">
                      Make visitor IP addresses anonymous for privacy
                    </p>
                  </div>
                  <Switch
                    id="anonymizeIp"
                    checked={analytics.anonymizeIp}
                    onCheckedChange={() => handleToggle("anonymizeIp", "analytics")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="trackOutboundLinks">Track Outbound Links</Label>
                    <p className="text-sm text-muted-foreground">
                      Track when users click on links to other websites
                    </p>
                  </div>
                  <Switch
                    id="trackOutboundLinks"
                    checked={analytics.trackOutboundLinks}
                    onCheckedChange={() => handleToggle("trackOutboundLinks", "analytics")}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings("analytics")}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminSettings;
