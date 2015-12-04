import React from 'react';
import {IndexRoute, Route} from 'react-router';
import {
    App,
    Home,
    Album,
    Artist,
    NotFound
  } from './containers';

export default () => {

  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="artist/:id" component={Artist} />
      <Route path="album/:id" component={Album} />
      <Route path="not-found" component={NotFound} status={404} />
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
