import toUpper from 'lodash/toUpper';

export default function index(modelName, workers) {
  const MODEL_NAME = toUpper(modelName);

  return (action, data = null, options = null) => {
    return {
      type: `${MODEL_NAME}`,
      actions: [
        `${MODEL_NAME}_${toUpper(action)}_STATUS`,
        `${MODEL_NAME}_${toUpper(action)}_RESULT`,
        `${MODEL_NAME}_${toUpper(action)}_MESSAGE`,
      ],
      result: workers(action, data, options),
    };
  }
}
