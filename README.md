# vo-storage-control
Storage control

Установка: 
```
npm i vo-storage-control
```

Настройка файла configureStore.js:
```javascript
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { middleware, reducer } from 'vo-storage-control';

const middlewareAll = [
  middleware('moduleName'),
  thunk,
];

const module = {
  name: 'moduleName',
  models: [
    {
      name: 'modelName',
      events: ['filter', 'data', {name: 'DefaultName'}],
    },
  ],
};

export default createStore(combineReducers({
  modelName: reducer(module),
}), applyMiddleware(...middlewareAll));
```

Настройка слоя redux:
```javascript
import { connectAdvanced, shallowEqual } from 'react-redux';
import { bindActionCreators } from 'redux';
import isNull from 'lodash/isNull';
import { actions } from 'vo-storage-control';

// Описание ниже
import service from '../services/servicName';

import MyReactComponent from './myReactComponent';// Любой компонент React

export default connectAdvanced((dispatch) => {
  let result = {};

  const worker = actions('moduleName', service);
  const bindAction = bindActionCreators({ worker }, dispatch);

  return (nextState, nextOwnProps) => {
    const modelItems = (data) => {
      bindAction.worker('modelName_data', data, null);
      bindAction.worker('modelName_filter', data, null);
    };

    // Здесь можно определить props для компонента
    const items = isNull(nextState['moduleName']['modelName'].data.result)
      ? null
      : nextState['moduleName']['modelName'].data.result.items;

    const nextResult = {
      ...nextOwnProps,
      items,
      models: {
        modelItems,
      },
    };
    if (!shallowEqual(result, nextResult)) {
      result = nextResult;
    }

    return result;
  };
})(MyReactComponent);
```

Файл service:
```javascript
export default function actionService(action, data, options) {
  switch (toUpper(action)) {
    case 'MODELNAME_HEADER':
      return {
        status: 'error',
        result: null,
        msg: 'Ошибка'
      };
    case 'MODELNAME_DATA':
      return new Promise((resolve, reject) => {
        resolve({
          status: 'ok',
          result: 'test',
        });
      });
    default:
      return {
        status: 'error',
        result: null,
        msg: `Action service: ${action} не определен`
      };
  }
}
```