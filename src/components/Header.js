import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { Button } from "@/components/ui/button";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      
      // Determine if scrolled for styling
      setScrolled(currentScrollPos > 10);
      
      // Hide/show header based on scroll direction
      const isScrollingDown = prevScrollPos < currentScrollPos;
      const isScrollingUpEnough = prevScrollPos - currentScrollPos > 10;
      
      // Only hide header when scrolling down and not at the top
      // Always show when scrolling up significantly
      setVisible(currentScrollPos < 10 || isScrollingUpEnough || !isScrollingDown);
      
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header 
      className={`border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ${
        scrolled ? 'shadow-md' : 'shadow-sm'
      } ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{ height: 'var(--header-height)' }}
    >
      <div className="container mx-auto px-4 h-full flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link 
            href="/" 
            className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
          >
            CSIT PYQs Portal
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 nav-link-hover"
            >
              Home
            </Link>
            <Link 
              href="/results" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 nav-link-hover"
            >
              Browse Papers
            </Link>
            <Link 
              href="/upload" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 nav-link-hover"
            >
              Upload
            </Link>
            <Link 
              href="/admin" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 nav-link-hover"
            >
              Admin
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-sm text-muted-foreground italic hidden xl:block">
            "One place. All PYQs. No distractions."
          </p>
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden h-9 w-9 p-0" 
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden border-t border-border/40 bg-background mobile-menu-slide ${
          mobileMenuOpen ? 'open' : 'closed'
        }`}
        style={{ display: mobileMenuOpen ? 'block' : 'none' }}
      >
        <div className="p-4">
          <nav className="flex flex-col space-y-3">
            <Link 
              href="/results" 
              className="text-sm font-medium text-foreground hover:text-primary transition-colors px-2 py-2 rounded-md hover:bg-muted/50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/upload" 
              className="text-sm font-medium text-foreground hover:text-primary transition-colors px-2 py-2 rounded-md hover:bg-muted/50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Upload
            </Link>
            <Link 
              href="/admin" 
              className="text-sm font-medium text-foreground hover:text-primary transition-colors px-2 py-2 rounded-md hover:bg-muted/50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
