import toUpper from 'lodash/toUpper';

export default function actionModel(
  moduleName: string,
  modelName: string,
  workers: (action: string, data: object | null) => Promise<any> | object,
) {
  const MODULE_NAME = toUpper(moduleName);

  return (action: string, data = null, callback = null) => ({
    type: `${MODULE_NAME}`,
    actions: [
      `${MODULE_NAME}_${toUpper(modelName)}_${toUpper(action)}_STATUS`,
      `${MODULE_NAME}_${toUpper(modelName)}_${toUpper(action)}_RESULT`,
      `${MODULE_NAME}_${toUpper(modelName)}_${toUpper(action)}_MESSAGE`,
    ],
    result: workers(action, data),
    callback,
  });
}
