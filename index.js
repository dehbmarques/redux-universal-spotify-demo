/**
 * Define isomorphic constants.
 */
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

const piping = require('piping')({
  hook: true
});

if ((__DEVELOPMENT__ && !piping)) {
  return;
}

require('./babel.server');
