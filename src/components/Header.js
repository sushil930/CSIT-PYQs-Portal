import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
            CSIT PYQs Portal
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/results" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Browse Papers
            </Link>
            <Link href="/upload" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Upload
            </Link>
            <Link href="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Admin
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-sm text-muted-foreground italic hidden lg:block">
            "One place. All PYQs. No distractions."
          </p>
          <ThemeToggle />
          <Button variant="outline" size="sm" className="hidden md:inline-flex">
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
