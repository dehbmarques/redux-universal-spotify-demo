import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

const styles = {
  base: {
    maxWidth: '100%'
  }
};

@Radium
export default class Cover extends Component {

  static propTypes = {
    url: PropTypes.string.isRequired,
    style: PropTypes.object
  }

  render () {

    const { url, style } = this.props;

    return <img src={url} style={ [ styles.base, style ] } />;
  }
}
