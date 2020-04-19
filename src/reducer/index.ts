import { combineReducers } from 'redux';
import toUpper from 'lodash/toUpper';
import isNull from 'lodash/isNull';
import isNil from 'lodash/isNil';
import includes from 'lodash/includes';
import assign from 'lodash/assign';
import reduce from 'lodash/reduce';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import keys from 'lodash/keys';

const actionReducers = (actionType: string, defaultState = null) => (state = null, action) => {
  if (includes(actionType, action.type)) {
    return action.data;
  }

  if (isNull(state)) {
    assign(state, defaultState);
  }

  return state;
};

const doCombineReducers = (module: {
  models: Array<{events: Array<string|{name: string}>, name: string}>
  name: string
}) => {
  const {
    models,
    name: moduleName,
  } = module;

  /* eslint-disable no-param-reassign */
  const reducers = reduce(models, (reducersAcc, item) => {
    const { events, name } = item;

    const result = reduce(events, (resultAcc, event) => {
      let eventName = null;

      if (isString(event)) {
        eventName = event;
      } else if (isObject(event)) {
        [eventName] = keys(event);
      }

      if (!isNil(eventName)) {
        const actions = reduce(['status', 'result', 'message'], (actionsAcc, argument) => {
          const actionType = toUpper(`${moduleName}_${name}_${event}_${argument}`);

          let defaultState = null;
          if (argument === 'status') {
            defaultState = 'start';
          } else if (argument === 'result') {
            defaultState = isNull(event[eventName]) ? null : event[eventName];
          }

          actionsAcc[argument] = actionReducers(actionType, defaultState);
          return actionsAcc;
        }, {});

        resultAcc[eventName] = combineReducers(actions);
      }

      return resultAcc;
    }, {});

    reducersAcc[name] = combineReducers(result);

    return reducersAcc;
  }, {});
  /* eslint-disable no-param-reassign */

  return combineReducers(reducers);
};

export default doCombineReducers;
