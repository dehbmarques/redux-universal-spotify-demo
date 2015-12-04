import { createSelector } from 'reselect';
import { denormalizePagination } from '../redux/modules/entities';

const _albumSelector = (state, props) => state.entities.getIn(['album', props.albumId]);
const _tracksSelector = (state, props) => denormalizePagination(state, `albums/${props.albumId}/tracks`);
const _artistsSelector = (state, props) => {
  const artists = state.entities.getIn(['album', props.albumId, 'artists']);
  return artists && artists.map(id => state.entities.getIn(['artist', id]));
};

const _playerSelector = state => state.player;
const _nowPlayingSelector = state => _playerSelector(state).get('nowPlaying');

export const albumSelector = createSelector(
  _albumSelector,
  _tracksSelector,
  _artistsSelector,
  _nowPlayingSelector,
  (album, tracks, artists, nowPlaying) => {

    return {
      album,
      tracks,
      artists,
      nowPlaying
    };
  }
);
