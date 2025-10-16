import React from 'react';
import BotpressWebchat from '../components/BotpressWebchat';

const TraditionalBotPage: React.FC = () => {
  const traditionalBotScripts = [
    'https://cdn.botpress.cloud/webchat/v2.2/inject.js',
    'https://files.bpcontent.cloud/2025/01/16/07/20250116070617-HY2WY6Q5.js',
  ];

  return (
    <div className="container mx-auto p-8 text-center h-[calc(100vh-200px)]">
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Traditional Health Bot</h1>
      <p className="text-gray-600 dark:text-slate-300 mb-8">This bot communicates in English for straightforward support.</p>
            <img className="mx-auto  w-80" src="./components/img/logo.png" alt="" />

      <BotpressWebchat scripts={traditionalBotScripts} />
    </div>
  );
};

export default TraditionalBotPage;