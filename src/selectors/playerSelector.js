import { createSelector } from 'reselect';

const _playerSelector = state => state.player;
const _nowPlayingSelector = state => _playerSelector(state).get('nowPlaying');
const _queueSelector = state => _playerSelector(state).get('queue');

export const playerSelector = createSelector(
  _nowPlayingSelector,
  _queueSelector,
  (nowPlaying, queue) => {

    return {
      nowPlaying,
      queue
    };
  }
);
