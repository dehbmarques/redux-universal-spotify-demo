import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';
import { playerSelector } from '../selectors/playerSelector';
import { playTrack, playNext, playPrev, removeFromQueue } from '../redux/modules/player';
import { Queue, PlayerControl } from '../components';

const styles = {
  playerContainer: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    height: 50,
    backgroundColor: '#f8f8f8',
    borderTop: '1px solid #e7e7e7'
  },
  playerControl: {
    display: 'inline-block'
  }
};

@connect(playerSelector, {
  playTrack,
  playNext,
  playPrev,
  removeFromQueue
})
export default class Player extends Component {

  static propTypes = {
    nowPlaying: PropTypes.instanceOf(Map),
    queue: PropTypes.instanceOf(List),
    playTrack: PropTypes.func.isRequired,
    playNext: PropTypes.func.isRequired,
    playPrev: PropTypes.func.isRequired,
    removeFromQueue: PropTypes.func.isRequired
  }

  renderControl () {

    const { nowPlaying, playPrev: _playPrev, playNext: _playNext } = this.props;

    if (nowPlaying) {

      return (
        <span>
          <button className="btn btn-link" onClick={ _playPrev }>
            <i className="fa fa-step-backward" />
          </button>
          <audio src={ nowPlaying.get('previewUrl') } controls="true" autoPlay="true" />
          <button className="btn btn-link" onClick={ _playNext }>
            <i className="fa fa-step-forward" />
          </button>
        </span>
      );
    }
  }

  render () {

    return (
      <div style={ styles.playerContainer }>
        <div className="container">
          <div style={ styles.playerControl }>
            <PlayerControl
              nowPlaying={ this.props.nowPlaying }
              onClickPlayNext={ this.props.playNext }
              onClickPlayPrev={ this.props.playPrev }
              />
          </div>
          <div style={ styles.playerControl }>
            <Queue
              queue={ this.props.queue }
              onClickTrack={ this.props.playTrack }
              onClickRemoveFromQueue={ this.props.removeFromQueue } />
          </div>
        </div>
      </div>
    );
  }
}
