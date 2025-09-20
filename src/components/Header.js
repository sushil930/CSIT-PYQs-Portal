import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { Button } from "@/components/ui/button";
import { 
  Bars3Icon, 
  XMarkIcon, 
  HomeIcon,
  DocumentTextIcon,
  CloudArrowUpIcon,
  Cog6ToothIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const mobileMenuRef = useRef(null);
  const mobileButtonRef = useRef(null);

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && 
          mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target) &&
          mobileButtonRef.current &&
          !mobileButtonRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/results', label: 'Browse Papers', icon: DocumentTextIcon },
    { href: '/upload', label: 'Upload', icon: CloudArrowUpIcon },
    { href: '/admin', label: 'Admin', icon: Cog6ToothIcon },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 transition-all duration-500 ease-out ${
        scrolled 
          ? 'shadow-lg bg-background/95 backdrop-blur-xl border-border/60' 
          : 'shadow-sm bg-background/80 backdrop-blur-md'
      } ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <Link 
              href="/" 
              className="flex items-center space-x-3 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
                <AcademicCapIcon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  CSIT PYQs
                </span>
                <span className="text-xs text-muted-foreground font-medium -mt-1 hidden sm:block">
                  Previous Year Questions
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className="group flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200 relative overflow-hidden"
                >
                  <IconComponent className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                  <span>{item.label}</span>
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary to-primary/80 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:block">
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-muted/40 border border-border/40">
                <div className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-muted-foreground">
                  Live Portal
                </span>
              </div>
            </div>
            <ThemeToggle />
            <Button 
              ref={mobileButtonRef}
              variant="ghost" 
              size="sm" 
              className="md:hidden h-10 w-10 rounded-lg border border-border/40 hover:bg-muted/60 hover:border-border/60 transition-all duration-200" 
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-5 w-5" />
              ) : (
                <Bars3Icon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        ref={mobileMenuRef}
        className={`md:hidden absolute left-0 right-0 top-full bg-background/95 backdrop-blur-xl border-t border-border/40 shadow-2xl transition-all duration-300 ease-out ${
          mobileMenuOpen 
            ? 'opacity-100 translate-y-0 visible' 
            : 'opacity-0 -translate-y-2 invisible'
        }`}
        style={{ 
          zIndex: 40,
        }}
      >
        <div className="p-6 bg-gradient-to-b from-background/95 to-background/98">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className="group flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:text-primary transition-all duration-200 hover:bg-muted/60 active:bg-muted border border-transparent hover:border-border/30 hover:shadow-sm"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    animationDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms'
                  }}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/60 group-hover:bg-primary/10 transition-colors duration-200">
                    <IconComponent className="h-4 w-4 group-hover:text-primary transition-colors duration-200" />
                  </div>
                  <span className="flex-1">{item.label}</span>
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </Link>
              );
            })}
          </nav>
          
          <div className="mt-6 pt-4 border-t border-border/30">
            <div className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-muted/40">
              <div className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-muted-foreground">
                Live Portal - All systems operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
