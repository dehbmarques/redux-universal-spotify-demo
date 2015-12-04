import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';

const styles = {
  audioControl: {
    position: 'relative',
    top: 10
  }
};
export default class PlayerControl extends Component {

  static propTypes = {
    nowPlaying: PropTypes.instanceOf(Map),
    onClickPlayNext: PropTypes.func.isRequired,
    onClickPlayPrev: PropTypes.func.isRequired
  }

  render () {

    const { nowPlaying, onClickPlayNext, onClickPlayPrev } = this.props;

    const previewUrl = nowPlaying && nowPlaying.get('previewUrl');
    const trackName = nowPlaying && nowPlaying.get('name');

    return (
      <div>

        <button className="btn btn-link" onClick={ onClickPlayPrev }>
          <i className="fa fa-step-backward" />
        </button>

        <audio ref="audio" src={ previewUrl } style={ styles.audioControl } controls="true" autoPlay="true" />

        <button className="btn btn-link" onClick={ onClickPlayNext }>
          <i className="fa fa-step-forward" />
        </button>

        { trackName }

      </div>
    );
  }
}
