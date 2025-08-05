import React from 'react';
import DashboardCard from '../components/DashboardCard';
import { useToast } from '../hooks/use-toast';

const Home = () => {
  const { toast } = useToast();

  const dashboardItems = [
    { icon: 'fas fa-info-circle', title: 'About', path: '/about' },
    { icon: 'fas fa-users', title: 'My Family', path: '/family' },
    { icon: 'fas fa-address-book', title: 'Directory', path: '/directory' },
    { icon: 'fas fa-calendar-alt', title: 'Events', path: '/events' },
    { icon: 'fas fa-tags', title: 'Classified', path: '/classified' },
    { icon: 'fas fa-handshake', title: 'Community', path: '/community' },
    { icon: 'fas fa-briefcase', title: 'Job', path: '/job' },
    { icon: 'fas fa-shopping-cart', title: 'Buy/Sell', path: '/buy-sell' },
    { icon: 'fas fa-hand-holding-heart', title: 'Donation', path: '/donation' },
    { icon: 'fas fa-envelope', title: 'Contact', path: '/contact' },
    { icon: 'fas fa-images', title: 'Photo Gallery', path: '/gallery' },
    { icon: 'fas fa-user-circle', title: 'My Profile', path: '/profile' },
  ];

  const handleCardClick = (path: string) => {
    // Navigation is handled by Link in DashboardCard
  };

  return (
    <main className="min-h-screen bg-dashboard-bg">
      {/* Hero Section - inspired by The United Family */}
      <div className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-primary via-primary-hover to-primary rounded-3xl p-16 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="relative z-10">
                <h1 className="text-5xl md:text-7xl font-black mb-8">
                  WELCOME TO YOUR
                </h1>
                <div className="text-6xl md:text-9xl font-black mb-8 text-accent drop-shadow-lg">
                  FAMILY HUB
                </div>
                <p className="text-xl md:text-2xl mb-8 opacity-90 font-medium">
                  YOUR CENTRAL DASHBOARD FOR • FAMILY CONNECTIONS • COMMUNITY EVENTS • SHARED RESOURCES
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-6">
            FAMILY DASHBOARD
          </h2>
          <div className="w-32 h-2 bg-accent mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {dashboardItems.map((item, index) => (
            <DashboardCard
              key={index}
              icon={item.icon}
              title={item.title}
              path={item.path}
            />
          ))}
        </div>

        {/* Welcome Section */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <div className="bg-card rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-primary mb-4">Welcome to Our Samaj</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our digital platform brings our community together, making it easy to stay connected, 
              share important information, and support each other. Whether you're looking for events, 
              connecting with family members, or contributing to our community, you'll find everything you need here.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;