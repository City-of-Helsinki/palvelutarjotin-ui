import { useRouter } from 'next/router';
import React from 'react';

/**
 * Custom React hook to manually fix scroll restoration and returnPath issues when a URL contains a hash.
 * The URL hash is needed for scroll restoration (e.g. when navigating back to event search page).
 * However, since the UI uses returnPath-parameter in the URL to initialize a back arrow -button in UI,
 * the hash is needed to be removed in order to get that feature to work.
 *
 * Next.js automatically scrolls to the element specified by the hash in the URL.
 * This hook removes the hash from the URL using a shallow router replace.
 *
 * This is a workaround for potential issues where Next.js's built-in scroll restoration interferes with
 * custom scroll handling.
 *
 * @remarks
 * - This hook relies on the `next/router` module.
 * - It performs a shallow router replace, which means it updates the URL without triggering a full page reload.
 * - It logs a console message when a hash is detected and removed.
 * - Includes a workaround for a known Next.js router issue (https://github.com/vercel/next.js/issues/37362)
 * to prevent uncaught promise rejections.
 * - This hook should be used within a React functional component.
 */
function useHashlessReturnPathScrollFix() {
  const router = useRouter();
  React.useEffect(() => {
    const [, hash] = router.asPath.split('#');
    if (router && hash) {
      // eslint-disable-next-line no-console
      console.info(
        'URL contains hash which will now be removed with a shallow router.replace'
      );
      router
        .replace(
          {
            hash: undefined,
          },
          undefined,
          { shallow: true }
        )
        .catch((e) => {
          // workaround for https://github.com/vercel/next.js/issues/37362
          if (!e.cancelled) {
            throw e;
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default useHashlessReturnPathScrollFix;
