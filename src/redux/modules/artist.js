const LOAD = 'redux-spotify-demo/artist/LOAD';
const LOAD_SUCCESS = 'redux-spotify-demo/artist/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-spotify-demo/artist/LOAD_FAIL';

const LOAD_ALBUMS = 'redux-spotify-demo/artist/LOAD_ALBUMS';
const LOAD_ALBUMS_SUCCESS = 'redux-spotify-demo/artist/LOAD_ALBUMS_SUCCESS';
const LOAD_ALBUMS_FAIL = 'redux-spotify-demo/artist/LOAD_ALBUMS_FAIL';

export function isLoaded (globalState, id) {

  return globalState.entities && globalState.entities.hasIn(['artist', id]);
}

export function isFullyLoaded (globalState, id) {

  if (isLoaded(globalState, id)) {
    return false;
  }

  return globalState.entities.hasIn(['artist', id, 'images']);
}

export function isAlbumsLoaded (globalState, id) {

  return globalState.entities &&
    globalState.entities.hasIn(['pagination', `artists/${id}/albums`]);
}

export function loadById (id) {

  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.getAndNormalize(`artists/${id}`)
  };
}

export function loadAlbums (id) {

  return {
    types: [LOAD_ALBUMS, LOAD_ALBUMS_SUCCESS, LOAD_ALBUMS_FAIL],
    promise: (client) => client.getAndNormalize(`artists/${id}/albums`)
  };
}
