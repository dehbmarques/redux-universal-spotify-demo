import Immutable, { Map, fromJS } from 'immutable';

const LOAD_NEXT_PAGE = 'redux-spotify-demo/entities/LOAD_NEXT_PAGE';
const LOAD_NEXT_PAGE_SUCCESS = 'redux-spotify-demo/entities/LOAD_NEXT_PAGE_SUCCESS';
const LOAD_NEXT_PAGE_FAIL = 'redux-spotify-demo/entities/LOAD_NEXT_PAGE_FAIL';

function _resolveEntities (state, action) {

  if (action.result && action.result.entities) {

    let entities = fromJS(action.result.entities);

    // resolve pagination
    const pagination = entities.get('pagination');
    if (pagination) {

      pagination.keySeq().forEach(key => {

        const items = state.getIn(['pagination', key, 'items']);

        if (items) {

          // remove duplicated items
          const newItems = pagination.getIn([key, 'items']).filter(
            newItem => !items.find(
              item => Immutable.is(item, newItem)
            )
          );

          entities = entities.setIn(['pagination', key, 'items'], items.concat(newItems));
        }
      });
    }

    // merge state
    return state.mergeDeep(entities);
  }

  return state;
}

const initialState = new Map();

export default function reducer (state = initialState, action = {}) {

  let _state = state;

  switch (action.type) {
    case LOAD_NEXT_PAGE:
      _state = _state.setIn(['pagination', action.ref, 'isFetching'], true);
      break;
    case LOAD_NEXT_PAGE_SUCCESS:
    case LOAD_NEXT_PAGE_FAIL:
      _state = _state.setIn(['pagination', action.ref, 'isFetching'], false);
      break;
    default:
  }

  return _resolveEntities(_state, action);
}

export function isLoaded (globalState, entityName, id) {

  return globalState.entities && globalState.entities.getIn([entityName, id]);
}

export function denormalizePagination (globalState, key) {

  const { entities } = globalState;
  const page = entities.getIn(['pagination', key]);

  return page && page.update('items', items =>
    items.map(item =>
      entities.getIn([item.get('schema'), item.get('id')])
    )
  );
}

export function loadNextPage (ref, next) {

  return {
    ref: ref,
    types: [LOAD_NEXT_PAGE, LOAD_NEXT_PAGE_SUCCESS, LOAD_NEXT_PAGE_FAIL],
    promise: (client) => client.getAndNormalize(next)
  };
}
