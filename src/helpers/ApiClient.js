import superagent from 'superagent';
import every from 'lodash/collection/every';
import includes from 'lodash/collection/includes';
import pluck from 'lodash/collection/pluck';
import flatten from 'lodash/array/flatten';
import values from 'lodash/object/values';
import isPlainObject from 'lodash/lang/isPlainObject';
import { Schema, arrayOf, normalize } from 'normalizr';
import { camelizeKeys } from 'humps';

const API_ROOT = 'https://api.spotify.com/v1';
const methods = ['get', 'post', 'put', 'patch', 'del'];

// Schemas
const schemas = {
  artist: new Schema('artist'),
  album: new Schema('album'),
  track: new Schema('track'),
  pagination: new Schema('pagination', { idAttribute: 'ref' }),
  search: new Schema('search', { idAttribute: 'query' })
};
schemas.pagination.define({
  items: arrayOf(schemas, { schemaAttribute: 'type' })
});
schemas.search.define({
  items: arrayOf(schemas, { schemaAttribute: 'type' })
});
schemas.album.define({
  artists: arrayOf(schemas.artist),
  tracks: schemas.pagination
});

// add slash if nedded
function formatUrl (path) {

  if (path.substring(0, 4) === 'http') {
    return path;
  }

  return API_ROOT + (path[0] !== '/' ? `/${path}` : path);
}

// validates if the response is paginated
function isPaginated (data) {

  if (!isPlainObject(data)) {
    return false;
  }

  const paginationKeys = ['items', 'limit', 'next', 'offset', 'previous', 'total'];
  const keys = Object.keys(data);
  return every(paginationKeys, key => includes(keys, key));
}

function addPaginationRefs (data) {

  if (isPaginated(data)) {

    data.ref = data.href.split('?')[0].replace(`${API_ROOT}/`, '');
    data.type = 'pagination';
  }

  if (isPlainObject(data)) {
    Object.keys(data).forEach(key => addPaginationRefs(data[key]));
  }
}

function _normalize (response) {

  addPaginationRefs(response);

  const { type } = response;

  if (type && schemas[type]) {
    return normalize(response, schemas[type]);
  }

  return response;
}


/*
 * This silly underscore is here to avoid a mysterious "ReferenceError: ApiClient is not defined" error.
 * See Issue #14. https://github.com/erikras/react-redux-universal-hot-example/issues/14
 *
 * Remove it at your own risk.
 */
class _ApiClient {

  constructor (req) {

    methods.forEach(method =>

      this[method] = (path, { params, data } = {}) => new Promise((resolve, reject) => {

        const request = superagent[method](formatUrl(path));

        if (params) {
          request.query(params);
        }

        if (__SERVER__ && req.get('cookie')) {
          request.set('cookie', req.get('cookie'));
        }

        if (data) {
          request.send(data);
        }

        request.end((err, { body } = {}) =>
          err ?
          reject(camelizeKeys(body.error || err)) :
          resolve(camelizeKeys(body))
        );
      }));
  }

  getAndNormalize (url) {

    return this.get(url).then(_normalize);
  }

  search (query) {

    return this.get('search', {
      params: {
        query,
        type: 'artist,album',
        limit: 5
      }
    })
    .then(body => _normalize({
      query,
      type: 'search',
      items: flatten(pluck(values(body), 'items'))
    }));
  }

}

const ApiClient = _ApiClient;

export default ApiClient;
