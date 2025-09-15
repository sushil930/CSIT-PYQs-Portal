import { useState } from 'react';
import Header from '@/components/Header';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PaperViewer = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="min-h-screen bg-base-background">
      <Header />
      <div className="container mx-auto px-4 py-8 flex">
        <main className="w-3/4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <Document
              file="/sample.pdf" // Placeholder PDF
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page pageNumber={pageNumber} />
            </Document>
            <p>
              Page {pageNumber} of {numPages}
            </p>
          </div>
        </main>
        <aside className="w-1/4 pl-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg text-primary mb-4">Metadata</h3>
            <div className="space-y-2">
              <p><strong>Course:</strong> Data Structures</p>
              <p><strong>Year:</strong> 2022</p>
              <p><strong>Tags:</strong> important, arrays</p>
              <p><strong>Uploaded by:</strong> Admin</p>
              <p><strong>Added date:</strong> 2023-10-26</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md mt-8">
            <h3 className="font-bold text-lg text-primary mb-4">Related Papers</h3>
            <div className="space-y-4">
              <div className="hover:underline cursor-pointer">Data Structures - 2021</div>
              <div className="hover:underline cursor-pointer">Algorithms - 2022</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PaperViewer;
