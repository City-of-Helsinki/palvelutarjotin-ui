import rootReducer from './domain/app/reducers';

export type Language = 'en' | 'fi' | 'sv';

export type RootState = ReturnType<typeof rootReducer>;

export interface RouteComponent extends React.FC {
  getInitialProps?: () => Promise<{
    namespacesRequired: string[];
  }>;
}
