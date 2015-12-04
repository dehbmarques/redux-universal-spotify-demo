import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { isFullyLoaded, isAlbumsLoaded, loadById, loadAlbums } from '../redux/modules/artist';
import { loadNextPage } from '../redux/modules/entities';
import connectData from '../helpers/connectData';
import { artistSelector } from '../selectors/artistSelector';
import { Cover, List } from '../components';

const styles = {
  albumContainer: {
    textAlign: 'center'
  },
  albumTitle: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  albumCover: {
    height: 150
  }
};

@connectData(null, [(getState, dispatch) => {
  const state = getState();
  const { id } = state.router.params;
  if (!isFullyLoaded(state, id)) {
    return dispatch(loadById(id));
  }
}, (getState, dispatch) => {
  const state = getState();
  const { id } = state.router.params;
  if (!isAlbumsLoaded(state, id)) {
    return dispatch(loadAlbums(id));
  }
}])
@connect(state => {

  const { id: artistId } = state.router.params;

  return {
    artistId
  };
})
@connect(artistSelector, {
  loadNextPage
})
export default class Artist extends Component {

  static propTypes = {
    artist: PropTypes.instanceOf(Map),
    albums: PropTypes.instanceOf(Map),
    loadNextPage: PropTypes.func.isRequired
  }

  loadNextPage () {

    const { albums } = this.props;
    return this.props.loadNextPage(albums.get('ref'), albums.get('next'));
  }

  renderAlbum (album) {

    return (
      <div key={album.get('id')} className="col-xs-3" style={ styles.albumContainer }>

        <Link to={`/album/${album.get('id')}`}>
          <Cover url={ album.getIn(['images', 0, 'url']) } style={ styles.albumCover } />
          <h4 style={ styles.albumTitle }>
            { album.get('name') }
          </h4>
        </Link>

      </div>
    );
  }

  renderAlbums (albums) {

    return (
      <List
        items={ albums.get('items') }
        renderItem={ this.renderAlbum }
        onLoadMoreClick={ this.loadNextPage.bind(this) }
        isLastPage={ albums.get('next') === null }
        isFetching={ albums.get('isFetching') } />
    );
  }

  render () {

    const { artist, albums } = this.props;

    if (!artist || !albums) {
      return <div>loading</div>;
    }

    return (
      <div>

        <h3>Artist</h3>

        <div className="row">
          <div className="col-md-2">
            <Cover url={ artist.getIn(['images', 0, 'url']) } />
          </div>
          <div className="col-md-10">
            <h2>{ artist.get('name') }</h2>
            <small>{ artist.get('genres').join(' / ') }</small>
          </div>
        </div>

        <hr />

        { this.renderAlbums(albums) }

      </div>
    );
  }
}
