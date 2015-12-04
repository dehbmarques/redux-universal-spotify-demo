import { Map, List } from 'immutable';

const ADD_TO_QUEUE = 'redux-spotify-demo/player/ADD_TO_QUEUE';
const REMOVE_FROM_QUEUE = 'redux-spotify-demo/player/REMOVE_FROM_QUEUE';

const PLAY_TRACK = 'redux-spotify-demo/player/PLAY_TRACK';
const PLAY_NEXT = 'redux-spotify-demo/player/PLAY_NEXT';
const PLAY_PREV = 'redux-spotify-demo/player/PLAY_PREV';

const initialState = new Map({
  queue: new List()
});

const _addToQueue = (queue, track) => queue.includes(track) ? queue : queue.push(track);

export default function reducer (state = initialState, action = {}) {

  switch (action.type) {

    case ADD_TO_QUEUE:

      return state
        .update('queue', queue => _addToQueue(queue, action.track));

    case REMOVE_FROM_QUEUE:

      return state
        .update('queue', queue => queue.delete(queue.indexOf(action.track)));

    case PLAY_TRACK:

      return state
        .set('nowPlaying', action.track)
        .update('queue', queue => _addToQueue(queue, action.track));

    case PLAY_NEXT:

      let next = state.get('queue').indexOf(state.get('nowPlaying')) + 1;
      if (next >= state.get('queue').size) {
        next = 0;
      }

      return state.set('nowPlaying', state.get('queue').get(next));

    case PLAY_PREV:

      let prev = state.get('queue').indexOf(state.get('nowPlaying')) - 1;
      if (prev < 0) {
        prev = state.get('queue').size - 1;
      }

      return state.set('nowPlaying', state.get('queue').get(prev));

    default:
      return state;
  }
}


export function addToQueue (track) {

  return {
    type: ADD_TO_QUEUE,
    track
  };
}

export function removeFromQueue (track) {

  return {
    type: REMOVE_FROM_QUEUE,
    track
  };
}

export function playTrack (track) {

  return {
    type: PLAY_TRACK,
    track
  };
}

export function playNext () {

  return {
    type: PLAY_NEXT
  };
}

export function playPrev () {

  return {
    type: PLAY_PREV
  };
}
