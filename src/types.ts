import rootReducer from './domain/app/reducers';

export type OptionType = {
  label: string;
  value: string;
};

export type Language = 'en' | 'fi' | 'sv';

export type RootState = ReturnType<typeof rootReducer>;
