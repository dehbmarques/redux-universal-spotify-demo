import React, { Component, PropTypes } from 'react';
import { Map, List as ImmutableList } from 'immutable';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Cover, List } from '../components';
import { isFullyLoaded, isTracksLoaded, loadById, loadTracks } from '../redux/modules/album';
import { loadNextPage } from '../redux/modules/entities';
import { playTrack, addToQueue } from '../redux/modules/player';
import { albumSelector } from '../selectors/albumSelector';
import connectData from '../helpers/connectData';

@connectData(null, [(getState, dispatch) => {
  const state = getState();
  const { id } = state.router.params;
  if (!isFullyLoaded(state, id)) {
    return dispatch(loadById(id));
  }
}, (getState, dispatch) => {
  const state = getState();
  const { id } = state.router.params;
  if (!isTracksLoaded(state, id)) {
    return dispatch(loadTracks(id));
  }
}])
@connect(state => {

  const { id: albumId } = state.router.params;

  return {
    albumId
  };
})
@connect(albumSelector, {
  loadNextPage,
  playTrack,
  addToQueue
})
export default class Album extends Component {

  static propTypes = {
    album: PropTypes.instanceOf(Map),
    artists: PropTypes.instanceOf(ImmutableList),
    nowPlaying: PropTypes.instanceOf(Map),
    tracks: PropTypes.instanceOf(Map),
    loadNextPage: PropTypes.func.isRequired,
    playTrack: PropTypes.func.isRequired,
    addToQueue: PropTypes.func.isRequired
  }

  loadMoreTracks () {

    const { tracks } = this.props;
    this.props.loadNextPage(tracks.get('ref'), tracks.get('next'));
  }

  renderTrack (track) {

    const { playTrack: _playTrack, addToQueue: _addToQueue, nowPlaying } = this.props;

    const isPlaying = nowPlaying && nowPlaying.get('id') === track.get('id');

    return (
      <div key={ track.get('id') } style={{ marginBottom: 5 }}>

        <button className="btn btn-default" onClick={ () => _playTrack(track) }>
          <i className={ `fa fa-${isPlaying ? 'pause' : 'play'}-circle-o` } />
        </button>

        <button
          className="btn btn-default"
          onClick={ () => _addToQueue(track) }
          style={{ margin: '0px 5px' }}>
          <i className="fa fa-plus" />
        </button>

        { track.get('trackNumber') + ' - ' + track.get('name') }

      </div>
    );
  }

  renderTracks (tracks) {

    if (tracks) {
      return (
        <List
          items={ tracks.get('items') }
          renderItem={ this.renderTrack.bind(this) }
          onLoadMoreClick={ this.loadMoreTracks.bind(this) }
          isLastPage={ tracks.get('next') === null }
          isFetching={ tracks.get('isFetching') } />
      );
    }

    return <div>loading</div>;
  }

  renderArtists (artists) {

    if (artists) {

      return (
        <h4>
          by { artists.map(artist => (
            <Link key={ artist.get('id') } to={ `/artist/${artist.get('id')}` }>
              { artist.get('name') }
            </Link>
          )) }
        </h4>
      );
    }
  }

  render () {

    const { album, artists, tracks } = this.props;

    if (!album) {

      return <div>loading</div>;
    }

    return (
      <div>

        <h3>Album</h3>

        <div className="row">
          <div className="col-md-2">
            <Cover url={ album.getIn(['images', 0, 'url']) } />
          </div>
          <div className="col-md-10">
            <h2>{ album.get('name') }</h2>
            { this.renderArtists(artists) }
            <small>{ album.get('releaseDate') }</small>
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-md-12">
            { this.renderTracks(tracks) }
          </div>
        </div>

      </div>
    );
  }
}
