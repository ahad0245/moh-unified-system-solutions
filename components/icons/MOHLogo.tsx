import React from 'react';

export const MOHLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 2L1 9l4 1.5V15h2V10.5l5 2.5 5-2.5V15h2V10.5L23 9l-11-7zm0 10.5L6.5 9.5l5.5-2.5 5.5 2.5L12 12.5zM3 17v2h18v-2H3z" />
  </svg>
);
