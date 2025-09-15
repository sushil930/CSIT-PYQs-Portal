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
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Question Papers</h1>
              <p className="text-muted-foreground">
                Found {papers.length} papers matching your criteria
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {papers.map((paper, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors leading-tight">
                        {paper.title}
                      </CardTitle>
                      <Badge variant="secondary">{paper.year}</Badge>
                    </div>
                    <div className="flex gap-2 text-xs text-muted-foreground mb-2">
                      <span>{paper.department}</span>
                      <span>•</span>
                      <span>{paper.semester} Sem</span>
                    </div>
                    <CardDescription className="text-sm line-clamp-2">
                      {paper.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {paper.tags.map((tag, tagIndex) => (
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
                        <Button variant="outline" size="sm" className="h-8 px-3">
                          <EyeIcon className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" className="h-8 px-3">
                          <ArrowDownTrayIcon className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
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
