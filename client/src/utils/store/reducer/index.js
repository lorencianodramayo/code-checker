// Redux
import { combineReducers } from '@reduxjs/toolkit';
// Reducers
import platformReducer from 'utils/store/reducer/platform';
import codeReducer from 'utils/store/reducer/code';

const rootReducer = combineReducers({
  platform: platformReducer,
  code: codeReducer,
});

export default rootReducer;
