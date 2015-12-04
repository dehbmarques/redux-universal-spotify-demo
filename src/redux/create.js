import { createStore as _createStore, applyMiddleware } from 'redux';
import { fromJS } from 'immutable';
import createMiddleware from './middleware/clientMiddleware';
import transitionMiddleware from './middleware/transitionMiddleware';

export default function createStore (reduxReactRouter, getRoutes, createHistory, client, data) {

  if (data && data.entities) {

    data.entities = fromJS(data.entities);
    data.search = fromJS(data.search);
    data.player = fromJS(data.player);
  }

  const middleware = [createMiddleware(client), transitionMiddleware];

  const finalCreateStore = reduxReactRouter({ getRoutes, createHistory })(
    applyMiddleware(...middleware)(_createStore)
  );

  const reducer = require('./modules/reducer');
  const store = finalCreateStore(reducer, data);

  if (module.hot) {
    module.hot.accept('./modules/reducer', () => {
      store.replaceReducer(require('./modules/reducer'));
    });
  }

  return store;
}
