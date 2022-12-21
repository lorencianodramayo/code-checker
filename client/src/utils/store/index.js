import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'utils/store/reducer';

const store = configureStore({
  reducer: rootReducer,
});

const reduxStore = {
  store,
};

export default reduxStore;
