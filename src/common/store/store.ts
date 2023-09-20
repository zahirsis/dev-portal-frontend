import { configureStore } from '@reduxjs/toolkit';

import setupCiCd from '@/common/store/slices/setup-ci-cd';
const store = configureStore({
    reducer: {
        SetupCiCd: setupCiCd,
    },
});
export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
