import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import entities from './entities';
import search from './search';
import player from './player';

export default combineReducers({
  router: routerStateReducer,
  entities,
  search,
  player
});
