import React, { useContext } from 'react';
import type { Language, Menu } from 'react-helsinki-headless-cms';

export type NavigationContextProps = {
  headerMenu?: Menu;
  headerUniversalBarMenu?: Menu;
  footerMenu?: Menu;
  languages?: Language[];
};

const NavigationContext = React.createContext<NavigationContextProps>({});

export function useNavigationContext() {
  const context = useContext(NavigationContext);
  return context;
}

export default NavigationContext;
