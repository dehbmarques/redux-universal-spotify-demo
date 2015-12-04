import React, { Component, PropTypes } from 'react';
import { List as ImmutableList } from 'immutable';

const styles = {
  loadMoreButton: {
    fontSize: '150%',
    marginTop: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block'
  }
};

export default class List extends Component {

  static propTypes = {
    items: PropTypes.instanceOf(ImmutableList).isRequired,
    renderItem: PropTypes.func.isRequired,
    onLoadMoreClick: PropTypes.func.isRequired,
    isLastPage: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired
  }

  static defaultProps = {
    isFetching: false
  }

  renderLoadMore () {

    const { isFetching, onLoadMoreClick, isLastPage } = this.props;

    if (isLastPage) {
      return <span />;
    }

    return (
      <button className="btn" style={ styles.loadMoreButton } onClick={ onLoadMoreClick } disabled={ isFetching }>
        { isFetching ? 'Loading...' : 'Load More' }
      </button>
    );
  }

  render () {

    const { isLastPage, items, renderItem } = this.props;

    const isEmpty = items.size === 0;
    if (isEmpty && isLastPage) {
      return <h1><i>Nothing here!</i></h1>;
    }

    return (
      <div>
        { items.map(renderItem) }
        { this.renderLoadMore() }
      </div>
    );
  }
}
