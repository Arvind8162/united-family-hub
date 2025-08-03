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
    <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:bg-gray-50 hover:-translate-y-3 border border-gray-100">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center group-hover:from-secondary group-hover:to-accent transition-all duration-300 shadow-lg">
          <i className={`${icon} text-2xl text-white group-hover:text-primary transition-colors duration-300`}></i>
        </div>
        <span className="block text-lg font-bold text-gray-800 group-hover:text-primary transition-colors duration-300">
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