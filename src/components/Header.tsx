import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '../contexts/SupabaseAuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { profile, signOut, isAdmin } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

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
    <header className="bg-nav-background text-nav-text shadow-sm border-b">
      {/* Brand logos section - inspired by The United Family */}
      <div className="border-b bg-white py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-gray-500 text-sm font-medium">The</span>
              <span className="text-3xl font-bold text-primary">United Family</span>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-sm">
              <span className="text-primary font-semibold px-3 py-1 bg-primary/10 rounded">Family Dashboard</span>
              <span className="text-secondary font-semibold px-3 py-1 bg-secondary/10 rounded">Community</span>
              <span className="text-accent font-semibold px-3 py-1 bg-accent/10 rounded">Directory</span>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Welcome, {profile?.full_name}</span>
                {isAdmin && (
                  <Link to="/admin" className="text-primary hover:underline">
                    Admin
                  </Link>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-destructive hover:bg-destructive/10"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main navigation */}
      <div className="bg-gray-600 text-white px-4 py-3">
        <div className="container mx-auto">
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
                      className={`text-white hover:text-accent transition-colors duration-300 text-sm font-medium ${
                        isActive(item.path) ? 'text-accent' : ''
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
                    className="text-white hover:text-accent hover:bg-white/10"
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
              className="md:hidden text-white hover:text-accent"
              onClick={toggleMenu}
            >
              <i className="fas fa-bars text-lg"></i>
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 border-t border-white/20 pt-4">
              <ul className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`block text-white hover:text-accent transition-colors duration-300 text-sm font-medium py-1 ${
                        isActive(item.path) ? 'text-accent' : ''
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
                    className="text-white hover:text-accent hover:bg-white/10 justify-start px-0"
                    title="Updates"
                  >
                    <i className="fas fa-bell mr-2"></i>
                    Updates
                  </Button>
                </li>
                {isAdmin && (
                  <li>
                    <Link
                      to="/admin"
                      className="block text-white hover:text-accent transition-colors duration-300 text-sm font-medium py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  </li>
                )}
                <li>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-white hover:text-accent hover:bg-white/10 justify-start px-0"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i>
                    Logout
                  </Button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;