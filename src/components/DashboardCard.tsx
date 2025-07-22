import React from 'react';
import { Link } from 'react-router-dom';

interface DashboardCardProps {
  icon: string;
  title: string;
  path?: string;
  onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, title, path, onClick }) => {
  const CardContent = () => (
    <div className="bg-card rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group hover:bg-card-hover hover:-translate-y-1">
      <div className="text-center">
        <i className={`${icon} text-3xl text-primary mb-3 group-hover:text-secondary transition-colors duration-300`}></i>
        <span className="block text-sm font-semibold text-card-foreground group-hover:text-primary transition-colors duration-300">
          {title}
        </span>
      </div>
    </div>
  );

  if (path) {
    return (
      <Link to={path} className="block">
        <CardContent />
      </Link>
    );
  }

  return (
    <div onClick={onClick}>
      <CardContent />
    </div>
  );
};

export default DashboardCard;