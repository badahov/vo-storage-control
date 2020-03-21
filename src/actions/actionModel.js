import toUpper from 'lodash/toUpper';

export default function actionModel(moduleName, modelName, workers) {
  const MODULE_NAME = toUpper(moduleName);

  return (action, data = null, callback = null) => {
    return {
      type: `${MODULE_NAME}`,
      actions: [
        `${MODULE_NAME}_${toUpper(modelName)}_${toUpper(action)}_STATUS`,
        `${MODULE_NAME}_${toUpper(modelName)}_${toUpper(action)}_RESULT`,
        `${MODULE_NAME}_${toUpper(modelName)}_${toUpper(action)}_MESSAGE`,
      ],
      result: workers(action, data),
      callback: callback,
    };
  }
}
