import { createSelector } from 'reselect';

const _searchQuerySelector = state => state.search.get('query');
const _searchIsSearchingSelector = state => state.search.getIn([_searchQuerySelector(state), 'isSearching']);
const _searchResultsSelector = state => {
  const items = state.entities.getIn(['search', _searchQuerySelector(state), 'items']);
  return items && items.map(item =>
    state.entities.getIn([item.get('schema'), item.get('id')])
  );
};

export const searchSelector = createSelector(
  _searchQuerySelector,
  _searchIsSearchingSelector,
  _searchResultsSelector,
  (query, isSearching, results) => {

    return {
      query,
      isSearching,
      results
    };
  }
);
