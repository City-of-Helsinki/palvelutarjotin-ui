import React, { ReactElement } from 'react';

type Props = { className?: string };

export default ({ className = '' }: Props): ReactElement => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    className={className}
  >
    <g strokeWidth="1" fillRule="evenodd">
      {/* eslint-disable-next-line max-len */}
      <path d="M11.80416,-2.30926389e-13 C18.32352,-2.30926389e-13 23.60928,5.2848 23.60928,11.80416 C23.60928,18.32352 18.32352,23.60928 11.80416,23.60928 C5.2848,23.60928 -3.37507799e-14,18.32352 -3.37507799e-14,11.80416 C-3.37507799e-14,5.2848 5.2848,-2.30926389e-13 11.80416,-2.30926389e-13 Z M11.80416,2.5296 C6.6912,2.5296 2.53056,6.69024 2.53056,11.80416 C2.53056,16.91904 6.6912,21.07968 11.80416,21.07968 C16.91808,21.07968 21.07968,16.91904 21.07968,11.80416 C21.07968,6.69024 16.91808,2.5296 11.80416,2.5296 Z M13.068768,5.842464 L13.068768,11.280864 L16.665888,14.877024 L14.878368,16.665504 L10.539168,12.328224 L10.539168,5.842464 L13.068768,5.842464 Z"></path>
    </g>
  </svg>
);
