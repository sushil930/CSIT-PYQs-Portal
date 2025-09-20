import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EyeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const results = () => {
  const router = useRouter();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
  const resultsStatus = process.env.NEXT_PUBLIC_RESULTS_STATUS || 'ready';

  const [filters, setFilters] = useState({
    department: '',
    semester: '',
    course: '',
    q: '',
    tags: '',
    sort: 'newest',
  });

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        setLoading(true);
        setError('');
        const params = new URLSearchParams();
  params.set('status', resultsStatus);
        if (filters.department) params.set('department', filters.department);
        if (filters.semester) params.set('semester', filters.semester);
        if (filters.course) params.set('course', filters.course);
        if (filters.q) params.set('q', filters.q);
        if (filters.tags) params.set('tags', filters.tags);
        if (filters.sort) params.set('sort', filters.sort);
        const url = `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'}/api/papers?${params.toString()}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setPapers(data.data || []);
      } catch (e) {
        if (e.name !== 'AbortError') setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [filters.department, filters.semester, filters.course, filters.q, filters.tags, filters.sort]);

  const handlePreview = (paper, index) => {
    // Navigate to paper preview page with paper data
    router.push({
      pathname: '/paper-viewer',
      query: {
        id: paper._id,
        title: paper.subject || paper.title,
        department: paper.department || '',
        year: paper.year || '',
        semester: paper.semester || '',
        description: paper.description || '',
        tags: (paper.tags || []).join(','),
        downloads: paper.downloads || '',
        file: paper.fileUrl || ''
      }
    });
  };

  const handleDownload = (paper) => {
    const raw = paper.fileUrl || '';
    if (!raw) return;
    const url = raw.startsWith('http://') || raw.startsWith('https://')
      ? raw
      : `${apiBase}${raw.startsWith('/') ? '' : '/'}${raw}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
                <CardDescription>Narrow down your search</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <Input placeholder="Search papers..." value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <Select value={filters.department} onValueChange={(v) => setFilters({ ...filters, department: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csit">CSIT</SelectItem>
                      <SelectItem value="ece">ECE</SelectItem>
                      <SelectItem value="me">ME</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Semester</label>
                  <Select value={filters.semester} onValueChange={(v) => setFilters({ ...filters, semester: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Semester</SelectItem>
                      <SelectItem value="2">2nd Semester</SelectItem>
                      <SelectItem value="3">3rd Semester</SelectItem>
                      <SelectItem value="4">4th Semester</SelectItem>
                      <SelectItem value="5">5th Semester</SelectItem>
                      <SelectItem value="6">6th Semester</SelectItem>
                      <SelectItem value="7">7th Semester</SelectItem>
                      <SelectItem value="8">8th Semester</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Course</label>
                  <Select value={filters.course} onValueChange={(v) => setFilters({ ...filters, course: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="btech">B.Tech</SelectItem>
                      <SelectItem value="mtech">M.Tech</SelectItem>
                      <SelectItem value="bca">BCA</SelectItem>
                      <SelectItem value="mca">MCA</SelectItem>
                      <SelectItem value="bsc">B.Sc</SelectItem>
                      <SelectItem value="msc">M.Sc</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <Input placeholder="e.g. important, arrays" value={filters.tags} onChange={(e) => setFilters({ ...filters, tags: e.target.value })} />
                </div>
                
                <Button className="w-full" onClick={() => setFilters({ ...filters })}>Apply Filters</Button>
              </CardContent>
            </Card>
          </aside>

          {/* Results Grid */}
          <main className="flex-1">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Question Papers
                  </h1>
                  <p className="text-muted-foreground">
                    {papers.length > 0 ? (
                      <>Found <span className="font-semibold text-foreground">{papers.length} papers</span> matching your criteria</>
                    ) : (
                      <>No results yet. Try adjusting filters.</>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={filters.sort} onValueChange={(v) => setFilters({ ...filters, sort: v })}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="popular" disabled>Most Popular</SelectItem>
                      <SelectItem value="downloads">Most Downloaded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading && (
                <Card className="col-span-1 md:col-span-2 xl:col-span-3">
                  <CardHeader>
                    <CardTitle>Loading...</CardTitle>
                    <CardDescription>Fetching papers</CardDescription>
                  </CardHeader>
                </Card>
              )}
              {!loading && error && (
                <Card className="col-span-1 md:col-span-2 xl:col-span-3">
                  <CardHeader>
                    <CardTitle>Failed to load</CardTitle>
                    <CardDescription className="text-destructive">{error}</CardDescription>
                  </CardHeader>
                </Card>
              )}
              {!loading && !error && papers.length === 0 && (
                <Card className="col-span-1 md:col-span-2 xl:col-span-3">
                  <CardHeader>
                    <CardTitle>No results</CardTitle>
                    <CardDescription>
                      Try changing filters or check back later.
                    </CardDescription>
                  </CardHeader>
                </Card>
              )}
              {papers.map((paper, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-card/80 backdrop-blur overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <CardHeader className="pb-4 relative z-10">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <span className="text-xs font-bold text-primary">{paper.department || '—'}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs px-2 py-1">
                          {paper.year}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">{paper.semester ? `${paper.semester} Semester` : '—'}</div>
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg group-hover:text-primary transition-colors leading-tight mb-2">
                      {paper.subject || paper.title}
                    </CardTitle>
                    
                    <CardDescription className="text-sm line-clamp-2 mb-3">
                      {paper.description || '—'}
                    </CardDescription>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(paper.tags || []).map((tag, tagIndex) => (
                        <Badge 
                          key={tagIndex} 
                          variant="outline" 
                          className="text-xs px-2 py-0.5 hover:bg-primary/10 hover:border-primary/30 transition-colors cursor-pointer"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 relative z-10">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>{paper.downloads} downloads</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>★★★★☆</span>
                        <span>(4.2)</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 h-9 text-xs hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-200"
                        onClick={() => handlePreview(paper, index)}
                      >
                        <EyeIcon className="h-3.5 w-3.5 mr-1.5" />
                        Preview
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 h-9 text-xs bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200"
                        onClick={() => handleDownload(paper)}
                      >
                        <ArrowDownTrayIcon className="h-3.5 w-3.5 mr-1.5" />
                        Download
                      </Button>
                    </div>

                    {/* Additional metadata */}
                    <div className="mt-3 pt-3 border-t border-border/50 flex justify-between items-center text-xs text-muted-foreground">
                      <span>Added 2 days ago</span>
                      <span className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        Verified
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default results;
