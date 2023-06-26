import { ClientFunction } from 'testcafe';

export const getPathname = ClientFunction(() => window.location.pathname);
