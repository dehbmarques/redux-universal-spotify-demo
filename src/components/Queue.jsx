import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { List } from 'immutable';

const styles = {
  queue: {
    backgroundColor: '#fff',
    border: '1px solid #e7e7e7',
    position: 'fixed',
    width: 270,
    bottom: 49,
    right: 0
  },
  queueTitle: {
    backgroundColor: '#ddd',
    margin: 0,
    padding: 5
  },
  queueList: {
    margin: 5,
    maxHeight: 200,
    overflowY: 'scroll'
  },
  removeFromQueueButton: {
    border: 'none',
    float: 'right'
  }
};

@Radium
export default class Queue extends Component {

  static propTypes = {
    queue: PropTypes.instanceOf(List),
    onClickTrack: PropTypes.func.isRequired,
    onClickRemoveFromQueue: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);

    this.state = {
      queueVisible: false
    };
  }

  toggleQueue (e) {

    const { offsetLeft } = e.target;

    this.setState({
      queueVisible: !this.state.queueVisible,
      offsetLeft: offsetLeft - 50
    });
  }

  render () {

    const { queue, onClickTrack, onClickRemoveFromQueue } = this.props;
    const { queueVisible, offsetLeft } = this.state;

    let list;
    if (queue && queueVisible) {
      list = (
        <div style={ [styles.queue, { left: offsetLeft }] }>

          <h4 style={ styles.queueTitle }>{ queue.size } songs</h4>

          <ul className="list-unstyled" style={ styles.queueList }>
            {
              queue
                .map(track => (
                  <li key={ track.get('id') } className="clearfix">
                    <button className="btn btn-link" onClick={ () => onClickTrack(track) }>
                      { track.get('name') }
                    </button>
                    <button
                      className="btn btn-default"
                      style={ styles.removeFromQueueButton }
                      onClick={ () => onClickRemoveFromQueue(track) }>
                      <i className="fa fa-trash" />
                    </button>
                  </li>
                ))
            }
          </ul>
        </div>
      );
    }

    return (
      <div>
        { list }
        <button className="btn btn-link" onClick={ this.toggleQueue.bind(this) }>
          <i className="fa fa-list" />
        </button>
      </div>
    );
  }
}
