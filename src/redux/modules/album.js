const LOAD = 'redux-spotify-demo/album/LOAD';
const LOAD_SUCCESS = 'redux-spotify-demo/album/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-spotify-demo/album/LOAD_FAIL';

const LOAD_TRACKS = 'redux-spotify-demo/album/LOAD_TRACKS';
const LOAD_TRACKS_SUCCESS = 'redux-spotify-demo/album/LOAD_TRACKS_SUCCESS';
const LOAD_TRACKS_FAIL = 'redux-spotify-demo/album/LOAD_TRACKS_FAIL';

export function isLoaded (globalState, id) {

  return globalState.entities && globalState.entities.hasIn(['album', id]);
}

export function isFullyLoaded (globalState, id) {

  if (isLoaded(globalState, id)) {
    return false;
  }

  return globalState.entities.hasIn(['album', id, 'artists']);
}

export function isTracksLoaded (globalState, id) {

  return globalState.entities &&
    globalState.entities.getIn(['pagination', `albums/${id}/tracks`]);
}

export function loadById (id) {

  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.getAndNormalize(`albums/${id}`)
  };
}

export function loadTracks (id) {

  return {
    types: [LOAD_TRACKS, LOAD_TRACKS_SUCCESS, LOAD_TRACKS_FAIL],
    promise: (client) => client.getAndNormalize(`albums/${id}/tracks`)
  };
}
