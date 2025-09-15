import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EyeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const results = () => {
  const papers = [
    { 
      title: "Data Structures", 
      year: "2022", 
      department: "CSIT",
      semester: "3rd",
      downloads: "1.2k",
      tags: ["Important", "Arrays"],
      description: "Comprehensive coverage of arrays, linked lists, and trees"
    },
    { 
      title: "Algorithms", 
      year: "2021", 
      department: "CSIT",
      semester: "4th",
      downloads: "890",
      tags: ["Core", "Problem Solving"],
      description: "Dynamic programming, sorting, and graph algorithms"
    },
    { 
      title: "Database Management", 
      year: "2022", 
      department: "CSIT",
      semester: "5th",
      downloads: "756",
      tags: ["SQL", "Design"],
      description: "DBMS concepts, normalization, and query optimization"
    },
    { 
      title: "Computer Networks", 
      year: "2023", 
      department: "CSIT",
      semester: "6th",
      downloads: "643",
      tags: ["Protocols", "Security"],
      description: "TCP/IP, OSI model, and network security fundamentals"
    },
    { 
      title: "Operating Systems", 
      year: "2022", 
      department: "CSIT",
      semester: "5th",
      downloads: "587",
      tags: ["Process", "Memory"],
      description: "Process management, memory allocation, and file systems"
    },
    { 
      title: "Software Engineering", 
      year: "2023", 
      department: "CSIT",
      semester: "7th",
      downloads: "432",
      tags: ["SDLC", "Design"],
      description: "Software development lifecycle and design patterns"
    }
  ];

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
                  <Input placeholder="Search papers..." />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <Select>
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
                  <Select>
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
                  <label className="text-sm font-medium">Year</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2020">2020</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <Input placeholder="e.g. important, arrays" />
                </div>
                
                <Button className="w-full">Apply Filters</Button>
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
                    Found <span className="font-semibold text-foreground">{papers.length} papers</span> matching your criteria
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="newest">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="downloads">Most Downloaded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {papers.map((paper, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-card/80 backdrop-blur overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <CardHeader className="pb-4 relative z-10">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <span className="text-xs font-bold text-primary">{paper.department}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs px-2 py-1">
                          {paper.year}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">{paper.semester} Semester</div>
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg group-hover:text-primary transition-colors leading-tight mb-2">
                      {paper.title}
                    </CardTitle>
                    
                    <CardDescription className="text-sm line-clamp-2 mb-3">
                      {paper.description}
                    </CardDescription>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {paper.tags.map((tag, tagIndex) => (
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
                      >
                        <EyeIcon className="h-3.5 w-3.5 mr-1.5" />
                        Preview
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 h-9 text-xs bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200"
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
