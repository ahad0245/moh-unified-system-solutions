import React from 'react';
import BotpressWebchat from '../components/BotpressWebchat';

const AdvanceBotPage: React.FC = () => {
  const advanceBotScripts = [
    'https://cdn.botpress.cloud/webchat/v2.2/inject.js',
    'https://files.bpcontent.cloud/2025/01/20/14/20250120140504-UZOZ5RMR.js',
  ];

  return (
    <div className="container mx-auto p-8 text-center h-[calc(100vh-200px)]">
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Advance Health Bot</h1>
      <p className="text-gray-600 dark:text-slate-300 mb-8">This bot supports Arabic for seamless communication.</p>
      <img className="mx-auto  w-80" src="./components/img/logo.png" alt="" />
      <BotpressWebchat scripts={advanceBotScripts} />
    </div>
  );
};

export default AdvanceBotPage;