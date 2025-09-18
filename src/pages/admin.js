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
  ArrowRightOnRectangleIcon,
  TrashIcon,
  PencilIcon
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
  const [allPapers, setAllPapers] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingPending, setLoadingPending] = useState(true);
  const [loadingAllPapers, setLoadingAllPapers] = useState(true);
  const [processingPaper, setProcessingPaper] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingPaper, setEditingPaper] = useState(null);
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
      fetchAllPapers();
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

  const fetchAllPapers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
      
      const response = await fetch(`${apiBase}/api/admin/papers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setAllPapers(data.data);
      } else {
        setError('Failed to load papers');
      }
    } catch (err) {
      setError('Network error loading papers');
    } finally {
      setLoadingAllPapers(false);
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

  const handleDelete = async (paperId) => {
    try {
      setProcessingPaper(paperId);
      const token = localStorage.getItem('adminToken');
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
      
      const response = await fetch(`${apiBase}/api/admin/papers/${paperId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        // Remove from both lists
        setPendingPapers(prev => prev.filter(paper => paper._id !== paperId));
        setAllPapers(prev => prev.filter(paper => paper._id !== paperId));
        // Refresh stats
        fetchStats();
        setDeleteConfirm(null);
      } else {
        setError('Failed to delete paper');
      }
    } catch (err) {
      setError('Network error deleting paper');
    } finally {
      setProcessingPaper(null);
    }
  };

  const handleEditPaper = async (paperId, editedData) => {
    try {
      setProcessingPaper(paperId);
      const token = localStorage.getItem('adminToken');
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
      
      const response = await fetch(`${apiBase}/api/admin/papers/${paperId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedData)
      });

      const data = await response.json();
      if (data.success) {
        // Update in both lists
        setPendingPapers(prev => prev.map(paper => 
          paper._id === paperId ? data.data : paper
        ));
        setAllPapers(prev => prev.map(paper => 
          paper._id === paperId ? data.data : paper
        ));
        setEditingPaper(null);
        fetchStats();
      } else {
        setError('Failed to update paper');
      }
    } catch (err) {
      setError('Network error updating paper');
    } finally {
      setProcessingPaper(null);
    }
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

        {/* All Papers Management */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DocumentTextIcon className="h-5 w-5" />
                All Papers Management
              </div>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {loadingAllPapers ? '...' : allPapers.length}
              </Badge>
            </CardTitle>
            <CardDescription>View, edit, and manage all papers in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingAllPapers ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading all papers...</p>
              </div>
            ) : allPapers.length === 0 ? (
              <div className="text-center py-12">
                <DocumentTextIcon className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Papers Found</h3>
                <p className="text-muted-foreground">No papers have been uploaded to the system</p>
              </div>
            ) : (
              <div className="space-y-6">
                {allPapers.map((paper) => (
                  <div key={paper._id} className="border rounded-xl p-6 bg-card hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{paper.fileName || 'Untitled Paper'}</h3>
                          <Badge 
                            variant={paper.status === 'ready' ? 'default' : paper.status === 'pending' ? 'secondary' : 'destructive'}
                            className={
                              paper.status === 'ready' ? 'bg-green-100 text-green-800 border-green-200' :
                              paper.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                              'bg-red-100 text-red-800 border-red-200'
                            }
                          >
                            {paper.status.charAt(0).toUpperCase() + paper.status.slice(1)}
                          </Badge>
                        </div>
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
                          Uploaded on {new Date(paper.uploadDate || paper.createdAt).toLocaleDateString('en-US', {
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
                        variant="outline"
                        onClick={() => setEditingPaper(paper)}
                        disabled={processingPaper === paper._id}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => window.open(`/api/papers/file/${paper._id}`, '_blank')}
                        className="text-green-600 hover:bg-green-50"
                      >
                        <DocumentTextIcon className="h-4 w-4 mr-2" />
                        View PDF
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteConfirm(paper._id)}
                        disabled={processingPaper === paper._id}
                        className="border-red-300 text-red-800 hover:bg-red-100"
                      >
                        <TrashIcon className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteConfirm(paper._id)}
                        disabled={processingPaper === paper._id}
                        className="border-red-300 text-red-800 hover:bg-red-100"
                      >
                        <TrashIcon className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to permanently delete this paper? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirm(null)}
                  disabled={processingPaper === deleteConfirm}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={processingPaper === deleteConfirm}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {processingPaper === deleteConfirm ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <TrashIcon className="h-4 w-4 mr-2" />
                  )}
                  Delete Permanently
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Paper Modal */}
        {editingPaper && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Edit Paper Details</h3>
              <EditPaperForm
                paper={editingPaper}
                onSave={handleEditPaper}
                onCancel={() => setEditingPaper(null)}
                isProcessing={processingPaper === editingPaper._id}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Edit Paper Form Component
const EditPaperForm = ({ paper, onSave, onCancel, isProcessing }) => {
  const [formData, setFormData] = useState({
    subject: paper.subject || '',
    department: paper.department || '',
    year: paper.year || '',
    semester: paper.semester || '',
    fileName: paper.fileName || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.department || !formData.year || !formData.semester) {
      alert('Please fill in all required fields');
      return;
    }
    onSave(paper._id, formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Subject *</label>
        <Input
          value={formData.subject}
          onChange={(e) => handleChange('subject', e.target.value)}
          placeholder="Enter subject name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Department *</label>
        <Input
          value={formData.department}
          onChange={(e) => handleChange('department', e.target.value)}
          placeholder="Enter department"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Year *</label>
          <Input
            type="number"
            value={formData.year}
            onChange={(e) => handleChange('year', e.target.value)}
            placeholder="2024"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Semester *</label>
          <Input
            value={formData.semester}
            onChange={(e) => handleChange('semester', e.target.value)}
            placeholder="1st Semester"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">File Name</label>
        <Input
          value={formData.fileName}
          onChange={(e) => handleChange('fileName', e.target.value)}
          placeholder="Enter file name"
        />
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isProcessing}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isProcessing ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <PencilIcon className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default AdminPanel;
