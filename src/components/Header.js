import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  return (
    <header className="bg-white shadow-md dark:bg-gray-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-primary dark:text-white">
            CSIT PYQs Portal
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-sm text-base-text italic dark:text-gray-300 hidden md:block">"One place. All PYQs. No distractions."</p>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
