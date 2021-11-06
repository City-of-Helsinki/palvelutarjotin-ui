import { Router, useRouter } from 'next/router';
import * as React from 'react';

const FocusToTop: React.FC = () => {
  const focusRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  const routerRef = React.useRef(router);
  const previousPathRef = React.useRef<string | null>();
  routerRef.current = router;

  const handleFocus = () => {
    const currentPath = routerRef.current.asPath.split('?')[0];
    const previousPath = previousPathRef.current;

    // Do checking to prevent scroll top or focus reset for example on
    // events search page
    if (currentPath !== previousPath) {
      focusRef.current?.focus();
    }
  };

  const savePreviousPath = () => {
    previousPathRef.current = routerRef.current.asPath.split('?')[0];
  };

  React.useEffect(() => {
    Router.events.on('routeChangeComplete', handleFocus);
    Router.events.on('beforeHistoryChange', savePreviousPath);
    return () => {
      Router.events.off('routeChangeComplete', handleFocus);
      Router.events.off('beforeHistoryChange', savePreviousPath);
    };
  }, []);

  return <div ref={focusRef} tabIndex={-1} />;
};

export default FocusToTop;
