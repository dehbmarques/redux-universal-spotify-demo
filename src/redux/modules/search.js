import { Map } from 'immutable';

const SEARCH = 'redux-spotify-demo/entities/SEARCH';
const SEARCH_SUCCESS = 'redux-spotify-demo/entities/SEARCH_SUCCESS';
const SEARCH_FAIL = 'redux-spotify-demo/entities/SEARCH_FAIL';

export default function reducer (state = new Map(), action = {}) {

  switch (action.type) {
    case SEARCH:
      return state
        .set('query', action.query)
        .setIn([action.query, 'isSearching'], true);
    case SEARCH_SUCCESS:
    case SEARCH_FAIL:
      return state.setIn([action.query, 'isSearching'], false);
    default:
      return state;
  }
}

export function search (query) {

  return {
    query,
    types: [SEARCH, SEARCH_SUCCESS, SEARCH_FAIL],
    promise: (client) => client.search(query)
  };
}
