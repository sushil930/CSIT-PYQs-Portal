import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, XMarkIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';

const AdminPanel = () => {
  const pendingUploads = [
    {
      id: 1,
      subject: "Operating Systems",
      year: "2023",
      uploader: "user123",
      uploadDate: "2023-10-25",
      department: "CSIT",
      semester: "5th"
    },
    {
      id: 2,
      subject: "Computer Networks",
      year: "2023",
      uploader: "user456",
      uploadDate: "2023-10-24",
      department: "CSIT",
      semester: "6th"
    },
    {
      id: 3,
      subject: "Machine Learning",
      year: "2023",
      uploader: "user789",
      uploadDate: "2023-10-23",
      department: "CSIT",
      semester: "7th"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage uploads and view analytics</p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Papers</CardTitle>
              <DocumentArrowUpIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Badge variant="secondary">{pendingUploads.length}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingUploads.length}</div>
              <p className="text-xs text-muted-foreground">Requires review</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">573</div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Downloads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,450</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bulk Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Bulk Upload</CardTitle>
              <CardDescription>Upload multiple papers using CSV</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">CSV File</label>
                <Input type="file" accept=".csv" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">PDF Files</label>
                <Input type="file" multiple accept=".pdf" />
              </div>
              <Button className="w-full">
                <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
                Upload Files
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Export All Papers
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Generate Reports
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Manage Users
              </Button>
              <Button variant="outline" className="w-full justify-start">
                System Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Pending Uploads */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Pending Uploads</CardTitle>
            <CardDescription>Review and approve submitted papers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingUploads.map((upload) => (
                <div key={upload.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{upload.subject}</div>
                    <div className="text-sm text-muted-foreground">
                      {upload.department} • {upload.semester} Semester • {upload.year}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Uploaded by {upload.uploader} on {upload.uploadDate}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Preview
                    </Button>
                    <Button size="sm" variant="default">
                      <CheckIcon className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive">
                      <XMarkIcon className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
