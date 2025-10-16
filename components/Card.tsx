import React from 'react';
import { Link } from 'react-router-dom';

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkTo: string;
}

const Card: React.FC<CardProps> = ({ icon, title, description, linkTo }) => {
  return (
    <div className="bg-white dark:bg-brand-secondary rounded-lg shadow-lg p-8 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 w-full max-w-sm">
      <div className="bg-gray-100 dark:bg-slate-700 rounded-full p-4 mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
      <p className="text-gray-600 dark:text-slate-300 mb-6 flex-grow">{description}</p>
      <Link
        to={linkTo}
        className="mt-auto text-brand-accent font-semibold hover:text-sky-500 dark:hover:text-sky-300 transition-colors"
      >
        Read More &rarr;
      </Link>
    </div>
  );
};

export default Card;