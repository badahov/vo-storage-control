import { combineReducers } from 'redux';
import toUpper from 'lodash/toUpper';
import includes from 'lodash/includes';

const actionReducers = (status) => (state = null, action) => {
  if (includes(status, action.type)) {
    return action.data;
  } else {
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
        ['status', 'result', 'message'].forEach(type => {
          let action = toUpper(`${moduleName}_${name}_${event}_${type}`);

          events[type] = actionReducers([action]);
        });

        result[event] = combineReducers(events);
    });

    reducers[name] = combineReducers(result);
  });

  return combineReducers(reducers);
};

export default doCombineReducers;
