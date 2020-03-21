import toUpper from 'lodash/toUpper';
import isFunction from 'lodash/isFunction';

const middlewareAction = (store, action) => {
  const STATUS_WAIT = 'wait';
  const STATUS_OK = 'ok';
  const STATUS_ERROR = 'error';
  const [status, result, message] = action.actions;
  const callback = action.callback;

  const processResult = (data) => {
    if (data.hasOwnProperty('status') && data.hasOwnProperty('result')) {
      if (data.status === STATUS_OK) {
        store.dispatch({
          type: toUpper(result),
          data: data.result,
        });

        if (data.hasOwnProperty('msg')) {
          store.dispatch({
            type: toUpper(message),
            data: data.msg,
          });
        }

        store.dispatch({
          type: toUpper(status),
          data: STATUS_OK,
        });

        if (isFunction(callback)) {
          callback(data);
        }

        return data.result;
      } else if (data.status === STATUS_ERROR) {
        if (data.hasOwnProperty('msg')) {
          throw data.msg;
        } else {
          store.dispatch({
            type: toUpper(status),
            data: STATUS_ERROR,
          });
        }
      } else {
        throw `Получен не поддерживаемый статус: '${data.status}'`;
      }
    } else {
      throw 'Получен объект с неверной структурой | {status, result}';
    }
  };

  store.dispatch({
    type: toUpper(status),
    data: STATUS_WAIT,
  });

  if (action.result.constructor.name === 'Promise') {
    action.result.then((response) => {
      let data = null;

      if (response.hasOwnProperty('request') && response.request instanceof XMLHttpRequest) {
        data = response.data;
      } else if (response.hasOwnProperty('status') && response.hasOwnProperty('result')) {
        data = response;
      } else {
        throw 'Promise вернул объект с неверной структурой';
      }

      return processResult(data);
    }).catch((error) => {
      store.dispatch({
        type: toUpper(status),
        data: STATUS_ERROR,
      });

      store.dispatch({
        type: toUpper(message),
        data: error,
      });
    });
  } else {
    try {
      return processResult(action.result);
    } catch (error) {
      store.dispatch({
        type: toUpper(status),
        data: STATUS_ERROR,
      });

      store.dispatch({
        type: toUpper(message),
        data: error,
      });
    }
  }

  return true;
};

export default middlewareAction;
