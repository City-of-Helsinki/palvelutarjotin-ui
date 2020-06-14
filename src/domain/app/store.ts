import { configureStore, getDefaultMiddleware, Store } from '@reduxjs/toolkit';

import reducer from './reducers';

const store: Store = configureStore({
  devTools: true,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
  reducer,
});

export { store };
