import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import cvFormReducer from '../features/cvForm/cvFormSlice';
import adminReducer from '../features/admin/adminSlice';
import resumeReducer from '../features/resume/resumeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cvForm: cvFormReducer,
    admin: adminReducer,
    resume: resumeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

