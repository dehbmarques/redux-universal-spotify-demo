import flatten from 'lodash/array/flatten';

/**
  * 1. Skip holes in route component chain and
  * only consider components that implement
  * fetchData or fetchDataDeferred
  *
  * 2. Pull out fetch data methods
  *
  * 3. Call fetch data methods and gather promises
  */
export default (components, getState, dispatch, location, params, deferred) => {

  const methodName = deferred ? 'fetchDataDeferred' : 'fetchData';

  const fetches = components
    .filter((component) => component && component[methodName]) // 1
    .map((component) => component[methodName]); // 2

  return flatten(fetches)
    .map(fetchData => fetchData(getState, dispatch, location, params)); // 3
};
