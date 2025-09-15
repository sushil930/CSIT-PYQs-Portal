import Header from '@/components/Header';

const AdminPanel = () => {
  return (
    <div className="min-h-screen bg-base-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-primary mb-6">Admin Panel</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg text-primary mb-4">Analytics</h3>
            <p><strong>Most Downloaded:</strong> Data Structures (2022)</p>
            <p><strong>Active Users:</strong> 120 (last 24h)</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg text-primary mb-4">Bulk Upload</h3>
            <form>
              <input type="file" accept=".csv" className="w-full px-4 py-2 border rounded-lg mb-4" />
              <button className="w-full py-2 bg-primary text-white rounded-lg font-bold hover:bg-blue-700">Upload CSV</button>
            </form>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-bold text-lg text-primary mb-4">Pending Uploads</h3>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2">Subject</th>
                <th className="py-2">Year</th>
                <th className="py-2">Uploader</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">Operating Systems</td>
                <td className="py-2">2023</td>
                <td className="py-2">user123</td>
                <td className="py-2">
                  <button className="px-3 py-1 bg-green-500 text-white rounded-lg mr-2">Approve</button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded-lg">Reject</button>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Computer Networks</td>
                <td className="py-2">2023</td>
                <td className="py-2">user456</td>
                <td className="py-2">
                  <button className="px-3 py-1 bg-green-500 text-white rounded-lg mr-2">Approve</button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded-lg">Reject</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
