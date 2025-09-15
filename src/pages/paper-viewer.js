import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  MagnifyingGlassIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowDownTrayIcon,
  ChatBubbleLeftIcon,
  SparklesIcon,
  DocumentTextIcon,
  ClockIcon,
  TagIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { Textarea } from "@/components/ui/textarea";

// Dynamically import react-pdf components to avoid SSR/bundling issues
const Document = dynamic(
  () => import('react-pdf').then((mod) => mod.Document),
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-96 bg-muted rounded-lg">Loading PDF...</div>
  }
);

const Page = dynamic(
  () => import('react-pdf').then((mod) => mod.Page),
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-96 bg-muted rounded-lg">Loading page...</div>
  }
);

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  import('react-pdf').then(({ pdfjs }) => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  });
}

const PaperViewer = () => {
  const router = useRouter();
  const { title, department, year, semester, description, tags, downloads } = router.query;
  
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [pdfError, setPdfError] = useState(null);
  const [mounted, setMounted] = useState(false);
  
  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Mock paper metadata (will be overridden by query params if available)
  const paperMetadata = {
    title: title || "Data Structures and Algorithms",
    course: "Computer Science",
    department: department || "CSIT",
    year: year || "2022",
    semester: semester || "3rd Semester",
    examType: "End Semester",
    tags: tags ? tags.split(',') : ["Important", "Arrays", "Algorithms", "Problem Solving"],
    uploadedBy: "Dr. Sarah Johnson",
    uploadDate: "2024-01-15",
    downloads: downloads || "1,234",
    rating: 4.5,
    verified: true,
    description: description || "Comprehensive coverage of data structures and algorithms"
  };

  const relatedPapers = [
    { title: "Data Structures - 2021", year: "2021", downloads: "890" },
    { title: "Algorithms - 2022", year: "2022", downloads: "756" },
    { title: "Database Management - 2022", year: "2022", downloads: "643" },
    { title: "Computer Networks - 2023", year: "2023", downloads: "587" }
  ];

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPdfError(null);
  }

  function onDocumentLoadError(error) {
    console.error('Error loading PDF:', error);
    setPdfError('Failed to load PDF. Please try again.');
  }

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3.0));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const handlePrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages || 1));
  };

  const handleAIQuery = async () => {
    if (!aiQuestion.trim()) return;
    
    setIsLoadingAI(true);
    
    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const mockResponse = `Based on the question "${aiQuestion}", here's a comprehensive answer:

This appears to be related to data structures concepts. Let me break down the key points:

1. **Algorithm Analysis**: When solving this type of problem, consider the time and space complexity.

2. **Implementation Approach**: 
   - Start with the basic data structure definition
   - Consider edge cases
   - Optimize for the given constraints

3. **Key Concepts**:
   - Arrays and their properties
   - Searching and sorting algorithms
   - Time complexity: O(n), O(log n), O(n²)

4. **Best Practices**:
   - Always validate input
   - Handle boundary conditions
   - Write clean, readable code

Would you like me to explain any specific part in more detail?`;
      
      setAiResponse(mockResponse);
      setIsLoadingAI(false);
    }, 2000);
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString();
    if (text) {
      setSelectedText(text);
      setAiQuestion(`Explain this: "${text}"`);
      setShowAIPanel(true);
    }
  };

  useEffect(() => {
    console.log("Query parameters:", router.query);
  }, [router.query]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Paper Header */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{paperMetadata.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <DocumentTextIcon className="h-4 w-4" />
                  {paperMetadata.course}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  {paperMetadata.year}
                </span>
                <span className="flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" />
                  {paperMetadata.semester}
                </span>
                <span className="flex items-center gap-1">
                  <UserIcon className="h-4 w-4" />
                  {paperMetadata.uploadedBy}
                </span>
              </div>
              <div className="flex gap-2">
                {paperMetadata.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {paperMetadata.verified && (
                  <Badge className="text-xs bg-green-100 text-green-800 border-green-300">
                    ✓ Verified
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowAIPanel(!showAIPanel)}
                className="flex items-center gap-2"
              >
                <SparklesIcon className="h-4 w-4" />
                AI Assistant
              </Button>
              <Button className="flex items-center gap-2">
                <ArrowDownTrayIcon className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* PDF Viewer */}
          <div className={`${showAIPanel ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Question Paper Preview</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleZoomOut}>
                      <MagnifyingGlassMinusIcon className="h-4 w-4" />
                    </Button>
                    <span className="text-sm px-2">{Math.round(scale * 100)}%</span>
                    <Button variant="outline" size="sm" onClick={handleZoomIn}>
                      <MagnifyingGlassPlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!mounted ? (
                  <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
                    <div className="text-center">
                      <DocumentTextIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p>Loading PDF viewer...</p>
                    </div>
                  </div>
                ) : pdfError ? (
                  <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
                    <div className="text-center">
                      <DocumentTextIcon className="h-12 w-12 mx-auto mb-4 text-red-500" />
                      <p className="text-red-600 mb-4">{pdfError}</p>
                      <Button onClick={() => setPdfError(null)} variant="outline">
                        Try Again
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-gray-100 rounded-lg p-4 mb-4" onMouseUp={handleTextSelection}>
                      <Document
                        file="/sample.pdf"
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        className="flex justify-center"
                        loading={
                          <div className="flex items-center justify-center h-96">
                            <div className="text-center">
                              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                              <p>Loading PDF...</p>
                            </div>
                          </div>
                        }
                      >
                        <Page 
                          pageNumber={pageNumber} 
                          scale={scale}
                          renderTextLayer={true}
                          renderAnnotationLayer={false}
                          loading={
                            <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
                              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                            </div>
                          }
                        />
                      </Document>
                    </div>
                    
                    {/* Navigation Controls */}
                    <div className="flex justify-between items-center">
                      <Button 
                        variant="outline" 
                        onClick={handlePrevPage}
                        disabled={pageNumber <= 1}
                      >
                        <ChevronLeftIcon className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      
                      <span className="text-sm">
                        Page {pageNumber} of {numPages || '...'}
                      </span>
                      
                      <Button 
                        variant="outline" 
                        onClick={handleNextPage}
                        disabled={pageNumber >= (numPages || 1)}
                      >
                        Next
                        <ChevronRightIcon className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* AI Assistant Panel */}
          {showAIPanel && (
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SparklesIcon className="h-5 w-5 text-primary" />
                    AI Assistant
                  </CardTitle>
                  <CardDescription>
                    Ask questions about the paper or get explanations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Ask a question:</label>
                    <Textarea
                      placeholder="e.g., Explain question 3, What is the time complexity of this algorithm?"
                      value={aiQuestion}
                      onChange={(e) => setAiQuestion(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleAIQuery} 
                    disabled={isLoadingAI || !aiQuestion.trim()}
                    className="w-full"
                  >
                    {isLoadingAI ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                        Thinking...
                      </>
                    ) : (
                      <>
                        <ChatBubbleLeftIcon className="h-4 w-4 mr-2" />
                        Get Answer
                      </>
                    )}
                  </Button>

                  {aiResponse && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <SparklesIcon className="h-4 w-4" />
                        AI Response:
                      </h4>
                      <div className="text-sm whitespace-pre-wrap">{aiResponse}</div>
                    </div>
                  )}

                  {selectedText && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs text-blue-600 mb-1">Selected text:</p>
                      <p className="text-sm italic">"{selectedText}"</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              
              {/* Paper Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Paper Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Department:</span>
                    <span className="text-sm font-medium">{paperMetadata.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Exam Type:</span>
                    <span className="text-sm font-medium">{paperMetadata.examType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Downloads:</span>
                    <span className="text-sm font-medium">{paperMetadata.downloads}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Rating:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm">★★★★☆</span>
                      <span className="text-sm text-muted-foreground">({paperMetadata.rating})</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Added:</span>
                    <span className="text-sm font-medium">{paperMetadata.uploadDate}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Related Papers */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Papers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {relatedPapers.map((paper, index) => (
                    <div key={index} className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors">
                      <div>
                        <p className="text-sm font-medium">{paper.title}</p>
                        <p className="text-xs text-muted-foreground">{paper.downloads} downloads</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {paper.year}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <TagIcon className="h-4 w-4 mr-2" />
                    Add to Favorites
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ChatBubbleLeftIcon className="h-4 w-4 mr-2" />
                    Report Issue
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                    Find Similar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaperViewer;
