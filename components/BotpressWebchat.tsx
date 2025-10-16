import React, { useEffect } from 'react';

interface BotpressWebchatProps {
  scripts: string[];
}

const BotpressWebchat: React.FC<BotpressWebchatProps> = ({ scripts }) => {
  useEffect(() => {
    const addedScripts: HTMLScriptElement[] = [];
    scripts.forEach((src, index) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.id = `botpress-script-${index}`;
      document.body.appendChild(script);
      addedScripts.push(script);
    });

    return () => {
      addedScripts.forEach(script => {
        const el = document.getElementById(script.id);
        if (el) {
          document.body.removeChild(el);
        }
      });
      // Botpress might leave elements behind, let's clean them too.
      const botpressContainer = document.querySelector('.bp-widget-container');
      if (botpressContainer) {
        botpressContainer.remove();
      }
    };
  }, [scripts]);

  return <div id="botpress-webchat-container" className="h-full w-full"></div>;
};

export default BotpressWebchat;
