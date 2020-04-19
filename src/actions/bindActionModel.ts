import { bindActionCreators } from 'redux';
import actions from './actionModel';

export default function bindActionModel(
  moduleName: string,
  modelName: string,
  service: (action: string, data: object | null) => Promise<any> | object,
  dispatch : () => any,
) {
  const worker = actions(moduleName, modelName, service);
  return bindActionCreators({ worker }, dispatch).worker;
}
