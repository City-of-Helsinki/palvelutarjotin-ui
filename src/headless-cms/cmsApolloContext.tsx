/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import * as React from 'react';

const CMSApolloContext =
  React.createContext<ApolloClient<NormalizedCacheObject> | null>(null);

const CMSApolloProvider: React.FC<{
  value: ApolloClient<NormalizedCacheObject>;
  children?: React.ReactNode;
}> = ({ children, value }) => {
  return (
    <CMSApolloContext.Provider value={value}>
      {children}
    </CMSApolloContext.Provider>
  );
};

export const useCMSClient = () => {
  const context = React.useContext(CMSApolloContext);

  if (context === undefined) {
    throw new Error('useCMSClient must be used within a CMSApolloProvider');
  }

  return context as ApolloClient<NormalizedCacheObject>;
};

export default CMSApolloProvider;
