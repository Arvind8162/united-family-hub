import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Events', path: '/events' },
    { label: 'My Family', path: '/family' },
    { label: 'Job', path: '/job' },
    { label: 'Donation', path: '/donation' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="bg-nav-background text-nav-text px-4 py-3 shadow-lg">
      <div className="flex justify-between items-center">
        <div className="text-lg font-medium">
          Hi, Meet
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex">
          <ul className="flex gap-6 items-center">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`text-nav-text hover:text-nav-hover transition-colors duration-300 text-sm font-medium ${
                    isActive(item.path) ? 'text-nav-hover' : ''
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Button
                variant="ghost"
                size="icon"
                className="text-nav-text hover:text-nav-hover hover:bg-primary-hover"
                title="Updates"
              >
                <i className="fas fa-bell"></i>
              </Button>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-nav-text hover:text-nav-hover"
          onClick={toggleMenu}
        >
          <i className="fas fa-bars text-lg"></i>
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden mt-4 border-t border-primary-hover pt-4">
          <ul className="flex flex-col gap-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`block text-nav-text hover:text-nav-hover transition-colors duration-300 text-sm font-medium py-1 ${
                    isActive(item.path) ? 'text-nav-hover' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Button
                variant="ghost"
                size="sm"
                className="text-nav-text hover:text-nav-hover hover:bg-primary-hover justify-start px-0"
                title="Updates"
              >
                <i className="fas fa-bell mr-2"></i>
                Updates
              </Button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;