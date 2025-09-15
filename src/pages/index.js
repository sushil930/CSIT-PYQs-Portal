import Header from '@/components/Header';
import { SearchIcon } from '@heroicons/react/solid';

const Home = () => {
  return (
    <div className="min-h-screen bg-base-background">
      <Header />
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-primary mb-4">
          Find Your Papers
        </h1>
        <p className="text-lg text-base-text mb-8">
          "One place. All PYQs. No distractions."
        </p>
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by subject, year, or tags..."
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-full focus:outline-none focus:border-primary transition-colors"
            />
            <button className="absolute right-0 top-0 mt-3 mr-4">
              <SearchIcon className="h-8 w-8 text-gray-400 hover:text-primary" />
            </button>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-primary mb-6">Quick Filters</h2>
          <div className="flex justify-center space-x-4">
            <select className="px-4 py-2 border rounded-lg bg-white">
              <option>Department</option>
              <option>CSIT</option>
              <option>ECE</option>
              <option>ME</option>
            </select>
            <select className="px-4 py-2 border rounded-lg bg-white">
              <option>Semester</option>
              <option>1st</option>
              <option>2nd</option>
              <option>3rd</option>
              <option>4th</option>
              <option>5th</option>
              <option>6th</option>
              <option>7th</option>
              <option>8th</option>
            </select>
            <select className="px-4 py-2 border rounded-lg bg-white">
              <option>Year</option>
              <option>2023</option>
              <option>2022</option>
              <option>2021</option>
            </select>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-primary mb-6">Most Downloaded</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Placeholder Cards */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <h3 className="font-bold text-lg">Data Structures</h3>
              <p className="text-sm text-gray-500">2022</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <h3 className="font-bold text-lg">Algorithms</h3>
              <p className="text-sm text-gray-500">2021</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <h3 className="font-bold text-lg">Database Management</h3>
              <p className="text-sm text-gray-500">2022</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
