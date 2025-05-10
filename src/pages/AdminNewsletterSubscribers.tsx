
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, Loader2, Download, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
  subscribed: boolean;
  source: string | null;
}

const AdminNewsletterSubscribers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Fetch all newsletter subscribers
  const {
    data: subscribers = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["newsletterSubscribers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching newsletter subscribers:", error);
        throw error;
      }

      return data as Subscriber[];
    },
  });

  // Filter subscribers based on search term
  const filteredSubscribers = subscribers.filter((subscriber) =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Export subscribers to CSV
  const exportToCSV = () => {
    try {
      // Format data as CSV
      const headers = ["Email", "Subscribed Date", "Source", "Subscribed Status"];
      const csvContent = [
        headers.join(","),
        ...filteredSubscribers.map(subscriber => [
          subscriber.email,
          format(new Date(subscriber.created_at), "yyyy-MM-dd"),
          subscriber.source || "N/A",
          subscriber.subscribed ? "Active" : "Unsubscribed"
        ].join(","))
      ].join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `newsletter-subscribers-${format(new Date(), "yyyy-MM-dd")}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: `Successfully exported ${filteredSubscribers.length} subscribers.`,
      });
    } catch (error) {
      console.error("Error exporting subscribers:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export subscribers. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Delete a subscriber
  const deleteSubscriber = async (id: string) => {
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      refetch();
      toast({
        title: "Subscriber Removed",
        description: "Subscriber has been successfully removed.",
      });
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      toast({
        title: "Deletion Failed",
        description: "Failed to remove subscriber. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-2xl font-medium">Newsletter Subscribers</h1>
        <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2">
          <Download size={16} />
          Export CSV
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search subscribers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
          <div className="ml-4">
            <span className="text-sm text-muted-foreground">
              Total Subscribers: {subscribers.length}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Date Subscribed</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-32">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredSubscribers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-32">
                    No subscribers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell className="font-medium">{subscriber.email}</TableCell>
                    <TableCell>{formatDate(subscriber.created_at)}</TableCell>
                    <TableCell>
                      <span className="capitalize">
                        {subscriber.source || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        subscriber.subscribed
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {subscriber.subscribed ? "Active" : "Unsubscribed"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            className="text-red-500 cursor-pointer"
                            onClick={() => deleteSubscriber(subscriber.id)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Remove</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNewsletterSubscribers;
