import React from 'react';
import Card from '../components/Card';
import { ChatBotIcon } from '../components/icons/ChatBotIcon';
import { AdminIcon } from '../components/icons/AdminIcon';

const LandingPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-16 text-center">
      <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
        Unified System Solutions
      </h1>
      <p className="text-lg text-gray-600 dark:text-slate-300 max-w-3xl mx-auto mb-16">
        Providing seamless and efficient healthcare assistance through advanced technology and streamlined administrative tools.
      </p>
      
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
        <Card
          icon={<ChatBotIcon className="w-8 h-8 text-brand-accent" />}
          title="Advance Bot"
          description="Advanced Health Bot supports Arabic, ensuring seamless communication for users, enhancing accessibility and providing efficient, personalized healthcare assistance."
          linkTo="/advance-bot"
        />
        <Card
          icon={<ChatBotIcon className="w-8 h-8 text-brand-accent" />}
          title="Traditional Bot"
          description="Traditional Health Bot communicates in English, offering straightforward support, efficient service, and personalized assistance for seamless healthcare transactions."
          linkTo="/traditional-bot"
        />
        <Card
          icon={<AdminIcon className="w-8 h-8 text-brand-accent" />}
          title="Admin Dashboard"
          description="Admin Dashboard enables efficient management, allowing administrators to approve, reject, or update the status of user requests seamlessly."
          linkTo="/login"
        />
      </div>
    </div>
  );
};

export default LandingPage;