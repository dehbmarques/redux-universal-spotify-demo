import React, { Component, PropTypes } from 'react';
import SearchBar from './SearchBar.jsx';
import Player from './Player.jsx';

const styles = {
  app: {
    paddingTop: 70,
    paddingBottom: 70
  },
  header: {
    paddingTop: 7,
    width: '100%'
  }
};


export default class App extends Component {

  static propTypes = {
    children: PropTypes.object.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  render () {

    return (
      <div style={ styles.app }>

        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <div className="navbar-header" style={ styles.header }>
              <SearchBar />
            </div>
          </div>
        </nav>

        <div className="container">
          <div>
            { this.props.children }
          </div>
        </div>

        <Player />

      </div>
    );
  }
}
