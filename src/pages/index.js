import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const Home = () => {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
  
  const [popularPapers, setPopularPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'}/api/papers?status=ready&sort=downloads&limit=6`, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setPopularPapers(data.data || []);
      } catch (e) {
        if (e.name !== 'AbortError') setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, []);

  const handlePreview = (paper) => {
    // Navigate to paper preview page with paper data (include fileUrl)
    router.push({
      pathname: '/paper-viewer',
      query: {
        title: paper.subject || paper.title || '',
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
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Find Your <span className="text-primary">Papers</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            One place. All PYQs. No distractions.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Input
              type="text"
              placeholder="Search by subject, year, or tags..."
              className="h-14 pl-6 pr-14 text-lg rounded-full border-2 focus:border-primary"
            />
            <Button 
              size="icon" 
              className="absolute right-2 top-2 h-10 w-10 rounded-full"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Quick Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csit">CSIT</SelectItem>
                <SelectItem value="ece">ECE</SelectItem>
                <SelectItem value="me">ME</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Semester" />
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
            
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2020">2020</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Popular Papers Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Most Downloaded Papers</h2>
            <p className="text-muted-foreground">Trending question papers from our collection</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && (
              <Card className="col-span-1 md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Loading...</CardTitle>
                  <CardDescription>Fetching trending papers</CardDescription>
                </CardHeader>
              </Card>
            )}
            {!loading && error && (
              <Card className="col-span-1 md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Failed to load</CardTitle>
                  <CardDescription className="text-destructive">{error}</CardDescription>
                </CardHeader>
              </Card>
            )}
            {!loading && !error && popularPapers.length === 0 && (
              <Card className="col-span-1 md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle>No papers yet</CardTitle>
                  <CardDescription>
                    Once uploads are approved, trending papers will appear here.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
            {popularPapers.map((paper, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {paper.subject}
                    </CardTitle>
                    <Badge variant="secondary">{paper.year}</Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {paper.description || '—'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {(paper.tags || []).map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {paper.downloads} downloads
                    </span>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handlePreview(paper)}
                      >
                        View
                      </Button>
                      <Button size="sm" onClick={() => handleDownload(paper)}>
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <Card className="border-0 shadow-none">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-muted-foreground">Question Papers</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-none">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">50k+</div>
                <div className="text-muted-foreground">Downloads</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-none">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-muted-foreground">Available</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
