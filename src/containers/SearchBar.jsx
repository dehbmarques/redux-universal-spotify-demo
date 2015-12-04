import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import isEmpty from 'lodash/lang/isEmpty';
import { search } from '../redux/modules/search';
import { searchSelector } from '../selectors/searchSelector';

// TODO: use webpack-isomorphic-tools
if (__CLIENT__) {
  require('react-select/dist/react-select.css');
}

@connect(searchSelector, { pushState, search })
export default class SearchBar extends Component {

  static propTypes = {
    pushState: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    results: PropTypes.object
  }

  onChange (item) {

    this.props.pushState(null, `/${item.type}/${item.id}`);
  }

  onInputChange (value) {

    if (!isEmpty(value)) {
      this.props.search(value);
    }
  }

  renderOption (item) {

    return <div>{ item.name } ({ item.type })</div>;
  }

  render () {

    const { results } = this.props;

    return (
      <Select
        options={ results && results.toJS() }
        placeholder="Search..."
        onChange={ this.onChange.bind(this) }
        onInputChange={ this.onInputChange.bind(this) }
        optionRenderer={ this.renderOption }
        valueKey="id"
        labelKey="name" />
    );
  }
}
