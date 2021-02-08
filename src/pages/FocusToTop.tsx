import { Router } from 'next/router';
import * as React from 'react';

const FocusToTop: React.FC = () => {
  const focusRef = React.useRef<HTMLDivElement>(null);

  const handleFocus = () => focusRef.current?.focus();
  React.useEffect(() => {
    Router.events.on('routeChangeComplete', handleFocus);
    return () => {
      Router.events.off('routeChangeComplete', handleFocus);
    };
  }, []);

  return <div ref={focusRef} tabIndex={-1} />;
};

export default FocusToTop;
