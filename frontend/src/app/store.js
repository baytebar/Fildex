import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import cvFormReducer from '../features/cvForm/cvFormSlice';
import adminReducer from '../features/admin/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cvForm: cvFormReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// TypeScript types (only used in TypeScript files)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
