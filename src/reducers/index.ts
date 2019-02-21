import { combineReducers } from 'redux';

import gongReducer from './gongReducer';

export default combineReducers({
  gong: gongReducer,
});
