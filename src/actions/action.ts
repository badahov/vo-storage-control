import toUpper from 'lodash/toUpper';

export default function index(
  modelName: string,
  workers: (action: string, data: object | null, options: object | null) => Promise<any> | object,
) {
  const MODEL_NAME = toUpper(modelName);

  return (action: string, data = null, options = null) => ({
    type: `${MODEL_NAME}`,
    actions: [
      `${MODEL_NAME}_${toUpper(action)}_STATUS`,
      `${MODEL_NAME}_${toUpper(action)}_RESULT`,
      `${MODEL_NAME}_${toUpper(action)}_MESSAGE`,
    ],
    result: workers(action, data, options),
  });
}
