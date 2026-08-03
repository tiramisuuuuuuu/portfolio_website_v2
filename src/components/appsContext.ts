import { createContext } from 'react';

export const AppsContext = createContext({
  openApp: (app: 'terminal' | 'photos') => {},
  closeApp: (app: 'terminal' | 'photos') => {},
});
