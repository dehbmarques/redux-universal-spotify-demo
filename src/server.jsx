import Express from 'express';
import PrettyError from 'pretty-error';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.config';

import React from 'react';
import ReactDOM from 'react-dom/server';

import ApiClient from './helpers/ApiClient';
import createStore from './redux/create';
import Html from './containers/Html.jsx';

import { ReduxRouter } from 'redux-router';
import {reduxReactRouter, match} from 'redux-router/server';
import createHistory from 'history/lib/createMemoryHistory';
import { Provider } from 'react-redux';
import getRoutes from './routes.jsx';
import getStatusFromRoutes from './helpers/getStatusFromRoutes';


const pretty = new PrettyError();
const app = new Express();
const port = 3000;

const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

app.use((req, res) => {

  const client = new ApiClient(req);

  const store = createStore(reduxReactRouter, getRoutes, createHistory, client);

  function hydrateOnClient (component) {

    const html = (
      <Html
        component={component}
        store={store} />
    );

    res.send('<!doctype html>\n' + ReactDOM.renderToStaticMarkup(html));
  }

  store.dispatch(match(req.originalUrl, (error, redirectLocation, routerState) => {

    if (redirectLocation) {

      res.redirect(redirectLocation.pathname + redirectLocation.search);
    }
    else if (error) {

      console.error('ROUTER ERROR:', pretty.render(error));
      res.status(500);
      hydrateOnClient();
    }
    else if (!routerState) {

      res.status(500);
      hydrateOnClient();
    }
    else {

      store.getState().router.then(() => {

        const status = getStatusFromRoutes(routerState.routes);
        if (status) {
          res.status(status);
        }

        const component = (
          <Provider store={store} key="provider">
            <ReduxRouter />
          </Provider>
        );

        hydrateOnClient(component);
      })
      .catch(err => {

        console.error('DATA FETCHING ERROR:', pretty.render(err));
        res.status(500);
        hydrateOnClient();
      });
    }
  }));
});

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  }
  else {
    console.info(`==> Listening on http://localhost:${port}.`);
  }
});
