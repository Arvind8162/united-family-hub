import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="text-lg font-semibold text-primary mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                  About
                </Link>
              </li>
              <li>
                <Link to="/directory" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                  Directory
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                  Events
                </Link>
              </li>
            </ul>
          </div>

          {/* About Section */}
          <div className="footer-section">
            <h3 className="text-lg font-semibold text-primary mb-4">About Our Samaj</h3>
            <p className="text-muted-foreground leading-relaxed">
              We are a united community preserving values, celebrating culture, and supporting each other through digital connection.
            </p>
          </div>

          {/* Contact Section */}
          <div className="footer-section">
            <h3 className="text-lg font-semibold text-primary mb-4">Contact With Us</h3>
            <div className="text-muted-foreground space-y-2">
              <p className="flex items-center gap-2">
                <i className="fas fa-envelope text-primary"></i>
                <a href="mailto:info@samaj.org" className="hover:text-primary transition-colors duration-300">
                  info@samaj.org
                </a>
              </p>
              <p className="flex items-center gap-2">
                <i className="fas fa-phone text-primary"></i>
                <a href="tel:+919876543210" className="hover:text-primary transition-colors duration-300">
                  +91-98765 43210
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; 2025 Family Dashboard. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;