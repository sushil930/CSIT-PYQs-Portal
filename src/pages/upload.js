import Header from '@/components/Header';

const Upload = () => {
  return (
    <div className="min-h-screen bg-base-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-primary mb-6">Upload Paper</h2>
          <form className="space-y-6">
            <div>
              <label className="block font-semibold mb-2">Department</label>
              <select className="w-full px-4 py-2 border rounded-lg">
                <option>CSIT</option>
                <option>ECE</option>
                <option>ME</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2">Course/Subject</label>
              <input type="text" className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block font-semibold mb-2">Year</label>
              <input type="number" className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block font-semibold mb-2">Exam Type</label>
              <select className="w-full px-4 py-2 border rounded-lg">
                <option>Midsem</option>
                <option>Finals</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2">Tags</label>
              <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="e.g. important, numericals" />
            </div>
            <div>
              <label className="block font-semibold mb-2">File (PDF only)</label>
              <input type="file" accept="application/pdf" className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <button type="submit" className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-blue-700">
              Submit for Approval
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;
