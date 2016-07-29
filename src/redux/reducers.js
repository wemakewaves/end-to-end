import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';
import episodes from './modules/episodes';
import playing from './modules/playing';
// Import reducers below

export default combineReducers({
  // Add reducers below
  episodes,
  playing,
  reduxAsyncConnect,
  routing: routerReducer
});
