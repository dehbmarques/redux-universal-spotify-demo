import { createSelector } from 'reselect';
import { denormalizePagination } from '../redux/modules/entities';

const _artistSelector = (state, props) => state.entities.getIn(['artist', props.artistId]);
const _albumsSelector = (state, props) => denormalizePagination(state, `artists/${props.artistId}/albums`);

export const artistSelector = createSelector(
  _artistSelector,
  _albumsSelector,
  (artist, albums) => {

    return {
      artist,
      albums
    };
  }
);
