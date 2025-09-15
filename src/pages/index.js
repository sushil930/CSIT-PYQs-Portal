import Header from '@/components/Header';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const Home = () => {
  const popularPapers = [
    { 
      title: "Data Structures", 
      year: "2022", 
      downloads: "1.2k", 
      tags: ["Important", "Arrays"],
      description: "Comprehensive coverage of arrays, linked lists, and trees"
    },
    { 
      title: "Algorithms", 
      year: "2021", 
      downloads: "890", 
      tags: ["Core", "Problem Solving"],
      description: "Dynamic programming, sorting, and graph algorithms"
    },
    { 
      title: "Database Management", 
      year: "2022", 
      downloads: "756", 
      tags: ["SQL", "Design"],
      description: "DBMS concepts, normalization, and query optimization"
    },
    { 
      title: "Computer Networks", 
      year: "2023", 
      downloads: "643", 
      tags: ["Protocols", "Security"],
      description: "TCP/IP, OSI model, and network security fundamentals"
    },
    { 
      title: "Operating Systems", 
      year: "2022", 
      downloads: "587", 
      tags: ["Process", "Memory"],
      description: "Process management, memory allocation, and file systems"
    },
    { 
      title: "Software Engineering", 
      year: "2023", 
      downloads: "432", 
      tags: ["SDLC", "Design"],
      description: "Software development lifecycle and design patterns"
    }
  ];

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
            {popularPapers.map((paper, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {paper.title}
                    </CardTitle>
                    <Badge variant="secondary">{paper.year}</Badge>
                  </div>
                  <CardDescription className="text-sm">
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
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button size="sm">
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
