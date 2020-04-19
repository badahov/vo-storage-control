import toUpper from 'lodash/toUpper';
import isFunction from 'lodash/isFunction';

const middlewareAction = (store, action) => {
  const STATUS_WAIT = 'wait';
  const STATUS_OK = 'ok';
  const STATUS_ERROR = 'error';

  const {
    callback,
    actions: [status, result, message],
  } = action;

  const processResult = (data, dispatch) => {
    if (Object.prototype.hasOwnProperty.call(data, 'status')
      && Object.prototype.hasOwnProperty.call(data, 'result')) {
      if (data.status === STATUS_OK) {
        dispatch({
          type: toUpper(result),
          data: data.result,
        });

        if (Object.prototype.hasOwnProperty.call(data, 'msg') && data.msg !== '') {
          dispatch({
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
      } else if (data.status === STATUS_ERROR) {
        if (isFunction(callback)) {
          callback(data);
        }

        if (Object.prototype.hasOwnProperty.call(data, 'msg') && data.msg !== '') {
          throw data.msg;
        } else {
          dispatch({
            type: toUpper(status),
            data: STATUS_ERROR,
          });
        }
      } else {
        throw new Error(`Получен не поддерживаемый статус: '${data.status}'`);
      }
    } else {
      throw new Error('Получен объект с неверной структурой | {status, result}');
    }
  };

  store.dispatch({
    type: toUpper(status),
    data: STATUS_WAIT,
  });

  if (action.result.constructor.name === 'Promise') {
    // eslint-disable-next-line consistent-return
    store.dispatch(async (dispatch) => {
      const promise = await action.result;

      const {
        data,
      } = promise;

      processResult(data, dispatch);
    });
  } else {
    try {
      store.dispatch((dispatch) => {
        processResult(action.result, dispatch);
      });
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
};

export default middlewareAction;
