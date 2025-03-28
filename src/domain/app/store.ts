import { configureStore, Store } from '@reduxjs/toolkit';

import reducer from './reducers';

const store: Store = configureStore({
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  reducer,
});

export { store };
