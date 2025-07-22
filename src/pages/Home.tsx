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
  ];

  const handleCardClick = (title: string) => {
    toast({
      title: `${title} Section`,
      description: `Welcome to the ${title} section. This feature will be available soon!`,
    });
  };

  return (
    <main className="min-h-screen bg-dashboard-bg">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Family Dashboard</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Welcome to our community platform. Connect, share, and grow together.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {dashboardItems.map((item, index) => (
            <DashboardCard
              key={index}
              icon={item.icon}
              title={item.title}
              path={item.path}
              onClick={() => handleCardClick(item.title)}
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