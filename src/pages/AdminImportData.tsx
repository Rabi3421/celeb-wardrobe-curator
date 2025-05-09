
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminImportData: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<any>(null);

  const importMockData = async () => {
    setIsLoading(true);
    setStatus("loading");

    try {
      const { data, error } = await supabase.functions.invoke('import-mock-data');

      if (error) {
        console.error("Error importing mock data:", error);
        setStatus("error");
        setResult(error);
      } else {
        console.log("Import successful:", data);
        setStatus("success");
        setResult(data);
      }
    } catch (error) {
      console.error("Exception during import:", error);
      setStatus("error");
      setResult(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="font-serif text-2xl font-medium mb-6">Import Mock Data</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Data Import Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">
            This tool will import the sample celebrity, outfit, blog post, and product data into the Supabase database.
            Use this to quickly set up your website with demonstration content.
          </p>
          <div className="mb-4">
            <Button 
              onClick={importMockData} 
              disabled={isLoading}
              className="bg-primary"
            >
              {isLoading ? "Importing..." : "Import Mock Data"}
            </Button>
          </div>
          
          {status === "loading" && (
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Import in Progress</AlertTitle>
              <AlertDescription>
                Please wait while the data is being imported...
              </AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Import Failed</AlertTitle>
              <AlertDescription>
                There was an error importing the mock data.
                <pre className="mt-2 bg-secondary p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </AlertDescription>
            </Alert>
          )}

          {status === "success" && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Import Successful</AlertTitle>
              <AlertDescription>
                <div className="text-green-700">
                  The mock data has been successfully imported into the database.
                </div>
                {result && result.stats && (
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="bg-white p-2 rounded border border-green-200">
                      <p className="text-sm font-medium">Celebrities</p>
                      <p className="text-lg">{result.stats.celebrities}</p>
                    </div>
                    <div className="bg-white p-2 rounded border border-green-200">
                      <p className="text-sm font-medium">Outfits</p>
                      <p className="text-lg">{result.stats.outfits}</p>
                    </div>
                    <div className="bg-white p-2 rounded border border-green-200">
                      <p className="text-sm font-medium">Blog Posts</p>
                      <p className="text-lg">{result.stats.blogPosts}</p>
                    </div>
                    <div className="bg-white p-2 rounded border border-green-200">
                      <p className="text-sm font-medium">Products</p>
                      <p className="text-lg">{result.stats.affiliateProducts}</p>
                    </div>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>This tool will clear existing data before importing new mock data.</li>
            <li>You should only run this in development or when initially setting up your site.</li>
            <li>After import, you can browse to the homepage to see the imported content.</li>
            <li>The data is imported without any user session, as the function is configured to bypass authentication.</li>
          </ul>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminImportData;
