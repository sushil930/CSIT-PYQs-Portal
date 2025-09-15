import Header from '@/components/Header';

const results = () => {
  return (
    <div className="min-h-screen bg-base-background">
      <Header />
      <div className="container mx-auto px-4 py-8 flex">
        <aside className="w-1/4 pr-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg text-primary mb-4">Filters</h3>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Department</label>
                <select className="w-full px-4 py-2 border rounded-lg bg-white">
                  <option>CSIT</option>
                  <option>ECE</option>
                  <option>ME</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-2">Semester</label>
                <select className="w-full px-4 py-2 border rounded-lg bg-white">
                  <option>1st</option>
                  <option>2nd</option>
                  <option>3rd</option>
                  <option>4th</option>
                  <option>5th</option>
                  <option>6th</option>
                  <option>7th</option>
                  <option>8th</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-2">Year</label>
                <select className="w-full px-4 py-2 border rounded-lg bg-white">
                  <option>2023</option>
                  <option>2022</option>
                  <option>2021</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-2">Tags</label>
                <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="e.g. important" />
              </div>
            </div>
          </div>
        </aside>
        <main className="w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Placeholder Paper Cards */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <h3 className="font-bold text-lg">Data Structures</h3>
              <p className="text-sm text-gray-500">2022</p>
              <div className="mt-4 flex justify-between">
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">View</button>
                <button className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-orange-500">Download</button>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <h3 className="font-bold text-lg">Algorithms</h3>
              <p className="text-sm text-gray-500">2021</p>
              <div className="mt-4 flex justify-between">
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">View</button>
                <button className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-orange-500">Download</button>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <h3 className="font-bold text-lg">Database Management</h3>
              <p className="text-sm text-gray-500">2022</p>
              <div className="mt-4 flex justify-between">
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">View</button>
                <button className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-orange-500">Download</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default results;
