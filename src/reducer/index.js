import { combineReducers } from 'redux';
import toUpper from 'lodash/toUpper';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import includes from 'lodash/includes';

const actionReducers = (actionType, defaultState = null) => (state = null, action) => {
  if (includes(actionType, action.type)) {
    return action.data;
  } else {
    if (isNull(state)) {
      state = defaultState;
    }

    return state;
  }
};

const doCombineReducers = (module) => {
  const {
    models,
    name: moduleName,
  } = module;

  const reducers = {};
  models.forEach(item => {
    const { events, name } = item;
    const result = {};

    events.forEach(event => {
      let events = {};
      let eventName = null;
      if (typeof event === 'string') {
        eventName = event;
      } else if (typeof event === 'object') {
        eventName = Object.keys(event)[0];
      }

      if (!isUndefined(eventName) && !isNull(eventName)) {
        ['status', 'result', 'message'].forEach(argument => {
          let actionType = toUpper(`${moduleName}_${name}_${event}_${argument}`);

          let defaultState = null;
          if (argument === 'status') {
            defaultState = 'start';
          } else if (argument === 'result') {
            defaultState = isNull(event[eventName]) ? null : event[eventName];
          }

          events[argument] = actionReducers(actionType, defaultState);
        });

        result[eventName] = combineReducers(events);
      }
    });

    reducers[name] = combineReducers(result);
  });

  return combineReducers(reducers);
};

export default doCombineReducers;
