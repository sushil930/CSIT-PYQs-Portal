import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckIcon, 
  XMarkIcon, 
  DocumentArrowUpIcon, 
  UsersIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ClockIcon,
  EyeIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import useAuth from '@/hooks/useAuth';

const AdminPanel = () => {
  const { isAuthenticated, isLoading, admin, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalPapers: 0,
    pendingPapers: 0,
    readyPapers: 0,
    totalDownloads: 0
  });
  const [pendingPapers, setPendingPapers] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingPending, setLoadingPending] = useState(true);
  const [processingPaper, setProcessingPaper] = useState(null);
  const [error, setError] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Fetch admin stats
  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
      fetchPendingPapers();
    }
  }, [isAuthenticated]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
      
      const response = await fetch(`${apiBase}/api/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      } else {
        setError('Failed to load stats');
      }
    } catch (err) {
      setError('Network error loading stats');
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchPendingPapers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
      
      const response = await fetch(`${apiBase}/api/admin/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setPendingPapers(data.data);
      } else {
        setError('Failed to load pending papers');
      }
    } catch (err) {
      setError('Network error loading pending papers');
    } finally {
      setLoadingPending(false);
    }
  };

  const handlePaperAction = async (paperId, status) => {
    try {
      setProcessingPaper(paperId);
      const token = localStorage.getItem('adminToken');
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
      
      const response = await fetch(`${apiBase}/api/admin/papers/${paperId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();
      if (data.success) {
        // Remove from pending list
        setPendingPapers(prev => prev.filter(paper => paper._id !== paperId));
        // Refresh stats
        fetchStats();
      } else {
        setError(`Failed to ${status} paper`);
      }
    } catch (err) {
      setError(`Network error updating paper`);
    } finally {
      setProcessingPaper(null);
    }
  };

  const handleApprove = (paperId) => {
    handlePaperAction(paperId, 'ready');
  };

  const handleReject = (paperId) => {
    handlePaperAction(paperId, 'rejected');
  };

  const handlePreview = (paper) => {
    const query = {
      title: paper.subject,
      department: paper.department,
      year: paper.year,
      semester: paper.semester,
      file: paper.fileUrl
    };
    
    router.push({
      pathname: '/paper-viewer',
      query
    });
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {admin?.username}
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={logout}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Papers</CardTitle>
              <DocumentTextIcon className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-blue-600">
                {loadingStats ? '...' : stats.totalPapers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All papers in system
              </p>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
              <ClockIcon className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-orange-600">
                {loadingStats ? '...' : stats.pendingPapers}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Awaiting approval
              </p>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-600/10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
              <CheckIcon className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-green-600">
                {loadingStats ? '...' : stats.readyPapers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Available to users
              </p>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-purple-600/10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Downloads</CardTitle>
              <ChartBarIcon className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-purple-600">
                {loadingStats ? '...' : stats.totalDownloads.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All time downloads
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Enhanced Bulk Upload */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DocumentArrowUpIcon className="h-5 w-5" />
                Bulk Upload
              </CardTitle>
              <CardDescription>Upload multiple papers using CSV metadata</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">CSV Metadata File</label>
                <Input type="file" accept=".csv" className="cursor-pointer" />
                <p className="text-xs text-muted-foreground">
                  Include: subject, department, year, semester, filename
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">PDF Files</label>
                <Input type="file" multiple accept=".pdf" className="cursor-pointer" />
                <p className="text-xs text-muted-foreground">
                  Select multiple PDF files to upload
                </p>
              </div>
              <Button className="w-full" size="lg">
                <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
                Process Bulk Upload
              </Button>
            </CardContent>
          </Card>

          {/* Enhanced Quick Actions */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5" />
                Administrative Actions
              </CardTitle>
              <CardDescription>Common administrative tasks and reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start h-12">
                <ChartBarIcon className="h-4 w-4 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Export Analytics</div>
                  <div className="text-xs text-muted-foreground">Download usage reports</div>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start h-12">
                <DocumentTextIcon className="h-4 w-4 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Export All Papers</div>
                  <div className="text-xs text-muted-foreground">Generate complete catalog</div>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start h-12">
                <UsersIcon className="h-4 w-4 mr-3" />
                <div className="text-left">
                  <div className="font-medium">User Management</div>
                  <div className="text-xs text-muted-foreground">Manage user accounts</div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Pending Uploads */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5" />
                Pending Uploads
              </div>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {loadingPending ? '...' : pendingPapers.length}
              </Badge>
            </CardTitle>
            <CardDescription>Review and approve submitted papers for publication</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingPending ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading pending papers...</p>
              </div>
            ) : pendingPapers.length === 0 ? (
              <div className="text-center py-12">
                <DocumentTextIcon className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Pending Papers</h3>
                <p className="text-muted-foreground">All uploaded papers have been reviewed</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pendingPapers.map((paper) => (
                  <div key={paper._id} className="border rounded-xl p-6 bg-card hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{paper.fileName || 'Untitled Paper'}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {paper.department}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {paper.subject}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              {paper.year} - {paper.semester}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Uploaded on {new Date(paper.uploadDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(paper._id)}
                        disabled={processingPaper === paper._id}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {processingPaper === paper._id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                        ) : (
                          <CheckIcon className="h-4 w-4 mr-2" />
                        )}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(paper._id)}
                        disabled={processingPaper === paper._id}
                        className="border-red-200 text-red-700 hover:bg-red-50"
                      >
                        <XMarkIcon className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => window.open(`/api/papers/file/${paper._id}`, '_blank')}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <DocumentTextIcon className="h-4 w-4 mr-2" />
                        View PDF
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
