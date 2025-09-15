import { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  CloudArrowUpIcon, 
  DocumentTextIcon, 
  CheckCircleIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline';

const Upload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    department: '',
    subject: '',
    year: '',
    examType: '',
    tags: '',
    file: null
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsUploading(true);
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        setUploadProgress(0);
      }
    }, 200);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <CloudArrowUpIcon className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Upload Question Paper
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Contribute to the community by sharing previous year question papers
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span>PDF Only</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span>Max 10MB</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span>Manual Review</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Upload Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl">Paper Details</CardTitle>
                  <CardDescription>
                    Please fill in all the required information about the question paper
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Department *</label>
                        <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="csit">Computer Science & IT</SelectItem>
                            <SelectItem value="ece">Electronics & Communication</SelectItem>
                            <SelectItem value="me">Mechanical Engineering</SelectItem>
                            <SelectItem value="ce">Civil Engineering</SelectItem>
                            <SelectItem value="ee">Electrical Engineering</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Year *</label>
                        <Select value={formData.year} onValueChange={(value) => setFormData({...formData, year: value})}>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2023">2023</SelectItem>
                            <SelectItem value="2022">2022</SelectItem>
                            <SelectItem value="2021">2021</SelectItem>
                            <SelectItem value="2020">2020</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Course/Subject *</label>
                      <Input 
                        type="text" 
                        placeholder="e.g. Data Structures and Algorithms"
                        className="h-11"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Exam Type *</label>
                      <Select value={formData.examType} onValueChange={(value) => setFormData({...formData, examType: value})}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select exam type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="midsem">Mid Semester</SelectItem>
                          <SelectItem value="endsem">End Semester</SelectItem>
                          <SelectItem value="backlog">Backlog</SelectItem>
                          <SelectItem value="resit">Re-sit</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tags</label>
                      <Input 
                        type="text" 
                        placeholder="e.g. important, numericals, theory (comma separated)"
                        className="h-11"
                        value={formData.tags}
                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      />
                      <p className="text-xs text-muted-foreground">Add relevant tags to help others find this paper</p>
                    </div>

                    {/* File Upload Area */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Question Paper (PDF) *</label>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                        <input 
                          type="file" 
                          accept="application/pdf" 
                          onChange={handleFileChange}
                          className="hidden" 
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                              <DocumentTextIcon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Click to upload or drag and drop</p>
                              <p className="text-xs text-muted-foreground">PDF files only, max 10MB</p>
                            </div>
                            {formData.file && (
                              <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-green-50 rounded-full">
                                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                <span className="text-xs text-green-700">{formData.file.name}</span>
                              </div>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Upload Progress */}
                    {isUploading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-semibold"
                      disabled={isUploading || !formData.file || !formData.subject || !formData.department}
                    >
                      {isUploading ? 'Uploading...' : 'Submit for Review'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Info Sidebar */}
            <div className="space-y-6">
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <InformationCircleIcon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Upload Guidelines</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p>Ensure the PDF is clear and readable</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p>File size should not exceed 10MB</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p>Include complete question paper</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p>Avoid duplicate uploads</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Recent Uploads</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { subject: "Data Structures", dept: "CSIT", status: "approved" },
                    { subject: "Digital Logic", dept: "ECE", status: "pending" },
                    { subject: "Thermodynamics", dept: "ME", status: "approved" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{item.subject}</p>
                        <p className="text-xs text-muted-foreground">{item.dept}</p>
                      </div>
                      <Badge variant={item.status === 'approved' ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
