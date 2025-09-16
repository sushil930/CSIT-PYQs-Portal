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
  CalendarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Textarea } from "@/components/ui/textarea";

// Dynamically import react-pdf components to avoid SSR/bundling issues
// Dynamically import react-pdf components (SSR disabled)
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
  import('react-pdf').then((mod) => {
    // Prefer same-origin worker from /public to avoid CORS/module issues
    // Copy happens via postinstall (scripts/copy-pdf-worker.js)
    mod.pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
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
  
  // Drag and pan state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [pdfPosition, setPdfPosition] = useState({ x: 0, y: 0 });
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  
  const pdfContainerRef = useRef(null);
  const pdfRef = useRef(null);
  
  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Build paper metadata from query params only
  const paperMetadata = {
    title: title || '',
    course: router.query.course || '',
    department: department || '',
    year: year || '',
    semester: semester || '',
    examType: router.query.examType || '',
    tags: tags ? tags.split(',').filter(Boolean) : [],
    uploadedBy: router.query.uploadedBy || '',
    uploadDate: router.query.uploadDate || '',
    downloads: downloads || '',
    rating: router.query.rating ? Number(router.query.rating) : null,
    verified: router.query.verified === 'true' || router.query.verified === true,
    description: description || ''
  };

  // Normalize file URL: prefix backend base for relative /uploads paths
  const rawFile = router.query.file || '';
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
  const fileUrl = rawFile
    ? (rawFile.startsWith('http://') || rawFile.startsWith('https://')
        ? rawFile
        : `${apiBase}${rawFile.startsWith('/') ? '' : '/'}${rawFile}`)
    : null;

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

  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale(prev => Math.max(0.5, Math.min(3.0, prev + delta)));
    }
  };

  // Touch and mouse drag handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left mouse button
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setLastPanPoint({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX, y: touch.clientY });
      setLastPanPoint({ x: touch.clientX, y: touch.clientY });
    } else if (e.touches.length === 2) {
      // Handle pinch-to-zoom start
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      setLastPanPoint({ distance });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastPanPoint.x;
    const deltaY = e.clientY - lastPanPoint.y;
    
    setPdfPosition(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
    
    setLastPanPoint({ x: e.clientX, y: e.clientY });
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    
    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - lastPanPoint.x;
      const deltaY = touch.clientY - lastPanPoint.y;
      
      setPdfPosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastPanPoint({ x: touch.clientX, y: touch.clientY });
    } else if (e.touches.length === 2) {
      // Handle pinch-to-zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      if (lastPanPoint.distance) {
        const scaleChange = distance / lastPanPoint.distance;
        setScale(prev => Math.max(0.5, Math.min(3.0, prev * scaleChange)));
      }
      
      setLastPanPoint({ distance });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Add event listeners for drag functionality
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, lastPanPoint]);

  const resetPdfPosition = () => {
    setPdfPosition({ x: 0, y: 0 });
    setScale(1.0);
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
        <div className="container mx-auto px-4 py-4 lg:py-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">{paperMetadata.title}</h1>
              <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <DocumentTextIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">{paperMetadata.course}</span>
                  <span className="sm:hidden">{paperMetadata.course?.slice(0, 20)}...</span>
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
                  <span className="hidden sm:inline">{paperMetadata.uploadedBy}</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
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
            <div className="flex items-center gap-2 lg:gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAIPanel(!showAIPanel)}
                className="flex items-center gap-2"
              >
                <SparklesIcon className="h-4 w-4" />
                <span className="hidden sm:inline">AI Assistant</span>
                <span className="sm:hidden">AI</span>
              </Button>
              <Button 
                size="sm"
                className="flex items-center gap-2"
                onClick={() => { if (fileUrl) window.open(fileUrl, '_blank', 'noopener,noreferrer'); }}
                disabled={!fileUrl}
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Download PDF</span>
                <span className="sm:hidden">Download</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className={`grid grid-cols-1 ${showAIPanel ? 'lg:grid-cols-4' : 'lg:grid-cols-4'} gap-6`}>
          
          {/* PDF Viewer */}
          <div className={`${showAIPanel ? 'lg:col-span-2' : 'lg:col-span-3'} ${showAIPanel ? 'order-2 lg:order-1' : ''}`}>
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <CardTitle className="text-lg">Question Paper Preview</CardTitle>
                  <div className="flex items-center justify-between sm:justify-end gap-2">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={handleZoomOut}>
                        <MagnifyingGlassMinusIcon className="h-4 w-4" />
                      </Button>
                      <span className="text-sm px-2 min-w-[60px] text-center">{Math.round(scale * 100)}%</span>
                      <Button variant="outline" size="sm" onClick={handleZoomIn}>
                        <MagnifyingGlassPlusIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button variant="outline" size="sm" onClick={resetPdfPosition} className="hidden sm:flex">
                      Reset
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!mounted ? (
                  <div className="flex items-center justify-center h-64 lg:h-96 bg-muted rounded-lg">
                    <div className="text-center">
                      <DocumentTextIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p>Loading PDF viewer...</p>
                    </div>
                  </div>
                ) : pdfError ? (
                  <div className="flex items-center justify-center h-64 lg:h-96 bg-muted rounded-lg">
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
                    <div 
                      ref={pdfContainerRef}
                      className="bg-gray-100 rounded-lg p-4 mb-4 overflow-hidden cursor-grab active:cursor-grabbing touch-none"
                      style={{ 
                        height: 'clamp(300px, 70vh, 800px)',
                        position: 'relative'
                      }}
                      onMouseDown={handleMouseDown}
                      onTouchStart={handleTouchStart}
                      onWheel={handleWheel}
                    >
                      {!fileUrl ? (
                        <div className="flex items-center justify-center h-full bg-muted rounded-lg">
                          <div className="text-center">
                            <DocumentTextIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p>No PDF file specified.</p>
                          </div>
                        </div>
                      ) : (
                        <div 
                          ref={pdfRef}
                          style={{
                            transform: `translate(${pdfPosition.x}px, ${pdfPosition.y}px)`,
                            transition: isDragging ? 'none' : 'transform 0.1s ease',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            userSelect: 'none'
                          }}
                        >
                          <Document
                            file={fileUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={onDocumentLoadError}
                            className="flex justify-center"
                            loading={
                              <div className="flex items-center justify-center h-full">
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
                      )}
                    </div>
                    
                    {/* Navigation Controls */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handlePrevPage}
                        disabled={pageNumber <= 1}
                        className="w-full sm:w-auto"
                      >
                        <ChevronLeftIcon className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      
                      <span className="text-sm">
                        Page {pageNumber} of {numPages || '...'}
                      </span>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleNextPage}
                        disabled={pageNumber >= (numPages || 1)}
                        className="w-full sm:w-auto"
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
            <div className="lg:col-span-1 order-1 lg:order-2">
              <Card className="sticky top-6">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <SparklesIcon className="h-5 w-5 text-primary" />
                      AI Assistant
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowAIPanel(false)}
                      className="lg:hidden"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </Button>
                  </div>
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
                      className="min-h-[80px] text-sm"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleAIQuery} 
                    disabled={isLoadingAI || !aiQuestion.trim()}
                    className="w-full"
                    size="sm"
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
          <div className={`lg:col-span-1 ${showAIPanel ? 'order-3' : 'order-2'}`}>
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
                  {paperMetadata?.rating != null && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Rating:</span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">★★★★☆</span>
                        <span className="text-sm text-muted-foreground">({paperMetadata.rating})</span>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Added:</span>
                    <span className="text-sm font-medium">{paperMetadata.uploadDate}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <TagIcon className="h-4 w-4 mr-2" />
                    Add to Favorites
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <ChatBubbleLeftIcon className="h-4 w-4 mr-2" />
                    Report Issue
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                    Find Similar
                  </Button>
                  <Button variant="outline" className="w-full justify-start lg:hidden" size="sm" onClick={resetPdfPosition}>
                    Reset PDF View
                  </Button>
                </CardContent>
              </Card>

              {/* Mobile Controls */}
              <Card className="lg:hidden">
                <CardHeader>
                  <CardTitle className="text-lg">PDF Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-2">
                    • Pinch to zoom in/out<br/>
                    • Drag to pan around<br/>
                    • Ctrl+scroll wheel on desktop
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleZoomOut} className="flex-1">
                      Zoom Out
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleZoomIn} className="flex-1">
                      Zoom In
                    </Button>
                  </div>
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
